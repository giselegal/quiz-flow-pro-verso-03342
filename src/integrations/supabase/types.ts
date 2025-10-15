export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      calculation_audit: {
        Row: {
          calculated_at: string
          calculation_type: string
          id: string
          input_data: Json | null
          output_data: Json | null
          session_id: string | null
        }
        Insert: {
          calculated_at?: string
          calculation_type: string
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          session_id?: string | null
        }
        Update: {
          calculated_at?: string
          calculation_type?: string
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calculation_audit_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "quiz_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      component_instances: {
        Row: {
          component_type_id: string | null
          config: Json | null
          created_at: string
          created_by: string | null
          funnel_id: string | null
          id: string
          is_active: boolean | null
          position: number | null
          updated_at: string
        }
        Insert: {
          component_type_id?: string | null
          config?: Json | null
          created_at?: string
          created_by?: string | null
          funnel_id?: string | null
          id?: string
          is_active?: boolean | null
          position?: number | null
          updated_at?: string
        }
        Update: {
          component_type_id?: string | null
          config?: Json | null
          created_at?: string
          created_by?: string | null
          funnel_id?: string | null
          id?: string
          is_active?: boolean | null
          position?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "component_instances_component_type_id_fkey"
            columns: ["component_type_id"]
            isOneToOne: false
            referencedRelation: "component_types"
            referencedColumns: ["id"]
          },
        ]
      }
      component_presets: {
        Row: {
          component_type_id: string | null
          created_at: string
          created_by: string | null
          id: string
          is_default: boolean | null
          preset_config: Json | null
          preset_name: string
        }
        Insert: {
          component_type_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_default?: boolean | null
          preset_config?: Json | null
          preset_name: string
        }
        Update: {
          component_type_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_default?: boolean | null
          preset_config?: Json | null
          preset_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "component_presets_component_type_id_fkey"
            columns: ["component_type_id"]
            isOneToOne: false
            referencedRelation: "component_types"
            referencedColumns: ["id"]
          },
        ]
      }
      component_types: {
        Row: {
          category: string
          config_schema: Json | null
          created_at: string
          created_by: string | null
          display_name: string
          id: string
          type_key: string
          updated_at: string
        }
        Insert: {
          category: string
          config_schema?: Json | null
          created_at?: string
          created_by?: string | null
          display_name: string
          id?: string
          type_key: string
          updated_at?: string
        }
        Update: {
          category?: string
          config_schema?: Json | null
          created_at?: string
          created_by?: string | null
          display_name?: string
          id?: string
          type_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      outcomes: {
        Row: {
          created_at: string
          description: string | null
          id: string
          max_score: number | null
          min_score: number | null
          outcome_key: string
          quiz_definition_id: string | null
          result_content: Json | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          max_score?: number | null
          min_score?: number | null
          outcome_key: string
          quiz_definition_id?: string | null
          result_content?: Json | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          max_score?: number | null
          min_score?: number | null
          outcome_key?: string
          quiz_definition_id?: string | null
          result_content?: Json | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "outcomes_quiz_definition_id_fkey"
            columns: ["quiz_definition_id"]
            isOneToOne: false
            referencedRelation: "quiz_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_analytics: {
        Row: {
          funnel_id: string | null
          id: string
          metric_data: Json | null
          metric_name: string
          metric_value: number | null
          recorded_at: string
          session_id: string
          user_id: string | null
        }
        Insert: {
          funnel_id?: string | null
          id?: string
          metric_data?: Json | null
          metric_name: string
          metric_value?: number | null
          recorded_at?: string
          session_id: string
          user_id?: string | null
        }
        Update: {
          funnel_id?: string | null
          id?: string
          metric_data?: Json | null
          metric_name?: string
          metric_value?: number | null
          recorded_at?: string
          session_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_analytics_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "quiz_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_definitions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          quiz_type: string
          settings: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          quiz_type?: string
          settings?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          quiz_type?: string
          settings?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      quiz_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          metadata: Json | null
          option_selected: string | null
          quiz_data: Json | null
          step_number: number | null
          time_spent: number | null
          timestamp: string
          user_data: Json | null
          user_session_id: string
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          option_selected?: string | null
          quiz_data?: Json | null
          step_number?: number | null
          time_spent?: number | null
          timestamp?: string
          user_data?: Json | null
          user_session_id: string
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          option_selected?: string | null
          quiz_data?: Json | null
          step_number?: number | null
          time_spent?: number | null
          timestamp?: string
          user_data?: Json | null
          user_session_id?: string
        }
        Relationships: []
      }
      quiz_results: {
        Row: {
          created_at: string
          id: string
          next_steps: Json | null
          recommendation: string | null
          result_data: Json | null
          result_description: string | null
          result_title: string | null
          result_type: string
          session_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          next_steps?: Json | null
          recommendation?: string | null
          result_data?: Json | null
          result_description?: string | null
          result_title?: string | null
          result_type: string
          session_id: string
        }
        Update: {
          created_at?: string
          id?: string
          next_steps?: Json | null
          recommendation?: string | null
          result_data?: Json | null
          result_description?: string | null
          result_title?: string | null
          result_type?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_results_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "quiz_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_sessions: {
        Row: {
          completed_at: string | null
          completion_percentage: number | null
          current_step: number | null
          device_info: Json | null
          final_result: Json | null
          funnel_id: string | null
          id: string
          last_activity: string
          max_score: number | null
          metadata: Json | null
          quiz_user_id: string | null
          score: number | null
          session_token: string | null
          started_at: string
          status: string
          time_spent_total: number | null
          total_steps: number | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          completed_at?: string | null
          completion_percentage?: number | null
          current_step?: number | null
          device_info?: Json | null
          final_result?: Json | null
          funnel_id?: string | null
          id?: string
          last_activity?: string
          max_score?: number | null
          metadata?: Json | null
          quiz_user_id?: string | null
          score?: number | null
          session_token?: string | null
          started_at?: string
          status?: string
          time_spent_total?: number | null
          total_steps?: number | null
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          completed_at?: string | null
          completion_percentage?: number | null
          current_step?: number | null
          device_info?: Json | null
          final_result?: Json | null
          funnel_id?: string | null
          id?: string
          last_activity?: string
          max_score?: number | null
          metadata?: Json | null
          quiz_user_id?: string | null
          score?: number | null
          session_token?: string | null
          started_at?: string
          status?: string
          time_spent_total?: number | null
          total_steps?: number | null
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_sessions_quiz_user_id_fkey"
            columns: ["quiz_user_id"]
            isOneToOne: false
            referencedRelation: "quiz_users"
            referencedColumns: ["id"]
          },
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
          answer_text: string | null
          answer_value: string | null
          id: string
          metadata: Json | null
          question_id: string
          question_text: string | null
          responded_at: string
          response_time_ms: number | null
          score_earned: number | null
          session_id: string
          step_number: number
        }
        Insert: {
          answer_text?: string | null
          answer_value?: string | null
          id?: string
          metadata?: Json | null
          question_id: string
          question_text?: string | null
          responded_at?: string
          response_time_ms?: number | null
          score_earned?: number | null
          session_id: string
          step_number: number
        }
        Update: {
          answer_text?: string | null
          answer_value?: string | null
          id?: string
          metadata?: Json | null
          question_id?: string
          question_text?: string | null
          responded_at?: string
          response_time_ms?: number | null
          score_earned?: number | null
          session_id?: string
          step_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_step_responses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "quiz_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_users: {
        Row: {
          created_at: string
          email: string | null
          id: string
          ip_address: unknown | null
          name: string | null
          session_id: string
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          ip_address?: unknown | null
          name?: string | null
          session_id: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          ip_address?: unknown | null
          name?: string | null
          session_id?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      user_results: {
        Row: {
          created_at: string
          id: string
          quiz_definition_id: string | null
          result_data: Json | null
          score: number | null
          session_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          quiz_definition_id?: string | null
          result_data?: Json | null
          score?: number | null
          session_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          quiz_definition_id?: string | null
          result_data?: Json | null
          score?: number | null
          session_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_results_quiz_definition_id_fkey"
            columns: ["quiz_definition_id"]
            isOneToOne: false
            referencedRelation: "quiz_definitions"
            referencedColumns: ["id"]
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
