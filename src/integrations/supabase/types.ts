export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      funnel_pages: {
        Row: {
          blocks: Json
          created_at: string | null
          funnel_id: string
          id: string
          metadata: Json | null
          page_order: number
          page_type: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          blocks?: Json
          created_at?: string | null
          funnel_id: string
          id: string
          metadata?: Json | null
          page_order: number
          page_type: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          blocks?: Json
          created_at?: string | null
          funnel_id?: string
          id?: string
          metadata?: Json | null
          page_order?: number
          page_type?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funnel_pages_funnel_id_fkey"
            columns: ["funnel_id"]
            isOneToOne: false
            referencedRelation: "funnels"
            referencedColumns: ["id"]
          },
        ]
      }
      funnels: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_published: boolean | null
          name: string
          settings: Json | null
          updated_at: string | null
          user_id: string | null
          version: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id: string
          is_published?: boolean | null
          name: string
          settings?: Json | null
          updated_at?: string | null
          user_id?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          name?: string
          settings?: Json | null
          updated_at?: string | null
          user_id?: string | null
          version?: number | null
        }
        Relationships: []
      }
      quiz_users: {
        Row: {
          id: string
          name: string | null
          email: string | null
          phone: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          referrer: string | null
          user_agent: string | null
          ip_address: string | null
          session_id: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name?: string | null
          email?: string | null
          phone?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          referrer?: string | null
          user_agent?: string | null
          ip_address?: string | null
          session_id: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          phone?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          referrer?: string | null
          user_agent?: string | null
          ip_address?: string | null
          session_id?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quiz_sessions: {
        Row: {
          id: string
          session_id: string
          user_id: string | null
          status: string
          current_step: number
          quiz_type: string
          version: string
          started_at: string | null
          completed_at: string | null
          last_activity_at: string | null
          metadata: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          session_id: string
          user_id?: string | null
          status?: string
          current_step?: number
          quiz_type?: string
          version?: string
          started_at?: string | null
          completed_at?: string | null
          last_activity_at?: string | null
          metadata?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          session_id?: string
          user_id?: string | null
          status?: string
          current_step?: number
          quiz_type?: string
          version?: string
          started_at?: string | null
          completed_at?: string | null
          last_activity_at?: string | null
          metadata?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "quiz_users"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_step_responses: {
        Row: {
          id: string
          session_id: string
          step_number: number
          step_id: string
          question_id: string | null
          selected_options: string[]
          response_data: Json
          style_category: string | null
          strategic_category: string | null
          time_taken_seconds: number | null
          answered_at: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          session_id: string
          step_number: number
          step_id: string
          question_id?: string | null
          selected_options?: string[]
          response_data?: Json
          style_category?: string | null
          strategic_category?: string | null
          time_taken_seconds?: number | null
          answered_at?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          session_id?: string
          step_number?: number
          step_id?: string
          question_id?: string | null
          selected_options?: string[]
          response_data?: Json
          style_category?: string | null
          strategic_category?: string | null
          time_taken_seconds?: number | null
          answered_at?: string | null
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_step_responses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "quiz_sessions"
            referencedColumns: ["session_id"]
          },
        ]
      }
      quiz_results: {
        Row: {
          id: string
          session_id: string
          predominant_style: string
          predominant_percentage: number
          complementary_styles: Json
          style_scores: Json
          calculation_details: Json | null
          strategic_data: Json | null
          lead_score: number | null
          recommended_products: Json | null
          personalized_message: string | null
          calculated_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          session_id: string
          predominant_style: string
          predominant_percentage: number
          complementary_styles?: Json
          style_scores?: Json
          calculation_details?: Json | null
          strategic_data?: Json | null
          lead_score?: number | null
          recommended_products?: Json | null
          personalized_message?: string | null
          calculated_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          session_id?: string
          predominant_style?: string
          predominant_percentage?: number
          complementary_styles?: Json
          style_scores?: Json
          calculation_details?: Json | null
          strategic_data?: Json | null
          lead_score?: number | null
          recommended_products?: Json | null
          personalized_message?: string | null
          calculated_at?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_results_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "quiz_sessions"
            referencedColumns: ["session_id"]
          },
        ]
      }
      quiz_analytics: {
        Row: {
          id: string
          session_id: string
          event_type: string
          step_number: number | null
          step_id: string | null
          event_data: Json | null
          ga4_tracked: boolean | null
          facebook_tracked: boolean | null
          event_timestamp: string | null
        }
        Insert: {
          id?: string
          session_id: string
          event_type: string
          step_number?: number | null
          step_id?: string | null
          event_data?: Json | null
          ga4_tracked?: boolean | null
          facebook_tracked?: boolean | null
          event_timestamp?: string | null
        }
        Update: {
          id?: string
          session_id?: string
          event_type?: string
          step_number?: number | null
          step_id?: string | null
          event_data?: Json | null
          ga4_tracked?: boolean | null
          facebook_tracked?: boolean | null
          event_timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_analytics_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "quiz_sessions"
            referencedColumns: ["session_id"]
          },
        ]
      }
      quiz_conversions: {
        Row: {
          id: string
          session_id: string
          conversion_type: string
          conversion_value: number | null
          currency: string | null
          product_id: string | null
          product_name: string | null
          product_category: string | null
          conversion_data: Json | null
          converted_at: string | null
        }
        Insert: {
          id?: string
          session_id: string
          conversion_type: string
          conversion_value?: number | null
          currency?: string | null
          product_id?: string | null
          product_name?: string | null
          product_category?: string | null
          conversion_data?: Json | null
          converted_at?: string | null
        }
        Update: {
          id?: string
          session_id?: string
          conversion_type?: string
          conversion_value?: number | null
          currency?: string | null
          product_id?: string | null
          product_name?: string | null
          product_category?: string | null
          conversion_data?: Json | null
          converted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_conversions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "quiz_sessions"
            referencedColumns: ["session_id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
