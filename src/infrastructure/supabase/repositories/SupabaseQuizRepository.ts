/**
 * 🎯 SUPABASE QUIZ REPOSITORY - Infrastructure Implementation
 * 
 * Implementação concreta do QuizRepository usando Supabase.
 * Mapeia as entidades de domínio Quiz para as tabelas do banco.
 */

import { supabase } from '@/integrations/supabase/client';
import { 
  Quiz, 
  Question, 
  ResultProfile, 
  QuizRepository,
  QuizFilters,
  QuizSortOptions,
  PaginationOptions,
  PaginatedResult
} from '@/core/domains';

interface SupabaseFunnel {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  is_published: boolean;
  version: number;
  settings?: any;
  created_at: string;
  updated_at: string;
}

interface SupabaseFunnelPage {
  id: string;
  funnel_id: string;
  page_type: string;
  title?: string;
  page_order: number;
  blocks: any[];
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export class SupabaseQuizRepository implements QuizRepository {
  // 🔍 Quiz CRUD Operations
  async save(quiz: Quiz): Promise<Quiz> {
    try {
      const funnelData: Partial<SupabaseFunnel> = {
        id: quiz.id,
        name: quiz.metadata.title,
        description: quiz.metadata.description,
        user_id: quiz.metadata.createdBy,
        is_published: quiz.metadata.isPublished,
        version: 1,
        settings: {
          ...quiz.settings,
          branding: quiz.branding,
          category: quiz.metadata.category,
          tags: quiz.metadata.tags,
          difficulty: quiz.metadata.difficulty,
          estimatedDuration: quiz.metadata.estimatedDuration
        }
      };

      const { data, error } = await supabase
        .from('funnels')
        .upsert(funnelData)
        .select()
        .single();

      if (error) throw error;

      // Criar páginas para as perguntas e resultados
      await this.syncQuizPages(quiz);

      return quiz;
    } catch (error) {
      console.error('Error saving quiz:', error);
      throw new Error(`Failed to save quiz: ${error}`);
    }
  }

  async findById(id: string): Promise<Quiz | null> {
    try {
      const { data: funnelData, error: funnelError } = await supabase
        .from('funnels')
        .select('*')
        .eq('id', id)
        .single();

      if (funnelError || !funnelData) return null;

      const { data: pagesData, error: pagesError } = await supabase
        .from('funnel_pages')
        .select('*')
        .eq('funnel_id', id)
        .order('page_order');

      if (pagesError) throw pagesError;

      return this.mapToQuizEntity(funnelData, pagesData || []);
    } catch (error) {
      console.error('Error finding quiz by id:', error);
      return null;
    }
  }

  async findAll(
    filters?: QuizFilters,
    sort?: QuizSortOptions,
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<Quiz>> {
    try {
      let query = supabase
        .from('funnels')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters?.isPublished !== undefined) {
        query = query.eq('is_published', filters.isPublished);
      }

      if (filters?.searchTerm) {
        query = query.or(`name.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
      }

      if (filters?.createdAfter) {
        query = query.gte('created_at', filters.createdAfter.toISOString());
      }

      if (filters?.createdBefore) {
        query = query.lte('created_at', filters.createdBefore.toISOString());
      }

      // Apply sorting
      if (sort) {
        const dbField = this.mapSortField(sort.field);
        query = query.order(dbField, { ascending: sort.direction === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      if (pagination) {
        const start = (pagination.page - 1) * pagination.limit;
        const end = start + pagination.limit - 1;
        query = query.range(start, end);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      const quizzes = await Promise.all(
        (data || []).map(async (funnelData) => {
          const { data: pagesData } = await supabase
            .from('funnel_pages')
            .select('*')
            .eq('funnel_id', funnelData.id)
            .order('page_order');

          return this.mapToQuizEntity(funnelData, pagesData || []);
        })
      );

      return {
        items: quizzes,
        total: count || 0,
        page: pagination?.page || 1,
        limit: pagination?.limit || 10,
        totalPages: Math.ceil((count || 0) / (pagination?.limit || 10))
      };
    } catch (error) {
      console.error('Error finding all quizzes:', error);
      throw new Error(`Failed to find quizzes: ${error}`);
    }
  }

  async update(id: string, updates: Partial<Quiz>): Promise<Quiz> {
    try {
      const updateData: Partial<SupabaseFunnel> = {};

      if (updates.metadata) {
        if (updates.metadata.title) updateData.name = updates.metadata.title;
        if (updates.metadata.description) updateData.description = updates.metadata.description;
        if (updates.metadata.isPublished !== undefined) updateData.is_published = updates.metadata.isPublished;
      }

      if (updates.settings || updates.branding) {
        const { data: currentData } = await supabase
          .from('funnels')
          .select('settings')
          .eq('id', id)
          .single();

        updateData.settings = {
          ...currentData?.settings,
          ...(updates.settings || {}),
          branding: {
            ...currentData?.settings?.branding,
            ...(updates.branding || {})
          }
        };
      }

      const { data, error } = await supabase
        .from('funnels')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Buscar quiz completo atualizado
      const updatedQuiz = await this.findById(id);
      if (!updatedQuiz) throw new Error('Quiz not found after update');

      return updatedQuiz;
    } catch (error) {
      console.error('Error updating quiz:', error);
      throw new Error(`Failed to update quiz: ${error}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      // Deletar páginas relacionadas primeiro (cascade)
      await supabase
        .from('funnel_pages')
        .delete()
        .eq('funnel_id', id);

      const { error } = await supabase
        .from('funnels')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting quiz:', error);
      return false;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('funnels')
        .select('id')
        .eq('id', id)
        .single();

      return !error && !!data;
    } catch {
      return false;
    }
  }

  // 🔍 Quiz Business Operations
  async publish(id: string): Promise<Quiz> {
    const quiz = await this.findById(id);
    if (!quiz) throw new Error('Quiz not found');

    const publishedQuiz = quiz.publish();
    return this.save(publishedQuiz);
  }

  async unpublish(id: string): Promise<Quiz> {
    const quiz = await this.findById(id);
    if (!quiz) throw new Error('Quiz not found');

    const unpublishedQuiz = quiz.unpublish();
    return this.save(unpublishedQuiz);
  }

  async clone(id: string, newTitle?: string): Promise<Quiz> {
    const originalQuiz = await this.findById(id);
    if (!originalQuiz) throw new Error('Quiz not found');

    const clonedQuiz = originalQuiz.clone(`${id}-copy`, newTitle);
    return this.save(clonedQuiz);
  }

  async findByCategory(category: string): Promise<Quiz[]> {
    const result = await this.findAll({ category });
    return result.items;
  }

  async findByTags(tags: string[]): Promise<Quiz[]> {
    const result = await this.findAll({ tags });
    return result.items;
  }

  async search(searchTerm: string): Promise<Quiz[]> {
    const result = await this.findAll({ searchTerm });
    return result.items;
  }

  // 🔍 Question Management (simplified - questions are stored as pages)
  async addQuestion(quizId: string, question: Question): Promise<Quiz> {
    const quiz = await this.findById(quizId);
    if (!quiz) throw new Error('Quiz not found');

    const updatedQuiz = quiz.addQuestion(question.id);
    await this.save(updatedQuiz);

    // Create funnel page for question
    await supabase
      .from('funnel_pages')
      .insert({
        id: question.id,
        funnel_id: quizId,
        page_type: 'quiz-question',
        title: question.title,
        page_order: question.metadata.order,
        blocks: [this.mapQuestionToBlock(question)],
        metadata: {
          questionData: question.toJSON()
        }
      });

    return updatedQuiz;
  }

  async removeQuestion(quizId: string, questionId: string): Promise<Quiz> {
    const quiz = await this.findById(quizId);
    if (!quiz) throw new Error('Quiz not found');

    const updatedQuiz = quiz.removeQuestion(questionId);
    await this.save(updatedQuiz);

    // Remove question page
    await supabase
      .from('funnel_pages')
      .delete()
      .eq('id', questionId)
      .eq('funnel_id', quizId);

    return updatedQuiz;
  }

  async updateQuestion(quizId: string, questionId: string, updates: Partial<Question>): Promise<Question> {
    // This is a simplified implementation
    // In a real scenario, you'd want more sophisticated question management
    throw new Error('Question updates not implemented yet');
  }

  async reorderQuestions(quizId: string, questionIds: string[]): Promise<Quiz> {
    // Update page order for questions
    await Promise.all(
      questionIds.map((questionId, index) =>
        supabase
          .from('funnel_pages')
          .update({ page_order: index + 1 })
          .eq('id', questionId)
          .eq('funnel_id', quizId)
      )
    );

    const quiz = await this.findById(quizId);
    if (!quiz) throw new Error('Quiz not found');

    return quiz;
  }

  async findQuestionsByQuiz(quizId: string): Promise<Question[]> {
    const { data, error } = await supabase
      .from('funnel_pages')
      .select('*')
      .eq('funnel_id', quizId)
      .eq('page_type', 'quiz-question')
      .order('page_order');

    if (error) throw error;

    return (data || []).map(page => this.mapPageToQuestion(page));
  }

  // 🔍 Result Profile Management (simplified)
  async addResultProfile(quizId: string, resultProfile: ResultProfile): Promise<Quiz> {
    const quiz = await this.findById(quizId);
    if (!quiz) throw new Error('Quiz not found');

    const updatedQuiz = quiz.addResultProfile(resultProfile.id);
    await this.save(updatedQuiz);

    // Create funnel page for result
    await supabase
      .from('funnel_pages')
      .insert({
        id: resultProfile.id,
        funnel_id: quizId,
        page_type: 'quiz-result',
        title: resultProfile.content.title,
        page_order: 999, // Results at the end
        blocks: [this.mapResultToBlock(resultProfile)],
        metadata: {
          resultData: resultProfile.toJSON()
        }
      });

    return updatedQuiz;
  }

  async removeResultProfile(quizId: string, resultProfileId: string): Promise<Quiz> {
    const quiz = await this.findById(quizId);
    if (!quiz) throw new Error('Quiz not found');

    // Remove result page
    await supabase
      .from('funnel_pages')
      .delete()
      .eq('id', resultProfileId)
      .eq('funnel_id', quizId);

    return quiz;
  }

  async updateResultProfile(quizId: string, resultProfileId: string, updates: Partial<ResultProfile>): Promise<ResultProfile> {
    throw new Error('Result profile updates not implemented yet');
  }

  async findResultProfilesByQuiz(quizId: string): Promise<ResultProfile[]> {
    const { data, error } = await supabase
      .from('funnel_pages')
      .select('*')
      .eq('funnel_id', quizId)
      .eq('page_type', 'quiz-result')
      .order('page_order');

    if (error) throw error;

    return (data || []).map(page => this.mapPageToResultProfile(page));
  }

  // 🔍 Analytics & Statistics
  async getQuizStats(id: string): Promise<{
    totalParticipants: number;
    completionRate: number;
    averageScore: number;
    averageTimeSpent: number;
    mostSelectedAnswers: Record<string, string>;
    resultDistribution: Record<string, number>;
  }> {
    try {
      // Get total participants from quiz_sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('quiz_sessions')
        .select('id, status, score, started_at, completed_at')
        .eq('funnel_id', id);

      if (sessionsError) throw sessionsError;

      const totalParticipants = sessionsData?.length || 0;
      const completedSessions = sessionsData?.filter(s => s.status === 'completed') || [];
      const completionRate = totalParticipants > 0 ? completedSessions.length / totalParticipants : 0;

      const averageScore = completedSessions.length > 0 
        ? completedSessions.reduce((sum, s) => sum + (s.score || 0), 0) / completedSessions.length 
        : 0;

      // Calculate average time spent
      const sessionsWithTime = completedSessions.filter(s => s.started_at && s.completed_at);
      const averageTimeSpent = sessionsWithTime.length > 0
        ? sessionsWithTime.reduce((sum, s) => {
            const duration = new Date(s.completed_at!).getTime() - new Date(s.started_at).getTime();
            return sum + duration;
          }, 0) / sessionsWithTime.length / 1000 // Convert to seconds
        : 0;

      // Get most selected answers from quiz_step_responses
      const { data: responsesData } = await supabase
        .from('quiz_step_responses')
        .select('answer_value, answer_text')
        .in('session_id', sessionsData?.map(s => s.id) || []);

      const answerCounts: Record<string, number> = {};
      responsesData?.forEach(response => {
        const key = response.answer_text || response.answer_value || 'Unknown';
        answerCounts[key] = (answerCounts[key] || 0) + 1;
      });

      const mostSelectedAnswers = Object.entries(answerCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value.toString() }), {});

      // Get result distribution from quiz_results
      const { data: resultsData } = await supabase
        .from('quiz_results')
        .select('result_type')
        .in('session_id', completedSessions.map(s => s.id));

      const resultDistribution: Record<string, number> = {};
      resultsData?.forEach(result => {
        const type = result.result_type || 'Unknown';
        resultDistribution[type] = (resultDistribution[type] || 0) + 1;
      });

      return {
        totalParticipants,
        completionRate,
        averageScore,
        averageTimeSpent,
        mostSelectedAnswers,
        resultDistribution
      };
    } catch (error) {
      console.error('Error getting quiz stats:', error);
      throw new Error(`Failed to get quiz stats: ${error}`);
    }
  }

  async getMostPopularQuizzes(limit: number = 10): Promise<Quiz[]> {
    try {
      // Get quizzes ordered by number of sessions
      const { data, error } = await supabase
        .from('funnels')
        .select(`
          *,
          quiz_sessions!inner(count)
        `)
        .order('quiz_sessions(count)', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return Promise.all(
        (data || []).map(async (funnelData) => {
          const { data: pagesData } = await supabase
            .from('funnel_pages')
            .select('*')
            .eq('funnel_id', funnelData.id)
            .order('page_order');

          return this.mapToQuizEntity(funnelData, pagesData || []);
        })
      );
    } catch (error) {
      console.error('Error getting most popular quizzes:', error);
      return [];
    }
  }

  async getRecentQuizzes(limit: number = 10): Promise<Quiz[]> {
    const result = await this.findAll(
      undefined,
      { field: 'createdAt', direction: 'desc' },
      { page: 1, limit }
    );
    return result.items;
  }

  // 🔍 Bulk Operations
  async bulkDelete(ids: string[]): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('funnels')
        .delete()
        .in('id', ids);

      return !error;
    } catch {
      return false;
    }
  }

