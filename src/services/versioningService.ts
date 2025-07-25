// =============================================================================
// SISTEMA DE VERSIONAMENTO PARA QUIZZES
// Controle de versões e histórico de alterações
// =============================================================================

import { supabase } from '../lib/supabase';

// =============================================================================
// TIPOS
// =============================================================================

export interface QuizVersion {
  id: string;
  quiz_id: string;
  version_number: string;
  title: string;
  description?: string;
  data: {
    quiz: any;
    questions: any[];
    settings: any;
  };
  changes_summary: string;
  created_by: string;
  created_at: string;
  is_current: boolean;
  file_size: number;
  parent_version_id?: string;
}

export interface VersionChange {
  type: 'added' | 'modified' | 'deleted';
  entity: 'quiz' | 'question' | 'option' | 'setting';
  field?: string;
  old_value?: any;
  new_value?: any;
  description: string;
}

export interface VersionComparison {
  version_a: QuizVersion;
  version_b: QuizVersion;
  changes: VersionChange[];
  statistics: {
    total_changes: number;
    additions: number;
    modifications: number;
    deletions: number;
  };
}

// =============================================================================
// SERVIÇO DE VERSIONAMENTO
// =============================================================================

export class VersioningService {
  
  // Criar nova versão do quiz
  static async createVersion(
    quizId: string,
    changesSummary: string,
    data?: {
      quiz?: any;
      questions?: any[];
      settings?: any;
    }
  ): Promise<QuizVersion> {
    try {
      // Se não forneceu dados, buscar estado atual
      let versionData = data;
      if (!versionData) {
        const [quizResult, questionsResult] = await Promise.all([
          supabase.from('quizzes').select('*').eq('id', quizId).single(),
          supabase.from('questions').select('*').eq('quiz_id', quizId).order('order_index')
        ]);

        if (quizResult.error) throw quizResult.error;
        if (questionsResult.error) throw questionsResult.error;

        versionData = {
          quiz: quizResult.data,
          questions: questionsResult.data,
          settings: quizResult.data.settings || {}
        };
      }

      // Buscar última versão para gerar número
      const { data: lastVersion, error: lastVersionError } = await supabase
        .from('quiz_versions')
        .select('version_number')
        .eq('quiz_id', quizId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (lastVersionError) throw lastVersionError;

      // Gerar próximo número de versão
      const nextVersionNumber = this.generateNextVersion(lastVersion?.version_number);

      // Marcar versões anteriores como não atuais
      await supabase
        .from('quiz_versions')
        .update({ is_current: false })
        .eq('quiz_id', quizId);

      // Calcular tamanho do arquivo
      const fileSize = new Blob([JSON.stringify(versionData)]).size;

      // Criar nova versão
      const version = {
        quiz_id: quizId,
        version_number: nextVersionNumber,
        title: versionData.quiz.title,
        description: versionData.quiz.description,
        data: versionData,
        changes_summary: changesSummary,
        is_current: true,
        file_size: fileSize,
        parent_version_id: lastVersion?.id || null
      };

      const { data: newVersion, error } = await supabase
        .from('quiz_versions')
        .insert([version])
        .select()
        .single();

      if (error) throw error;
      return newVersion as QuizVersion;

    } catch (error) {
      console.error('Erro ao criar versão:', error);
      throw error;
    }
  }

  // Buscar versões do quiz
  static async getVersions(
    quizId: string,
    options?: {
      limit?: number;
      offset?: number;
      includeData?: boolean;
    }
  ): Promise<QuizVersion[]> {
    try {
      let query = supabase
        .from('quiz_versions')
        .select(options?.includeData ? '*' : 'id, quiz_id, version_number, title, description, changes_summary, created_by, created_at, is_current, file_size, parent_version_id')
        .eq('quiz_id', quizId)
        .order('created_at', { ascending: false });

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as QuizVersion[];

    } catch (error) {
      console.error('Erro ao buscar versões:', error);
      throw error;
    }
  }

  // Buscar versão específica
  static async getVersion(versionId: string): Promise<QuizVersion> {
    try {
      const { data, error } = await supabase
        .from('quiz_versions')
        .select('*')
        .eq('id', versionId)
        .single();

      if (error) throw error;
      return data as QuizVersion;

    } catch (error) {
      console.error('Erro ao buscar versão:', error);
      throw error;
    }
  }

  // Buscar versão atual
  static async getCurrentVersion(quizId: string): Promise<QuizVersion | null> {
    try {
      const { data, error } = await supabase
        .from('quiz_versions')
        .select('*')
        .eq('quiz_id', quizId)
        .eq('is_current', true)
        .maybeSingle();

      if (error) throw error;
      return data as QuizVersion | null;

    } catch (error) {
      console.error('Erro ao buscar versão atual:', error);
      throw error;
    }
  }

  // Restaurar versão
  static async restoreVersion(versionId: string): Promise<void> {
    try {
      // Buscar versão
      const version = await this.getVersion(versionId);
      const { quiz, questions, settings } = version.data;

      // Atualizar quiz
      const { error: quizError } = await supabase
        .from('quizzes')
        .update({
          title: quiz.title,
          description: quiz.description,
          category: quiz.category,
          difficulty: quiz.difficulty,
          settings: settings
        })
        .eq('id', version.quiz_id);

      if (quizError) throw quizError;

      // Deletar perguntas existentes
      const { error: deleteError } = await supabase
        .from('questions')
        .delete()
        .eq('quiz_id', version.quiz_id);

      if (deleteError) throw deleteError;

      // Recriar perguntas
      const questionsToInsert = questions.map(q => ({
        ...q,
        id: undefined, // Remover ID para permitir regeneração
        quiz_id: version.quiz_id
      }));

      const { error: questionsError } = await supabase
        .from('questions')
        .insert(questionsToInsert);

      if (questionsError) throw questionsError;

      // Criar nova versão com a restauração
      await this.createVersion(
        version.quiz_id,
        `Restaurado para versão ${version.version_number}`,
        version.data
      );

    } catch (error) {
      console.error('Erro ao restaurar versão:', error);
      throw error;
    }
  }

  // Comparar duas versões
  static async compareVersions(
    versionAId: string,
    versionBId: string
  ): Promise<VersionComparison> {
    try {
      const [versionA, versionB] = await Promise.all([
        this.getVersion(versionAId),
        this.getVersion(versionBId)
      ]);

      const changes = this.calculateChanges(versionA.data, versionB.data);
      
      const statistics = {
        total_changes: changes.length,
        additions: changes.filter(c => c.type === 'added').length,
        modifications: changes.filter(c => c.type === 'modified').length,
        deletions: changes.filter(c => c.type === 'deleted').length
      };

      return {
        version_a: versionA,
        version_b: versionB,
        changes,
        statistics
      };

    } catch (error) {
      console.error('Erro ao comparar versões:', error);
      throw error;
    }
  }

  // Deletar versão (soft delete - marcar como deletada)
  static async deleteVersion(versionId: string): Promise<void> {
    try {
      // Verificar se não é a versão atual
      const version = await this.getVersion(versionId);
      if (version.is_current) {
        throw new Error('Não é possível deletar a versão atual');
      }

      // Soft delete - adicionar campo deleted_at
      const { error } = await supabase
        .from('quiz_versions')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', versionId);

      if (error) throw error;

    } catch (error) {
      console.error('Erro ao deletar versão:', error);
      throw error;
    }
  }

  // Exportar versão
  static async exportVersion(versionId: string): Promise<Blob> {
    try {
      const version = await this.getVersion(versionId);
      
      const exportData = {
        version: version.version_number,
        title: version.title,
        description: version.description,
        created_at: version.created_at,
        changes_summary: version.changes_summary,
        data: version.data,
        metadata: {
          exported_at: new Date().toISOString(),
          exported_by: 'current_user',
          format_version: '1.0'
        }
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });

      return blob;

    } catch (error) {
      console.error('Erro ao exportar versão:', error);
      throw error;
    }
  }

