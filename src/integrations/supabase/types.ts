export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '12.2.3 (519615d)';
  };
  public: {
    Tables: {
      funnel_pages: {
        Row: {
          blocks: Json;
          created_at: string | null;
          funnel_id: string;
          id: string;
          metadata: Json | null;
          page_order: number;
          page_type: string;
          title: string | null;
          updated_at: string | null;
        };
        Insert: {
          blocks?: Json;
          created_at?: string | null;
          funnel_id: string;
          id: string;
          metadata?: Json | null;
          page_order: number;
          page_type: string;
          title?: string | null;
          updated_at?: string | null;
        };
        Update: {
          blocks?: Json;
          created_at?: string | null;
          funnel_id?: string;
          id?: string;
          metadata?: Json | null;
          page_order?: number;
          page_type?: string;
          title?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'funnel_pages_funnel_id_fkey';
            columns: ['funnel_id'];
            isOneToOne: false;
            referencedRelation: 'funnels';
            referencedColumns: ['id'];
          },
        ];
      };
      funnels: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          is_published: boolean | null;
          name: string;
          settings: Json | null;
          updated_at: string | null;
          user_id: string | null;
          version: number | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id: string;
          is_published?: boolean | null;
          name: string;
          settings?: Json | null;
          updated_at?: string | null;
          user_id?: string | null;
          version?: number | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_published?: boolean | null;
          name?: string;
          settings?: Json | null;
          updated_at?: string | null;
          user_id?: string | null;
          version?: number | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          name: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id: string;
          name?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          name?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      quiz_analytics: {
        Row: {
          event_data: Json | null;
          event_type: string;
          funnel_id: string;
          id: string;
          session_id: string | null;
          timestamp: string;
          user_id: string | null;
        };
        Insert: {
          event_data?: Json | null;
          event_type: string;
          funnel_id: string;
          id?: string;
          session_id?: string | null;
          timestamp?: string;
          user_id?: string | null;
        };
        Update: {
          event_data?: Json | null;
          event_type?: string;
          funnel_id?: string;
          id?: string;
          session_id?: string | null;
          timestamp?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'quiz_analytics_funnel_id_fkey';
            columns: ['funnel_id'];
            isOneToOne: false;
            referencedRelation: 'funnels';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'quiz_analytics_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: false;
            referencedRelation: 'quiz_sessions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'quiz_analytics_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'quiz_users';
            referencedColumns: ['id'];
          },
        ];
      };
      quiz_conversions: {
        Row: {
          affiliate_id: string | null;
          commission_rate: number | null;
          conversion_data: Json | null;
          conversion_type: string;
          conversion_value: number | null;
          converted_at: string;
          currency: string | null;
          id: string;
          product_id: string | null;
          product_name: string | null;
          session_id: string;
        };
        Insert: {
          affiliate_id?: string | null;
          commission_rate?: number | null;
          conversion_data?: Json | null;
          conversion_type: string;
          conversion_value?: number | null;
          converted_at?: string;
          currency?: string | null;
          id?: string;
          product_id?: string | null;
          product_name?: string | null;
          session_id: string;
        };
        Update: {
          affiliate_id?: string | null;
          commission_rate?: number | null;
          conversion_data?: Json | null;
          conversion_type?: string;
          conversion_value?: number | null;
          converted_at?: string;
          currency?: string | null;
          id?: string;
          product_id?: string | null;
          product_name?: string | null;
          session_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'quiz_conversions_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: false;
            referencedRelation: 'quiz_sessions';
            referencedColumns: ['id'];
          },
        ];
      };
      quiz_results: {
        Row: {
          created_at: string;
          id: string;
          next_steps: Json | null;
          recommendation: string | null;
          result_data: Json | null;
          result_description: string | null;
          result_title: string | null;
          result_type: string;
          session_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          next_steps?: Json | null;
          recommendation?: string | null;
          result_data?: Json | null;
          result_description?: string | null;
          result_title?: string | null;
          result_type: string;
          session_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          next_steps?: Json | null;
          recommendation?: string | null;
          result_data?: Json | null;
          result_description?: string | null;
          result_title?: string | null;
          result_type?: string;
          session_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'quiz_results_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: false;
            referencedRelation: 'quiz_sessions';
            referencedColumns: ['id'];
          },
        ];
      };
      quiz_sessions: {
        Row: {
          completed_at: string | null;
          current_step: number | null;
          funnel_id: string;
          id: string;
          last_activity: string;
          max_score: number | null;
          metadata: Json | null;
          quiz_user_id: string;
          score: number | null;
          started_at: string;
          status: string;
          total_steps: number | null;
        };
        Insert: {
          completed_at?: string | null;
          current_step?: number | null;
          funnel_id: string;
          id?: string;
          last_activity?: string;
          max_score?: number | null;
          metadata?: Json | null;
          quiz_user_id: string;
          score?: number | null;
          started_at?: string;
          status?: string;
          total_steps?: number | null;
        };
        Update: {
          completed_at?: string | null;
          current_step?: number | null;
          funnel_id?: string;
          id?: string;
          last_activity?: string;
          max_score?: number | null;
          metadata?: Json | null;
          quiz_user_id?: string;
          score?: number | null;
          started_at?: string;
          status?: string;
          total_steps?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'quiz_sessions_funnel_id_fkey';
            columns: ['funnel_id'];
            isOneToOne: false;
            referencedRelation: 'funnels';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'quiz_sessions_quiz_user_id_fkey';
            columns: ['quiz_user_id'];
            isOneToOne: false;
            referencedRelation: 'quiz_users';
            referencedColumns: ['id'];
          },
        ];
      };
      quiz_step_responses: {
        Row: {
          answer_text: string | null;
          answer_value: string | null;
          id: string;
          metadata: Json | null;
          question_id: string;
          question_text: string | null;
          responded_at: string;
          response_time_ms: number | null;
          score_earned: number | null;
          session_id: string;
          step_number: number;
        };
        Insert: {
          answer_text?: string | null;
          answer_value?: string | null;
          id?: string;
          metadata?: Json | null;
          question_id: string;
          question_text?: string | null;
          responded_at?: string;
          response_time_ms?: number | null;
          score_earned?: number | null;
          session_id: string;
          step_number: number;
        };
        Update: {
          answer_text?: string | null;
          answer_value?: string | null;
          id?: string;
          metadata?: Json | null;
          question_id?: string;
          question_text?: string | null;
          responded_at?: string;
          response_time_ms?: number | null;
          score_earned?: number | null;
          session_id?: string;
          step_number?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'quiz_step_responses_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: false;
            referencedRelation: 'quiz_sessions';
            referencedColumns: ['id'];
          },
        ];
      };
      quiz_users: {
        Row: {
          created_at: string;
          email: string | null;
          id: string;
          ip_address: unknown | null;
          name: string | null;
          session_id: string;
          user_agent: string | null;
          utm_campaign: string | null;
          utm_medium: string | null;
          utm_source: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: string;
          ip_address?: unknown | null;
          name?: string | null;
          session_id: string;
          user_agent?: string | null;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: string;
          ip_address?: unknown | null;
          name?: string | null;
          session_id?: string;
          user_agent?: string | null;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