  async bulkPublish(ids: string[]): Promise<Quiz[]> {
    return Promise.all(ids.map(id => this.publish(id)));
  }

  async bulkUnpublish(ids: string[]): Promise<Quiz[]> {
    return Promise.all(ids.map(id => this.unpublish(id)));
  }

  async bulkUpdateCategory(ids: string[], category: string): Promise<Quiz[]> {
    // This would need to update the settings field in the database
    // Simplified implementation
    return Promise.all(
      ids.map(async (id) => {
        const quiz = await this.findById(id);
        if (quiz) {
          quiz.metadata.category = category;
          return this.save(quiz);
        }
        throw new Error(`Quiz ${id} not found`);
      })
    );
  }

  // 🔍 Private Helper Methods
  private async syncQuizPages(quiz: Quiz): Promise<void> {
    // This is a simplified implementation
    // In a real scenario, you'd sync questions and results as pages
    const existingPages = await supabase
      .from('funnel_pages')
      .select('id')
      .eq('funnel_id', quiz.id);

    // Basic page creation logic would go here
  }

  private mapToQuizEntity(funnelData: SupabaseFunnel, pagesData: SupabaseFunnelPage[]): Quiz {
    const settings = funnelData.settings || {};
    
    return new Quiz(
      funnelData.id,
      {
        title: funnelData.name,
        description: funnelData.description,
        category: settings.category || 'general',
        tags: settings.tags || [],
        estimatedDuration: settings.estimatedDuration || 5,
        difficulty: settings.difficulty || 'medium',
        isPublished: funnelData.is_published,
        publishedAt: funnelData.is_published ? new Date(funnelData.updated_at) : undefined,
        createdAt: new Date(funnelData.created_at),
        updatedAt: new Date(funnelData.updated_at)
      },
      {
        allowRestart: settings.allowRestart ?? true,
        showProgress: settings.showProgress ?? true,
        shuffleQuestions: settings.shuffleQuestions ?? false,
        timeLimit: settings.timeLimit,
        passingScore: settings.passingScore,
        maxAttempts: settings.maxAttempts,
        collectEmail: settings.collectEmail ?? true,
        collectPhone: settings.collectPhone ?? false
      },
      settings.branding || {
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        fontFamily: 'Inter, sans-serif'
      },
      pagesData.filter(p => p.page_type === 'quiz-question').map(p => p.id),
      pagesData.filter(p => p.page_type === 'quiz-result').map(p => p.id)
    );
  }