  // Gerar próximo número de versão
  private static generateNextVersion(currentVersion?: string): string {
    if (!currentVersion) {
      return '1.0.0';
    }

    const parts = currentVersion.split('.').map(Number);
    const [major, minor, patch] = parts;

    // Incrementar patch por padrão
    return `${major}.${minor}.${patch + 1}`;
  }

  // Calcular mudanças entre duas versões
  private static calculateChanges(dataA: any, dataB: any): VersionChange[] {
    const changes: VersionChange[] = [];

    // Comparar quiz
    if (dataA.quiz && dataB.quiz) {
      const quizFields = ['title', 'description', 'category', 'difficulty'];
      quizFields.forEach(field => {
        if (dataA.quiz[field] !== dataB.quiz[field]) {
          changes.push({
            type: 'modified',
            entity: 'quiz',
            field,
            old_value: dataA.quiz[field],
            new_value: dataB.quiz[field],
            description: `${field} alterado`
          });
        }
      });
    }

    // Comparar perguntas
    const questionsA = dataA.questions || [];
    const questionsB = dataB.questions || [];

    // Perguntas removidas
    questionsA.forEach((questionA: any) => {
      const exists = questionsB.find((q: any) => q.id === questionA.id);
      if (!exists) {
        changes.push({
          type: 'deleted',
          entity: 'question',
          old_value: questionA.question_text,
          description: `Pergunta removida: "${questionA.question_text}"`
        });
      }
    });

    // Perguntas adicionadas ou modificadas
    questionsB.forEach((questionB: any, index: number) => {
      const questionA = questionsA.find((q: any) => q.id === questionB.id);
      
      if (!questionA) {
        changes.push({
          type: 'added',
          entity: 'question',
          new_value: questionB.question_text,
          description: `Pergunta adicionada: "${questionB.question_text}"`
        });
      } else {
        // Verificar mudanças na pergunta
        if (questionA.question_text !== questionB.question_text) {
          changes.push({
            type: 'modified',
            entity: 'question',
            field: 'question_text',
            old_value: questionA.question_text,
            new_value: questionB.question_text,
            description: `Texto da pergunta alterado`
          });
        }

        if (questionA.question_type !== questionB.question_type) {
          changes.push({
            type: 'modified',
            entity: 'question',
            field: 'question_type',
            old_value: questionA.question_type,
            new_value: questionB.question_type,
            description: `Tipo da pergunta alterado`
          });
        }

        // Comparar opções
        const optionsA = questionA.options || [];
        const optionsB = questionB.options || [];

        if (JSON.stringify(optionsA) !== JSON.stringify(optionsB)) {
          changes.push({
            type: 'modified',
            entity: 'option',
            old_value: optionsA,
            new_value: optionsB,
            description: `Opções da pergunta alteradas`
          });
        }
      }
    });

    return changes;
  }

  // Buscar estatísticas de versionamento
  static async getVersioningStats(quizId: string) {
    try {
      const { data, error } = await supabase
        .from('quiz_versions')
        .select('id, created_at, file_size, changes_summary')
        .eq('quiz_id', quizId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const totalVersions = data.length;
      const totalSize = data.reduce((sum, v) => sum + (v.file_size || 0), 0);
      const averageSize = totalSize / (totalVersions || 1);
      
      const firstVersion = data[data.length - 1];
      const lastVersion = data[0];
      
      const daysSinceFirst = firstVersion 
        ? Math.floor((Date.now() - new Date(firstVersion.created_at).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      return {
        total_versions: totalVersions,
        total_size_bytes: totalSize,
        average_size_bytes: Math.round(averageSize),
        days_since_first_version: daysSinceFirst,
        first_version_date: firstVersion?.created_at,
        last_version_date: lastVersion?.created_at,
        versions_per_day: daysSinceFirst > 0 ? (totalVersions / daysSinceFirst).toFixed(2) : '0'
      };

    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  }
}
