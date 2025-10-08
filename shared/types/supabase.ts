// =============================================================================
// TIPOS TYPESCRIPT PARA INTEGRAÇÃO COM SUPABASE
// Sistema de Quiz Quest Challenge Verse
// =============================================================================

export interface Database {
  public: {
    Tables: {
      // =============================================================
      // Tabelas adicionadas para o QUIZ PRODUCTION EDITOR
      // Mantidas enxutas: somente campos realmente usados no bridge
      // =============================================================
      quiz_drafts: {
        Row: {
          id: string;
          name: string;
          slug: string;
          steps: any; // JSONB contendo array de steps editáveis
          version: number | null;
          is_published: boolean | null;
          user_id: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          name: string;
          slug: string;
          steps: any;
          version?: number | null;
          is_published?: boolean | null;
          user_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['quiz_drafts']['Insert']>;
      };
      quiz_production: {
        Row: {
          slug: string;
          steps: any; // JSONB formato QUIZ_STEPS
          version: number;
          published_at: string | null;
          source_draft_id: string | null;
          metadata: any | null;
        };
        Insert: {
          slug: string;
          steps: any;
          version: number;
          published_at?: string | null;
          source_draft_id?: string | null;
          metadata?: any | null;
        };
        Update: Partial<Database['public']['Tables']['quiz_production']['Insert']>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      quizzes: {
        Row: Quiz;
        Insert: Omit<Quiz, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'completion_count'>;
        Update: Partial<Omit<Quiz, 'id' | 'created_at' | 'updated_at'>>;
      };
      questions: {
        Row: Question;
        Insert: Omit<Question, 'id' | 'created_at'>;
        Update: Partial<Omit<Question, 'id' | 'created_at'>>;
      };
      quiz_attempts: {
        Row: QuizAttempt;
        Insert: Omit<QuizAttempt, 'id' | 'started_at'>;
        Update: Partial<Omit<QuizAttempt, 'id' | 'started_at'>>;
      };
      question_responses: {
        Row: QuestionResponse;
        Insert: Omit<QuestionResponse, 'id' | 'answered_at'>;
        Update: Partial<Omit<QuestionResponse, 'id' | 'answered_at'>>;
      };
      quiz_templates: {
        Row: QuizTemplate;
        Insert: Omit<QuizTemplate, 'id' | 'created_at' | 'updated_at' | 'usage_count'>;
        Update: Partial<Omit<QuizTemplate, 'id' | 'created_at' | 'updated_at'>>;
      };
      quiz_categories: {
        Row: QuizCategory;
        Insert: Omit<QuizCategory, 'id' | 'created_at'>;
        Update: Partial<Omit<QuizCategory, 'id' | 'created_at'>>;
      };
      quiz_tags: {
        Row: QuizTag;
        Insert: Omit<QuizTag, 'id' | 'created_at'>;
        Update: Partial<Omit<QuizTag, 'id' | 'created_at'>>;
      };
      quiz_analytics: {
        Row: QuizAnalytics;
        Insert: Omit<QuizAnalytics, 'id' | 'created_at'>;
        Update: never;
      };
      quiz_feedback: {
        Row: QuizFeedback;
        Insert: Omit<QuizFeedback, 'id' | 'created_at'>;
        Update: Partial<Omit<QuizFeedback, 'id' | 'created_at'>>;
      };
    };
    Views: {
      quiz_stats: {
        Row: QuizStats;
      };
      quiz_leaderboard: {
        Row: QuizLeaderboard;
      };
    };
    Functions: {
      generate_quiz_slug: {
        Args: { quiz_title: string; quiz_id: string };
        Returns: string;
      };
    };
  };
}

// =============================================================================
// INTERFACES PRINCIPAIS
// =============================================================================

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin' | 'moderator';
  plan: 'free' | 'pro' | 'enterprise';
  created_at: string;
  updated_at: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string | null;
  author_id: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  time_limit: number | null;
  is_public: boolean;
  is_published: boolean;
  is_template: boolean;
  thumbnail_url: string | null;
  tags: string[];
  settings: QuizSettings;
  view_count: number;
  completion_count: number;
  version: number;
  slug: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuizSettings {
  allowRetake: boolean;
  showResults: boolean;
  shuffleQuestions: boolean;
  showProgressBar: boolean;
  passingScore: number;
  [key: string]: any;
}

export interface Question {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: QuestionType;
  options: QuestionOption[];
  correct_answers: any;
  points: number;
  time_limit: number | null;
  required: boolean;
  explanation: string | null;
  hint: string | null;
  media_url: string | null;
  media_type: 'image' | 'video' | 'audio' | null;
  order_index: number;
  tags: string[];
  created_at: string;
}

export type QuestionType =
  | 'multiple_choice'
  | 'multiple_answer'
  | 'true_false'
  | 'text'
  | 'ordering'
  | 'matching'
  | 'scale'
  | 'dropdown';

export interface EditorSettings {
  autosave: boolean;
  autosaveInterval: number;
  previewOnChange: boolean;
  darkMode: boolean;
  layout: 'two-panel' | 'three-panel';
}

export interface QuestionOption {
  id: string;
  text: string;
  image_url?: string;
  value?: any;
  isCorrect?: boolean;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  user_id: string;
  answers: Record<string, any>;
  score: number | null;
  max_score: number | null;
  percentage_score: number | null;
  time_taken: number | null;
  status: 'in_progress' | 'completed' | 'abandoned';
  passed: boolean | null;
  started_at: string;
  completed_at: string | null;
  user_agent: string | null;
  ip_address: string | null;
}

export interface QuestionResponse {
  id: string;
  attempt_id: string;
  question_id: string;
  answer_data: any;
  is_correct: boolean | null;
  points_earned: number;
  time_taken: number | null;
  answered_at: string;
}

export interface QuizTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string;
  template_data: any;
  thumbnail_url: string | null;
  is_official: boolean;
  creator_id: string | null;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface QuizCategory {
  id: string;
  name: string;
  description: string | null;
  color: string;
  icon: string | null;
  parent_id: string | null;
  created_at: string;
}

export interface QuizTag {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface QuizAnalytics {
  id: string;
  quiz_id: string;
  event_type: 'view' | 'start' | 'complete' | 'abandon' | 'question_answered';
  user_id: string | null;
  session_id: string | null;
  question_id: string | null;
  user_agent: string | null;
  ip_address: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  event_data: Record<string, any>;
  created_at: string;
}

export interface QuizFeedback {
  id: string;
  quiz_id: string;
  user_id: string | null;
  rating: number | null;
  comment: string | null;
  is_public: boolean;
  is_approved: boolean;
  moderated_by: string | null;
  moderated_at: string | null;
  created_at: string;
}

// =============================================================================
// VIEWS
// =============================================================================

export interface QuizStats {
  id: string;
  title: string;
  author_id: string;
  total_attempts: number;
  completed_attempts: number;
  avg_score: number | null;
  feedback_count: number;
  avg_rating: number | null;
}

export interface QuizLeaderboard {
  quiz_id: string;
  full_name: string | null;
  avatar_url: string | null;
  score: number | null;
  time_taken: number | null;
  completed_at: string | null;
  rank: number;
}

// =============================================================================
// TIPOS PARA O EDITOR
// =============================================================================

export interface EditorQuiz extends Omit<Quiz, 'author_id' | 'created_at' | 'updated_at'> {
  questions: EditorQuestion[];
  author?: Profile;
}

export interface EditorQuestion extends Omit<Question, 'quiz_id' | 'created_at'> {
  tempId?: string; // Para perguntas ainda não salvas
}

export interface CreateQuizData {
  title: string;
  description?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  time_limit?: number;
  is_public?: boolean;
  tags?: string[];
  settings?: Partial<QuizSettings>;
  questions: CreateQuestionData[];
}

export interface CreateQuestionData {
  question_text: string;
  question_type: QuestionType;
  options: QuestionOption[];
  correct_answers: any;
  points?: number;
  time_limit?: number;
  required?: boolean;
  explanation?: string;
  hint?: string;
  media_url?: string;
  media_type?: 'image' | 'video' | 'audio';
  order_index: number;
  tags?: string[];
}

export interface UpdateQuizData extends Partial<CreateQuizData> {
  id: string;
}

export interface UpdateQuestionData extends Partial<CreateQuestionData> {
  id: string;
}

// =============================================================================
// TIPOS PARA ANALYTICS
// =============================================================================

export interface AnalyticsEvent {
  event_type: QuizAnalytics['event_type'];
  quiz_id: string;
  question_id?: string;
  user_id?: string;
  session_id?: string;
  event_data?: Record<string, any>;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export interface QuizPerformanceMetrics {
  quiz_id: string;
  total_views: number;
  total_starts: number;
  total_completions: number;
  completion_rate: number;
  average_score: number;
  average_time: number;
  questions_analytics: QuestionAnalytics[];
}

export interface QuestionAnalytics {
  question_id: string;
  question_text: string;
  total_responses: number;
  correct_responses: number;
  accuracy_rate: number;
  average_time: number;
  skip_rate: number;
}

// =============================================================================
// TIPOS PARA AUTENTICAÇÃO
// =============================================================================

export interface AuthUser {
  id: string;
  email: string;
  profile?: Profile;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// =============================================================================
// TIPOS PARA O SISTEMA DE TEMPLATES
// =============================================================================

export interface TemplateData {
  quiz: Omit<CreateQuizData, 'questions'>;
  questions: CreateQuestionData[];
  metadata: {
    version: string;
    created_by: string;
    description: string;
    tags: string[];
  };
}

// =============================================================================
// TIPOS PARA FILTROS E BUSCA
// =============================================================================

export interface QuizFilters {
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  is_public?: boolean;
  author_id?: string;
  search?: string;
  sort_by?: 'created_at' | 'updated_at' | 'title' | 'view_count' | 'completion_count';
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface QuizSearchResult {
  quizzes: Quiz[];
  total: number;
  has_more: boolean;
}

// =============================================================================
// TIPOS PARA UPLOADS
// =============================================================================

export interface MediaUpload {
  file: File;
  type: 'image' | 'video' | 'audio';
  max_size?: number;
  allowed_formats?: string[];
}

export interface UploadResult {
  url: string;
  path: string;
  size: number;
  type: string;
}

// =============================================================================
// TIPOS PARA RESPOSTAS DA API
// =============================================================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
}

// =============================================================================
// CONFIGURAÇÕES DO EDITOR
// =============================================================================

export interface EditorConfig {
  autosave: boolean;
  autosave_interval: number; // em ms
  show_preview: boolean;
  default_question_points: number;
  max_questions_per_quiz: number;
  max_options_per_question: number;
  allowed_media_types: string[];
  max_media_size: number; // em bytes
  enable_analytics: boolean;
  enable_ai_suggestions: boolean;
}

export const DEFAULT_EDITOR_CONFIG: EditorConfig = {
  autosave: true,
  autosave_interval: 30000, // 30 segundos
  show_preview: true,
  default_question_points: 1,
  max_questions_per_quiz: 100,
  max_options_per_question: 10,
  allowed_media_types: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'],
  max_media_size: 10 * 1024 * 1024, // 10MB
  enable_analytics: true,
  enable_ai_suggestions: false,
};

// =============================================================================
// TIPOS PARA VALIDAÇÃO
// =============================================================================

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// =============================================================================
// EXPORTS
// =============================================================================

// All types are exported by default as interfaces
// Database type is already exported at the top