  private mapSortField(field: string): string {
    const fieldMap: Record<string, string> = {
      'title': 'name',
      'createdAt': 'created_at',
      'updatedAt': 'updated_at',
      'category': 'settings->category',
      'difficulty': 'settings->difficulty'
    };
    return fieldMap[field] || 'created_at';
  }

  private mapQuestionToBlock(question: Question): any {
    return {
      id: question.id,
      type: 'quiz-question',
      content: {
        title: question.title,
        description: question.description,
        options: question.options
      },
      questionType: question.type,
      validation: question.validation,
      logic: question.logic
    };
  }

  private mapResultToBlock(resultProfile: ResultProfile): any {
    return {
      id: resultProfile.id,
      type: 'quiz-result',
      content: resultProfile.content,
      visuals: resultProfile.visuals,
      actions: resultProfile.actions
    };
  }

  private mapPageToQuestion(page: SupabaseFunnelPage): Question {
    const questionData = page.metadata?.questionData;
    if (questionData) {
      return Question.fromJSON(questionData);
    }

    // Fallback mapping from block data
    const block = page.blocks[0];
    return new Question(
      page.id,
      block?.questionType || 'text-input',
      block?.content?.title || page.title || '',
      block?.content?.description,
      block?.content?.options || [],
      undefined,
      block?.validation || { required: true },
      block?.logic,
      {
        order: page.page_order,
        createdAt: new Date(page.created_at),
        updatedAt: new Date(page.updated_at)
      }
    );
  }

  private mapPageToResultProfile(page: SupabaseFunnelPage): ResultProfile {
    const resultData = page.metadata?.resultData;
    if (resultData) {
      return ResultProfile.fromJSON(resultData);
    }

    // Fallback mapping from block data
    const block = page.blocks[0];
    return ResultProfile.createBasicResult(
      page.id,
      page.title || 'Result',
      block?.content?.title || 'Result',
      block?.content?.description || 'Your result',
      0,
      100
    );
  }
}