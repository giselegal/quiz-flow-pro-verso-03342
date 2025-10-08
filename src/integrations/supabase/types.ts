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
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
          created_at: string
          current_value: number | null
          goal_type: string
          id: string
          period_end: string
          period_start: string
          target_value: number
          updated_at: string
          user_id: string
        }
        Insert: {
          achieved?: boolean | null
          created_at?: string
          current_value?: number | null
          goal_type: string
          id?: string
          period_end?: string
          period_start?: string
          target_value: number
          updated_at?: string
          user_id: string
        }
        Update: {
          achieved?: boolean | null
          created_at?: string
          current_value?: number | null
          goal_type?: string
          id?: string
          period_end?: string
          period_start?: string
          target_value?: number
          updated_at?: string
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
        Relationships: []
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
          tables?: string[]
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
      component_instances: {
        Row: {
          component_type_key: string
          created_at: string | null
          created_by: string | null
          custom_styling: Json | null
          funnel_id: string
          id: string
          instance_key: string
          is_active: boolean | null
          is_locked: boolean | null
          is_template: boolean | null
          order_index: number
          properties: Json
          stage_id: string | null
          step_number: number
          updated_at: string | null
        }
        Insert: {
          component_type_key: string
          created_at?: string | null
          created_by?: string | null
          custom_styling?: Json | null
          funnel_id: string
          id?: string
          instance_key: string
          is_active?: boolean | null
          is_locked?: boolean | null
          is_template?: boolean | null
          order_index?: number
          properties?: Json
          stage_id?: string | null
          step_number: number
          updated_at?: string | null
        }
        Update: {
          component_type_key?: string
          created_at?: string | null
          created_by?: string | null
          custom_styling?: Json | null
          funnel_id?: string
          id?: string
          instance_key?: string
          is_active?: boolean | null
          is_locked?: boolean | null
          is_template?: boolean | null
          order_index?: number
          properties?: Json
          stage_id?: string | null
          step_number?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "component_instances_component_type_key_fkey"
            columns: ["component_type_key"]
            isOneToOne: false
            referencedRelation: "component_types"
            referencedColumns: ["type_key"]
          },
        ]
      }
      component_types: {
        Row: {
          category: string
          component_path: string
          created_at: string | null
          created_by: string | null
          custom_styling: Json | null
          default_properties: Json
          description: string | null
          display_name: string
          icon: string | null
          id: string
          is_active: boolean | null
          is_system: boolean | null
          last_used_at: string | null
          preview_image_url: string | null
          subcategory: string | null
          type_key: string
          updated_at: string | null
          usage_count: number | null
          validation_schema: Json
          version: number | null
        }
        Insert: {
          category: string
          component_path: string
          created_at?: string | null
          created_by?: string | null
          custom_styling?: Json | null
          default_properties?: Json
          description?: string | null
          display_name: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_system?: boolean | null
          last_used_at?: string | null
          preview_image_url?: string | null
          subcategory?: string | null
          type_key: string
          updated_at?: string | null
          usage_count?: number | null
          validation_schema?: Json
          version?: number | null
        }
        Update: {
          category?: string
          component_path?: string
          created_at?: string | null
          created_by?: string | null
          custom_styling?: Json | null
          default_properties?: Json
          description?: string | null
          display_name?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_system?: boolean | null
          last_used_at?: string | null
          preview_image_url?: string | null
          subcategory?: string | null
          type_key?: string
          updated_at?: string | null
          usage_count?: number | null
          validation_schema?: Json
          version?: number | null
        }
        Relationships: []
      }
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
            foreignKeyName: "optimization_results_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "ai_optimization_recommendations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quiz_analytics: {
        Row: {
          event_data: Json | null
          event_type: string
          funnel_id: string
          id: string
          session_id: string | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          event_data?: Json | null
          event_type: string
          funnel_id: string
          id?: string
          session_id?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          event_data?: Json | null
          event_type?: string
          funnel_id?: string
          id?: string
          session_id?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_analytics_funnel_id_fkey"
            columns: ["funnel_id"]
            isOneToOne: false
            referencedRelation: "funnels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_analytics_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "quiz_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "quiz_users"
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
          converted_at: string
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
          converted_at?: string
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
          converted_at?: string
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
          current_step: number | null
          funnel_id: string
          id: string
          last_activity: string
          max_score: number | null
          metadata: Json | null
          quiz_user_id: string
          score: number | null
          started_at: string
          status: string
          total_steps: number | null
        }
        Insert: {
          completed_at?: string | null
          current_step?: number | null
          funnel_id: string
          id?: string
          last_activity?: string
          max_score?: number | null
          metadata?: Json | null
          quiz_user_id: string
          score?: number | null
          started_at?: string
          status?: string
          total_steps?: number | null
        }
        Update: {
          completed_at?: string | null
          current_step?: number | null
          funnel_id?: string
          id?: string
          last_activity?: string
          max_score?: number | null
          metadata?: Json | null
          quiz_user_id?: string
          score?: number | null
          started_at?: string
          status?: string
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
      rate_limits: {
        Row: {
          created_at: string | null
          current: number
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
          current?: number
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
          current?: number
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
      real_time_metrics: {
        Row: {
          bundle_size: number | null
          cache_hit_rate: number | null
          device_info: Json | null
          editor_mode: string | null
          error_rate: number | null
          funnel_id: string | null
          id: string
          memory_usage: number | null
          network_latency: number | null
          performance_score: number | null
          recorded_at: string | null
          render_time: number | null
          session_id: string
          user_agent: string | null
          user_engagement: number | null
          user_id: string | null
          user_interaction_latency: number | null
        }
        Insert: {
          bundle_size?: number | null
          cache_hit_rate?: number | null
          device_info?: Json | null
          editor_mode?: string | null
          error_rate?: number | null
          funnel_id?: string | null
          id?: string
          memory_usage?: number | null
          network_latency?: number | null
          performance_score?: number | null
          recorded_at?: string | null
          render_time?: number | null
          session_id: string
          user_agent?: string | null
          user_engagement?: number | null
          user_id?: string | null
          user_interaction_latency?: number | null
        }
        Update: {
          bundle_size?: number | null
          cache_hit_rate?: number | null
          device_info?: Json | null
          editor_mode?: string | null
          error_rate?: number | null
          funnel_id?: string | null
          id?: string
          memory_usage?: number | null
          network_latency?: number | null
          performance_score?: number | null
          recorded_at?: string | null
          render_time?: number | null
          session_id?: string
          user_agent?: string | null
          user_engagement?: number | null
          user_id?: string | null
          user_interaction_latency?: number | null
        }
        Relationships: []
      }
      security_audit_logs: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          severity: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      system_health_metrics: {
        Row: {
          id: string
          metadata: Json | null
          metric_name: string
          metric_unit: string | null
          metric_value: number
          recorded_at: string | null
          service_name: string
          status: string | null
        }
        Insert: {
          id?: string
          metadata?: Json | null
          metric_name: string
          metric_unit?: string | null
          metric_value: number
          recorded_at?: string | null
          service_name: string
          status?: string | null
        }
        Update: {
          id?: string
          metadata?: Json | null
          metric_name?: string
          metric_unit?: string | null
          metric_value?: number
          recorded_at?: string | null
          service_name?: string
          status?: string | null
        }
        Relationships: []
      }
      templates: {
        Row: {
          created_at: string
          description: string | null
          draft_data: Json
          draft_version: number
          id: string
          name: string
          published_at: string | null
          published_data: Json | null
          published_version: number | null
          schema_version: string
          slug: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          draft_data?: Json
          draft_version?: number
          id?: string
          name: string
          published_at?: string | null
          published_data?: Json | null
          published_version?: number | null
          schema_version?: string
          slug: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          draft_data?: Json
          draft_version?: number
          id?: string
          name?: string
          published_at?: string | null
          published_data?: Json | null
          published_version?: number | null
          schema_version?: string
          slug?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_behavior_patterns: {
        Row: {
          action: string
          analyzed_period_end: string | null
          analyzed_period_start: string | null
          avg_duration: number | null
          created_at: string | null
          drop_off_points: Json | null
          frequency: number | null
          funnel_id: string | null
          id: string
          optimization_potential: number | null
          session_id: string | null
          success_rate: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          analyzed_period_end?: string | null
          analyzed_period_start?: string | null
          avg_duration?: number | null
          created_at?: string | null
          drop_off_points?: Json | null
          frequency?: number | null
          funnel_id?: string | null
          id?: string
          optimization_potential?: number | null
          session_id?: string | null
          success_rate?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          analyzed_period_end?: string | null
          analyzed_period_start?: string | null
          avg_duration?: number | null
          created_at?: string | null
          drop_off_points?: Json | null
          frequency?: number | null
          funnel_id?: string | null
          id?: string
          optimization_potential?: number | null
          session_id?: string | null
          success_rate?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_security_settings: {
        Row: {
          allowed_ips: unknown[] | null
          backup_notifications: boolean | null
          created_at: string | null
          id: string
          last_password_change: string | null
          locked_until: string | null
          login_attempts: number | null
          security_alerts: boolean | null
          security_questions: Json | null
          session_timeout: number | null
          two_factor_enabled: boolean | null
          two_factor_secret: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          allowed_ips?: unknown[] | null
          backup_notifications?: boolean | null
          created_at?: string | null
          id?: string
          last_password_change?: string | null
          locked_until?: string | null
          login_attempts?: number | null
          security_alerts?: boolean | null
          security_questions?: Json | null
          session_timeout?: number | null
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          allowed_ips?: unknown[] | null
          backup_notifications?: boolean | null
          created_at?: string | null
          id?: string
          last_password_change?: string | null
          locked_until?: string | null
          login_attempts?: number | null
          security_alerts?: boolean | null
          security_questions?: Json | null
          session_timeout?: number | null
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_rate_limits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_expired_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_analytics_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      handle_failed_login_attempt: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      log_security_event: {
        Args: { p_event_data?: Json; p_event_type: string; p_severity?: string }
        Returns: string
      }
      record_system_metric: {
        Args: {
          p_metadata?: Json
          p_metric_name: string
          p_metric_unit?: string
          p_metric_value: number
          p_service_name: string
          p_status?: string
        }
        Returns: string
      }
      reset_login_attempts: {
        Args: { p_user_id: string }
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
