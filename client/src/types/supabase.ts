export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          role: string | null
          plan: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: string | null
          plan?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: string | null
          plan?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      quizzes: {
        Row: {
          id: string
          title: string
          description: string | null
          author_id: string
          category: string
          difficulty: string | null
          time_limit: number | null
          is_public: boolean | null
          is_published: boolean | null
          is_template: boolean | null
          thumbnail_url: string | null
          tags: string[] | null
          settings: Json | null
          view_count: number | null
          completion_count: number | null
          version: number | null
          slug: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          author_id: string
          category?: string
          difficulty?: string | null
          time_limit?: number | null
          is_public?: boolean | null
          is_published?: boolean | null
          is_template?: boolean | null
          thumbnail_url?: string | null
          tags?: string[] | null
          settings?: Json | null
          view_count?: number | null
          completion_count?: number | null
          version?: number | null
          slug?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          author_id?: string
          category?: string
          difficulty?: string | null
          time_limit?: number | null
          is_public?: boolean | null
          is_published?: boolean | null
          is_template?: boolean | null
          thumbnail_url?: string | null
          tags?: string[] | null
          settings?: Json | null
          view_count?: number | null
          completion_count?: number | null
          version?: number | null
          slug?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          quiz_id: string
          question_text: string
          question_type: string
          options: Json | null
          correct_answers: Json
          points: number | null
          time_limit: number | null
          required: boolean | null
          explanation: string | null
          hint: string | null
          media_url: string | null
          media_type: string | null
          order_index: number
          tags: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          quiz_id: string
          question_text: string
          question_type: string
          options?: Json | null
          correct_answers: Json
          points?: number | null
          time_limit?: number | null
          required?: boolean | null
          explanation?: string | null
          hint?: string | null
          media_url?: string | null
          media_type?: string | null
          order_index: number
          tags?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          quiz_id?: string
          question_text?: string
          question_type?: string
          options?: Json | null
          correct_answers?: Json
          points?: number | null
          time_limit?: number | null
          required?: boolean | null
          explanation?: string | null
          hint?: string | null
          media_url?: string | null
          media_type?: string | null
          order_index?: number
          tags?: string[] | null
          created_at?: string
        }
      }
      quiz_attempts: {
        Row: {
          id: string
          quiz_id: string
          user_id: string | null
          participant_email: string | null
          participant_name: string | null
          answers: Json
          score: number | null
          total_points: number | null
          time_taken: number | null
          started_at: string
          completed_at: string | null
          status: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          quiz_id: string
          user_id?: string | null
          participant_email?: string | null
          participant_name?: string | null
          answers?: Json
          score?: number | null
          total_points?: number | null
          time_taken?: number | null
          started_at?: string
          completed_at?: string | null
          status?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          quiz_id?: string
          user_id?: string | null
          participant_email?: string | null
          participant_name?: string | null
          answers?: Json
          score?: number | null
          total_points?: number | null
          time_taken?: number | null
          started_at?: string
          completed_at?: string | null
          status?: string | null
          metadata?: Json | null
        }
      }
      quiz_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          color: string | null
          is_active: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          color?: string | null
          is_active?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          is_active?: boolean | null
          created_at?: string
        }
      }
    }
    Views: {
      quiz_stats: {
        Row: {
          id: string | null
          title: string | null
          author_id: string | null
          view_count: number | null
          completion_count: number | null
          total_attempts: number | null
          completed_attempts: number | null
          average_score: number | null
          average_time: number | null
        }
      }
    }
    Functions: {
      increment_quiz_views: {
        Args: {
          quiz_uuid: string
        }
        Returns: undefined
      }
      increment_quiz_completions: {
        Args: {
          quiz_uuid: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Tipos auxiliares para uso no código
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Quiz = Database['public']['Tables']['quizzes']['Row']
export type Question = Database['public']['Tables']['questions']['Row']
export type QuizAttempt = Database['public']['Tables']['quiz_attempts']['Row']
export type QuizCategory = Database['public']['Tables']['quiz_categories']['Row']
export type QuizStats = Database['public']['Views']['quiz_stats']['Row']

export type InsertProfile = Database['public']['Tables']['profiles']['Insert']
export type InsertQuiz = Database['public']['Tables']['quizzes']['Insert']
export type InsertQuestion = Database['public']['Tables']['questions']['Insert']
export type InsertQuizAttempt = Database['public']['Tables']['quiz_attempts']['Insert']

export type UpdateProfile = Database['public']['Tables']['profiles']['Update']
export type UpdateQuiz = Database['public']['Tables']['quizzes']['Update']
export type UpdateQuestion = Database['public']['Tables']['questions']['Update']
export type UpdateQuizAttempt = Database['public']['Tables']['quiz_attempts']['Update']

// Enums para tipos de questão
export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  MULTIPLE_ANSWER = 'multiple_answer',
  TRUE_FALSE = 'true_false',
  TEXT = 'text',
  ORDERING = 'ordering',
  MATCHING = 'matching',
  SCALE = 'scale',
  DROPDOWN = 'dropdown'
}

// Enums para dificuldade
export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

// Enums para roles
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}

// Enums para planos
export enum UserPlan {
  FREE = 'free',
  PRO = 'pro',
  ENTERPRISE = 'enterprise'
}

// Enums para status de tentativa
export enum AttemptStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned'
}

// Tipos para configurações de quiz
export interface QuizSettings {
  allowRetake: boolean;
  showResults: boolean;
  shuffleQuestions: boolean;
  showProgressBar: boolean;
  passingScore: number;
  [key: string]: any;
}

// Tipos para opções de questão
export interface QuestionOption {
  id?: string;
  text: string;
  isCorrect?: boolean;
  explanation?: string;
}

// Tipos para respostas
export interface QuestionAnswer {
  questionId: string;
  answer: any;
  timeSpent?: number;
}
