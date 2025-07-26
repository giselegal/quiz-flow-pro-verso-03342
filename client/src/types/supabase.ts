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
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      quizzes: {
        Row: {
          id: string
          title: string
          description: string | null
          author_id: string | null
          category: string | null
          difficulty: string | null
          time_limit: number | null
          is_public: boolean | null
          is_published: boolean | null
          settings: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          author_id?: string | null
          category?: string | null
          difficulty?: string | null
          time_limit?: number | null
          is_public?: boolean | null
          is_published?: boolean | null
          settings?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          author_id?: string | null
          category?: string | null
          difficulty?: string | null
          time_limit?: number | null
          is_public?: boolean | null
          is_published?: boolean | null
          settings?: Json | null
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
          explanation: string | null
          media_url: string | null
          order_index: number
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
          explanation?: string | null
          media_url?: string | null
          order_index: number
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
          explanation?: string | null
          media_url?: string | null
          order_index?: number
          created_at?: string
        }
      }
      quiz_attempts: {
        Row: {
          id: string
          quiz_id: string | null
          user_id: string | null
          answers: Json
          score: number | null
          time_taken: number | null
          completed_at: string
        }
        Insert: {
          id?: string
          quiz_id?: string | null
          user_id?: string | null
          answers: Json
          score?: number | null
          time_taken?: number | null
          completed_at?: string
        }
        Update: {
          id?: string
          quiz_id?: string | null
          user_id?: string | null
          answers?: Json
          score?: number | null
          time_taken?: number | null
          completed_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
  MATCHING = 'matching'
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
