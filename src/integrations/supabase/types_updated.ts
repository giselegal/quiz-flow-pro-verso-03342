export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      active_sessions: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          last_activity: string | null
          location_data: Json | null
          session_token: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          location_data?: Json | null
          session_token: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          location_data?: Json | null
          session_token?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      admin_goals: {
        Row: {
          achieved: boolean | null
          created_at: string | null
          current_value: number | null
          goal_type: string
          id: string
          period_end: string | null
          period_start: string | null
          target_value: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          achieved?: boolean | null
          created_at?: string | null
          current_value?: number | null
          goal_type: string
          id?: string
          period_end?: string | null
          period_start?: string | null
          target_value: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          achieved?: boolean | null
          created_at?: string | null
          current_value?: number | null
          goal_type?: string
          id?: string
          period_end?: string | null
          period_start?: string | null
          target_value?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_optimization_recommendations: {
        Row: {
          actual_improvement: number | null
          applied: boolean | null
          applied_at: string | null
          auto_applicable: boolean | null
          behavior_patterns: Json | null
          code_example: string | null
          created_at: string | null
          description: string
          effort: string | null
          expected_improvement: number | null
          funnel_id: string | null
          id: string
          implementation: string | null
          metrics: Json | null
          priority: string
          session_id: string | null
          success: boolean | null
          title: string
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          actual_improvement?: number | null
          applied?: boolean | null
          applied_at?: string | null
          auto_applicable?: boolean | null
          behavior_patterns?: Json | null
          code_example?: string | null
          created_at?: string | null
          description: string
          effort?: string | null
          expected_improvement?: number | null
          funnel_id?: string | null
          id?: string
          implementation?: string | null
          metrics?: Json | null
          priority: string
          session_id?: string | null
          success?: boolean | null
          title: string
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          actual_improvement?: number | null
          applied?: boolean | null
          applied_at?: string | null
          auto_applicable?: boolean | null
          behavior_patterns?: Json | null
          code_example?: string | null
          created_at?: string | null
          description?: string
          effort?: string | null
          expected_improvement?: number | null
          funnel_id?: string | null
          id?: string
          implementation?: string | null
          metrics?: Json | null
          priority?: string
          session_id?: string | null
          success?: boolean | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_optimization_recommendations_funnel_id_fkey"
            columns: ["funnel_id"]
            isOneToOne: false
            referencedRelation: "funnels"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_jobs: {
        Row: {
          backup_data: Json | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          error_message: string | null
          id: string
          size_bytes: number | null
          started_at: string | null
          status: string | null
          tables: string[]
          type: string
          user_id: string | null
        }
        Insert: {
          backup_data?: Json | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          error_message?: string | null
          id?: string
          size_bytes?: number | null
          started_at?: string | null
          status?: string | null
          tables: string[]
          type: string
          user_id?: string | null
        }
        Update: {
          backup_data?: Json | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          error_message?: string | null
          id?: string
          size_bytes?: number | null
          started_at?: string | null
          status?: string | null
          tables?: string[]
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      facebook_api_config: {
        Row: {
          access_token: string
          account_id: string
          app_id: string
          app_secret: string
          breakdowns: string[] | null
          created_at: string | null
          id: string
          is_active: boolean | null
          last_sync: string | null
          metrics_to_sync: string[] | null
          page_id: string | null
          pixel_id: string | null
          sync_frequency: unknown | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          access_token: string
          account_id: string
          app_id: string
          app_secret: string
          breakdowns?: string[] | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          metrics_to_sync?: string[] | null
          page_id?: string | null
          pixel_id?: string | null
          sync_frequency?: unknown | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_token?: string
          account_id?: string
          app_id?: string
          app_secret?: string
          breakdowns?: string[] | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          metrics_to_sync?: string[] | null
          page_id?: string | null
          pixel_id?: string | null
          sync_frequency?: unknown | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      facebook_metrics: {
        Row: {
          account_id: string | null
          ad_id: string | null
          ad_name: string | null
          adset_id: string | null
          adset_name: string | null
          campaign_id: string
          campaign_name: string | null
          clicks: number | null
          comments: number | null
          conversion_value: number | null
          conversions: number | null
          cpc: number | null
          cpm: number | null
          cpp: number | null
          created_at: string | null
          ctr: number | null
          currency: string | null
          date_end: string
          date_start: string
          demographics: Json | null
          device_breakdown: Json | null
          id: string
          impressions: number | null
          last_sync: string | null
          leads_generated: number | null
          likes: number | null
          placement_breakdown: Json | null
          post_engagements: number | null
          quiz_completions: number | null
          quiz_starts: number | null
          reach: number | null
          shares: number | null
          spend: number | null
          timezone: string | null
          unique_clicks: number | null
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          ad_id?: string | null
          ad_name?: string | null
          adset_id?: string | null
          adset_name?: string | null
          campaign_id: string
          campaign_name?: string | null
          clicks?: number | null
          comments?: number | null
          conversion_value?: number | null
          conversions?: number | null
          cpc?: number | null
          cpm?: number | null
          cpp?: number | null
          created_at?: string | null
          ctr?: number | null
          currency?: string | null
          date_end: string
          date_start: string
          demographics?: Json | null
          device_breakdown?: Json | null
          id?: string
          impressions?: number | null
          last_sync?: string | null
          leads_generated?: number | null
          likes?: number | null
          placement_breakdown?: Json | null
          post_engagements?: number | null
          quiz_completions?: number | null
          quiz_starts?: number | null
          reach?: number | null
          shares?: number | null
          spend?: number | null
          timezone?: string | null
          unique_clicks?: number | null
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          ad_id?: string | null
          ad_name?: string | null
          adset_id?: string | null
          adset_name?: string | null
          campaign_id?: string
          campaign_name?: string | null
          clicks?: number | null
          comments?: number | null
          conversion_value?: number | null
          conversions?: number | null
          cpc?: number | null
          cpm?: number | null
          cpp?: number | null
          created_at?: string | null
          ctr?: number | null
          currency?: string | null
          date_end?: string
          date_start?: string
          demographics?: Json | null
          device_breakdown?: Json | null
          id?: string
          impressions?: number | null
          last_sync?: string | null
          leads_generated?: number | null
          likes?: number | null
          placement_breakdown?: Json | null
          post_engagements?: number | null
          quiz_completions?: number | null
          quiz_starts?: number | null
          reach?: number | null
          shares?: number | null
          spend?: number | null
          timezone?: string | null
          unique_clicks?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      facebook_sync_logs: {
        Row: {
          completed_at: string | null
          config_id: string | null
          created_at: string | null
          date_range_end: string | null
          date_range_start: string | null
          duration_seconds: number | null
          error_details: Json | null
          error_message: string | null
          id: string
          records_failed: number | null
          records_synced: number | null
          records_updated: number | null
          started_at: string | null
          status: string
          sync_type: string
          triggered_by: string | null
        }
        Insert: {
          completed_at?: string | null
          config_id?: string | null
          created_at?: string | null
          date_range_end?: string | null
          date_range_start?: string | null
          duration_seconds?: number | null
          error_details?: Json | null
          error_message?: string | null
          id?: string
          records_failed?: number | null
          records_synced?: number | null
          records_updated?: number | null
          started_at?: string | null
          status: string
          sync_type: string
          triggered_by?: string | null
        }
        Update: {
          completed_at?: string | null
          config_id?: string | null
          created_at?: string | null
          date_range_end?: string | null
          date_range_start?: string | null
          duration_seconds?: number | null
          error_details?: Json | null
          error_message?: string | null
          id?: string
          records_failed?: number | null
          records_synced?: number | null
          records_updated?: number | null
          started_at?: string | null
          status?: string
          sync_type?: string
          triggered_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "facebook_sync_logs_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "facebook_api_config"
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
      optimization_results: {
        Row: {
          after_metrics: Json | null
          applied_at: string | null
          applied_by: string | null
          before_metrics: Json | null
          created_at: string | null
          error_message: string | null
          funnel_id: string | null
          id: string
          improvement_percentage: number | null
          recommendation_id: string | null
          rollback_available: boolean | null
          rolled_back: boolean | null
          success: boolean | null
          user_id: string | null
        }
        Insert: {
          after_metrics?: Json | null
          applied_at?: string | null
          applied_by?: string | null
          before_metrics?: Json | null
          created_at?: string | null
          error_message?: string | null
          funnel_id?: string | null
          id?: string
          improvement_percentage?: number | null
          recommendation_id?: string | null
          rollback_available?: boolean | null
          rolled_back?: boolean | null
          success?: boolean | null
          user_id?: string | null
        }
        Update: {
          after_metrics?: Json | null
          applied_at?: string | null
          applied_by?: string | null
          before_metrics?: Json | null
          created_at?: string | null
          error_message?: string | null
          funnel_id?: string | null
          id?: string
          improvement_percentage?: number | null
          recommendation_id?: string | null
          rollback_available?: boolean | null
          rolled_back?: boolean | null
          success?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "optimization_results_funnel_id_fkey"
            columns: ["funnel_id"]
            isOneToOne: false
            referencedRelation: "funnels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "optimization_results_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "ai_optimization_recommendations"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_conversions: {
        Row: {
          affiliate_id: string | null
          commission_rate: number | null
          conversion_data: Json | null
          conversion_type: string
          conversion_value: number | null
          converted_at: string | null
          currency: string | null
          id: string
          product_id: string | null
          product_name: string | null
          session_id: string
        }
        Insert: {
          affiliate_id?: string | null
          commission_rate?: number | null
          conversion_data?: Json | null
          conversion_type: string
          conversion_value?: number | null
          converted_at?: string | null
          currency?: string | null
          id?: string
          product_id?: string | null
          product_name?: string | null
          session_id: string
        }
        Update: {
          affiliate_id?: string | null
          commission_rate?: number | null
          conversion_data?: Json | null
          conversion_type?: string
          conversion_value?: number | null
          converted_at?: string | null
          currency?: string | null
          id?: string
          product_id?: string | null
          product_name?: string | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_conversions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "quiz_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_results: {
        Row: {
          created_at: string | null
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
          created_at?: string | null
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
          created_at?: string | null
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
          current_step: number | null
          funnel_id: string
          id: string
          last_activity: string | null
          max_score: number | null
          metadata: Json | null
          quiz_user_id: string
          score: number | null
          started_at: string | null
          status: string | null
          total_steps: number | null
        }
        Insert: {
          completed_at?: string | null
          current_step?: number | null
          funnel_id: string
          id?: string
          last_activity?: string | null
          max_score?: number | null
          metadata?: Json | null
          quiz_user_id: string
          score?: number | null
          started_at?: string | null
          status?: string | null
          total_steps?: number | null
        }
        Update: {
          completed_at?: string | null
          current_step?: number | null
          funnel_id?: string
          id?: string
          last_activity?: string | null
          max_score?: number | null
          metadata?: Json | null
          quiz_user_id?: string
          score?: number | null
          started_at?: string | null
          status?: string | null
          total_steps?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_sessions_funnel_id_fkey"
            columns: ["funnel_id"]
            isOneToOne: false
            referencedRelation: "funnels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_sessions_quiz_user_id_fkey"
            columns: ["quiz_user_id"]
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
          responded_at: string | null
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
          responded_at?: string | null
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
          responded_at?: string | null
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
          created_at: string | null
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
          created_at?: string | null
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
          created_at?: string | null
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
      rate_limits: {
        Row: {
          created_at: string | null
          current: number | null
          endpoint: string
          id: string
          identifier: string
          last_request: number
          limit_value: number
          reset_time: number
          updated_at: string | null
          user_id: string | null
          window_seconds: number
        }
        Insert: {
          created_at?: string | null
          current?: number | null
          endpoint: string
          id?: string
          identifier: string
          last_request: number
          limit_value: number
          reset_time: number
          updated_at?: string | null
          user_id?: string | null
          window_seconds: number
        }
        Update: {
          created_at?: string | null
          current?: number | null
          endpoint?: string
          id?: string
          identifier?: string
          last_request?: number
          limit_value?: number
          reset_time?: number
          updated_at?: string | null
          user_id?: string | null
          window_seconds?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_facebook_campaign_summary: {
        Args: {
          campaign_id_param: string
          date_end_param: string
          date_start_param: string
        }
        Returns: {
          avg_cpc: number
          avg_ctr: number
          total_clicks: number
          total_conversion_value: number
          total_conversions: number
          total_impressions: number
          total_spend: number
        }[]
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

