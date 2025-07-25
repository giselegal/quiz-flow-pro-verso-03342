// =============================================================================
// SISTEMA DE TEMPLATES PARA QUIZ
// Templates pré-definidos para criação rápida de quizzes
// =============================================================================

import { supabase } from '@/hooks/useSupabaseEditor';

// =============================================================================
// TIPOS
// =============================================================================

export interface QuizTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // em minutos
  thumbnail: string;
  template_data: {
    title: string;
    description: string;
    questions: TemplateQuestion[];
    settings: any;
  };
  tags: string[];
  usage_count: number;
  is_public: boolean;
  created_by?: string;
  created_at: string;
}

export interface TemplateQuestion {
  question_text: string;
  question_type: 'multiple_choice' | 'multiple_answer' | 'true_false' | 'text';
  options: { text: string; value: string }[];
  correct_answers: string[];
  points: number;
  explanation?: string;
}

// =============================================================================
// TEMPLATES PRÉ-DEFINIDOS
// =============================================================================

export const DEFAULT_TEMPLATES: Omit<QuizTemplate, 'id' | 'created_at' | 'usage_count'>[] = [
  {
    name: "Quiz de Personalidade - Estilo de Vida",
    description: "Descubra seu estilo de vida ideal com perguntas personalizadas",
    category: "personalidade",
    difficulty: "easy",
    estimatedTime: 5,
    thumbnail: "/templates/lifestyle-quiz.jpg",
    template_data: {
      title: "Descubra Seu Estilo de Vida",
      description: "Um quiz personalizado para descobrir qual estilo de vida combina mais com você",
      questions: [
        {
          question_text: "Qual ambiente você prefere para relaxar?",
          question_type: "multiple_choice",
          options: [
            { text: "Casa aconchegante", value: "home" },
            { text: "Natureza ao ar livre", value: "nature" },
            { text: "Café urbano", value: "urban" },
            { text: "Biblioteca silenciosa", value: "library" }
          ],
          correct_answers: [],
          points: 1
        },
        {
          question_text: "Como você gosta de passar o fim de semana?",
          question_type: "multiple_choice",
          options: [
            { text: "Aventuras ao ar livre", value: "adventure" },
            { text: "Maratona de filmes em casa", value: "movies" },
            { text: "Visitando museus e galerias", value: "culture" },
            { text: "Encontrando amigos", value: "social" }
          ],
          correct_answers: [],
          points: 1
        },
        {
          question_text: "Qual sua bebida favorita?",
          question_type: "multiple_choice",
          options: [
            { text: "Café forte", value: "coffee" },
            { text: "Chá relaxante", value: "tea" },
            { text: "Suco natural", value: "juice" },
            { text: "Água", value: "water" }
          ],
          correct_answers: [],
          points: 1
        }
      ],
      settings: {
        allowRetake: true,
        showResults: true,
        shuffleQuestions: false,
        showProgressBar: true,
        passingScore: 0
      }
    },
    tags: ["personalidade", "estilo", "vida"],
    is_public: true
  },
  {
    name: "Quiz de Conhecimentos Gerais",
    description: "Teste seus conhecimentos em diversas áreas",
    category: "educacao",
    difficulty: "medium",
    estimatedTime: 8,
    thumbnail: "/templates/general-knowledge.jpg",
    template_data: {
      title: "Quiz de Conhecimentos Gerais",
      description: "Teste seus conhecimentos em história, ciência, geografia e mais",
      questions: [
        {
          question_text: "Qual é a capital da Austrália?",
          question_type: "multiple_choice",
          options: [
            { text: "Sydney", value: "sydney" },
            { text: "Melbourne", value: "melbourne" },
            { text: "Canberra", value: "canberra" },
            { text: "Brisbane", value: "brisbane" }
          ],
          correct_answers: ["canberra"],
          points: 1,
          explanation: "Canberra é a capital da Austrália, embora Sydney seja a maior cidade."
        },
        {
          question_text: "Quantos planetas há no sistema solar?",
          question_type: "multiple_choice",
          options: [
            { text: "7", value: "7" },
            { text: "8", value: "8" },
            { text: "9", value: "9" },
            { text: "10", value: "10" }
          ],
          correct_answers: ["8"],
          points: 1,
          explanation: "São 8 planetas: Mercúrio, Vênus, Terra, Marte, Júpiter, Saturno, Urano e Netuno."
        },
        {
          question_text: "Verdadeiro ou Falso: O Monte Everest fica no Nepal.",
          question_type: "true_false",
          options: [
            { text: "Verdadeiro", value: "true" },
            { text: "Falso", value: "false" }
          ],
          correct_answers: ["true"],
          points: 1,
          explanation: "Verdadeiro. O Monte Everest fica na fronteira entre Nepal e Tibet."
        }
      ],
      settings: {
        allowRetake: true,
        showResults: true,
        shuffleQuestions: true,
        showProgressBar: true,
        passingScore: 70
      }
    },
    tags: ["educacao", "conhecimento", "geral"],
    is_public: true
  },
  {
    name: "Quiz de Avaliação de Produto",
    description: "Colete feedback dos clientes sobre seus produtos",
    category: "business",
    difficulty: "easy",
    estimatedTime: 3,
    thumbnail: "/templates/product-feedback.jpg",
    template_data: {
      title: "Avaliação do Produto",
      description: "Nos ajude a melhorar nosso produto com seu feedback",
      questions: [
        {
          question_text: "Como você avalia nosso produto de 1 a 5?",
          question_type: "multiple_choice",
          options: [
            { text: "⭐ 1 - Muito ruim", value: "1" },
            { text: "⭐⭐ 2 - Ruim", value: "2" },
            { text: "⭐⭐⭐ 3 - Regular", value: "3" },
            { text: "⭐⭐⭐⭐ 4 - Bom", value: "4" },
            { text: "⭐⭐⭐⭐⭐ 5 - Excelente", value: "5" }
          ],
          correct_answers: [],
          points: 1
        },
        {
          question_text: "Você recomendaria nosso produto para um amigo?",
          question_type: "true_false",
          options: [
            { text: "Sim", value: "true" },
            { text: "Não", value: "false" }
          ],
          correct_answers: [],
          points: 1
        },
        {
          question_text: "O que você mais gostou no produto?",
          question_type: "text",
          options: [],
          correct_answers: [],
          points: 1
        }
      ],
      settings: {
        allowRetake: false,
        showResults: false,
        shuffleQuestions: false,
        showProgressBar: true,
        passingScore: 0
      }
    },
    tags: ["business", "feedback", "produto"],
    is_public: true
  }
];

// =============================================================================
// SERVIÇO DE TEMPLATES
// =============================================================================

export class TemplateService {
  
  // Buscar templates disponíveis
  static async getTemplates(filters?: {
    category?: string;
    difficulty?: string;
    tags?: string[];
    isPublic?: boolean;
  }) {
    let query = supabase
      .from('quiz_templates')
      .select('*')
      .order('usage_count', { ascending: false });

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.difficulty) {
      query = query.eq('difficulty', filters.difficulty);
    }

    if (filters?.isPublic !== undefined) {
      query = query.eq('is_public', filters.isPublic);
    }

    if (filters?.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as QuizTemplate[];
  }

  // Buscar template por ID
  static async getTemplate(id: string) {
    const { data, error } = await supabase
      .from('quiz_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as QuizTemplate;
  }

  // Criar quiz a partir de template
  static async createQuizFromTemplate(templateId: string, customizations?: {
    title?: string;
    description?: string;
    category?: string;
  }) {
    try {
      // Buscar template
      const template = await this.getTemplate(templateId);
      
      // Incrementar contador de uso
      await supabase
        .from('quiz_templates')
        .update({ usage_count: template.usage_count + 1 })
        .eq('id', templateId);

      // Criar novo quiz baseado no template
      const quizData = {
        title: customizations?.title || template.template_data.title,
        description: customizations?.description || template.template_data.description,
        category: customizations?.category || template.category,
        difficulty: template.difficulty,
        settings: template.template_data.settings,
        is_published: false
      };

      const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .insert([quizData])
        .select()
        .single();

      if (quizError) throw quizError;

      // Criar perguntas do template
      const questions = template.template_data.questions.map((q, index) => ({
        quiz_id: quiz.id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options,
        correct_answers: q.correct_answers,
        points: q.points,
        explanation: q.explanation,
        order_index: index,
        required: true
      }));

      const { error: questionsError } = await supabase
        .from('questions')
        .insert(questions);

      if (questionsError) throw questionsError;

      return {
        quiz,
        questions,
        template
      };

    } catch (error) {
      console.error('Erro ao criar quiz do template:', error);
      throw error;
    }
  }

  // Salvar quiz como template
  static async saveAsTemplate(quizId: string, templateData: {
    name: string;
    description: string;
    category: string;
    tags: string[];
    isPublic: boolean;
    thumbnail?: string;
  }) {
    try {
      // Buscar quiz e perguntas
      const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single();

      if (quizError) throw quizError;

      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('order_index');

      if (questionsError) throw questionsError;

      // Criar template
      const template = {
        name: templateData.name,
        description: templateData.description,
        category: templateData.category,
        difficulty: quiz.difficulty,
        estimatedTime: Math.ceil(questions.length * 0.5), // 30s por pergunta
        thumbnail: templateData.thumbnail || '/templates/default.jpg',
        template_data: {
          title: quiz.title,
          description: quiz.description,
          questions: questions.map(q => ({
            question_text: q.question_text,
            question_type: q.question_type,
            options: q.options,
            correct_answers: q.correct_answers,
            points: q.points,
            explanation: q.explanation
          })),
          settings: quiz.settings
        },
        tags: templateData.tags,
        is_public: templateData.isPublic,
        usage_count: 0
      };

      const { data, error } = await supabase
        .from('quiz_templates')
        .insert([template])
        .select()
        .single();

      if (error) throw error;
      return data as QuizTemplate;

    } catch (error) {
      console.error('Erro ao salvar template:', error);
      throw error;
    }
  }

  // Inicializar templates padrão (executar uma vez)
  static async initializeDefaultTemplates() {
    try {
      // Verificar se já existem templates
      const { data: existing } = await supabase
        .from('quiz_templates')
        .select('id')
        .limit(1);

      if (existing && existing.length > 0) {
        console.log('Templates já inicializados');
        return;
      }

      // Inserir templates padrão
      const templates = DEFAULT_TEMPLATES.map(template => ({
        ...template,
        usage_count: 0
      }));

      const { error } = await supabase
        .from('quiz_templates')
        .insert(templates);

      if (error) throw error;

      console.log(`${templates.length} templates padrão criados com sucesso`);

    } catch (error) {
      console.error('Erro ao inicializar templates:', error);
      throw error;
    }
  }

  // Buscar categorias disponíveis
  static async getCategories() {
    const { data, error } = await supabase
      .from('quiz_templates')
      .select('category')
      .eq('is_public', true);

    if (error) throw error;

    const categories = [...new Set(data.map(item => item.category))];
    return categories;
  }

  // Buscar tags populares
  static async getPopularTags(limit = 20) {
    const { data, error } = await supabase
      .from('quiz_templates')
      .select('tags')
      .eq('is_public', true);

    if (error) throw error;

    const allTags = data.flatMap(item => item.tags || []);
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([tag, count]) => ({ tag, count }));
  }
}
