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
      citations: {
        Row: {
          ai_engine: string
          authority_score: number | null
          citation_text: string | null
          citation_timestamp: string | null
          citation_type: string
          competitor_domains: string[] | null
          confidence: number | null
          context_after: string | null
          context_before: string | null
          context_score: number | null
          created_at: string | null
          discovered_at: string
          domain_id: string
          id: string
          is_verified: boolean | null
          keyword_id: string | null
          market_share: number | null
          position: number | null
          position_score: number | null
          quality_score: number | null
          query: string
          relevance_score: number | null
          source_url: string | null
          total_sources: number | null
          updated_at: string | null
        }
        Insert: {
          ai_engine: string
          authority_score?: number | null
          citation_text?: string | null
          citation_timestamp?: string | null
          citation_type: string
          competitor_domains?: string[] | null
          confidence?: number | null
          context_after?: string | null
          context_before?: string | null
          context_score?: number | null
          created_at?: string | null
          discovered_at?: string
          domain_id: string
          id?: string
          is_verified?: boolean | null
          keyword_id?: string | null
          market_share?: number | null
          position?: number | null
          position_score?: number | null
          quality_score?: number | null
          query: string
          relevance_score?: number | null
          source_url?: string | null
          total_sources?: number | null
          updated_at?: string | null
        }
        Update: {
          ai_engine?: string
          authority_score?: number | null
          citation_text?: string | null
          citation_timestamp?: string | null
          citation_type?: string
          competitor_domains?: string[] | null
          confidence?: number | null
          context_after?: string | null
          context_before?: string | null
          context_score?: number | null
          created_at?: string | null
          discovered_at?: string
          domain_id?: string
          id?: string
          is_verified?: boolean | null
          keyword_id?: string | null
          market_share?: number | null
          position?: number | null
          position_score?: number | null
          quality_score?: number | null
          query?: string
          relevance_score?: number | null
          source_url?: string | null
          total_sources?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "citations_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "monitored_domains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "citations_keyword_id_fkey"
            columns: ["keyword_id"]
            isOneToOne: false
            referencedRelation: "monitored_keywords"
            referencedColumns: ["id"]
          },
        ]
      }
      competitors: {
        Row: {
          competitor_domain: string
          competitor_name: string | null
          created_at: string | null
          domain_id: string
          id: string
          is_active: boolean | null
        }
        Insert: {
          competitor_domain: string
          competitor_name?: string | null
          created_at?: string | null
          domain_id: string
          id?: string
          is_active?: boolean | null
        }
        Update: {
          competitor_domain?: string
          competitor_name?: string | null
          created_at?: string | null
          domain_id?: string
          id?: string
          is_active?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "competitors_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "monitored_domains"
            referencedColumns: ["id"]
          },
        ]
      }
      monitored_domains: {
        Row: {
          created_at: string | null
          display_name: string | null
          domain: string
          id: string
          is_active: boolean | null
          monitoring_frequency: string | null
          organization_id: string
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          domain: string
          id?: string
          is_active?: boolean | null
          monitoring_frequency?: string | null
          organization_id: string
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          domain?: string
          id?: string
          is_active?: boolean | null
          monitoring_frequency?: string | null
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "monitored_domains_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      monitored_keywords: {
        Row: {
          category: string | null
          created_at: string | null
          domain_id: string
          id: string
          is_active: boolean | null
          keyword: string
          priority: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          domain_id: string
          id?: string
          is_active?: boolean | null
          keyword: string
          priority?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          domain_id?: string
          id?: string
          is_active?: boolean | null
          keyword?: string
          priority?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "monitored_keywords_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "monitored_domains"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          organization_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          organization_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          organization_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          domain: string | null
          id: string
          name: string
          subscription_tier: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain?: string | null
          id?: string
          name: string
          subscription_tier?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string | null
          id?: string
          name?: string
          subscription_tier?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          id: string
          organization_id: string | null
          role: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          organization_id?: string | null
          role?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          organization_id?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          config: Json
          created_at: string | null
          domain_id: string | null
          id: string
          is_active: boolean | null
          last_generated: string | null
          name: string
          organization_id: string
          schedule: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          config: Json
          created_at?: string | null
          domain_id?: string | null
          id?: string
          is_active?: boolean | null
          last_generated?: string | null
          name: string
          organization_id: string
          schedule?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          config?: Json
          created_at?: string | null
          domain_id?: string | null
          id?: string
          is_active?: boolean | null
          last_generated?: string | null
          name?: string
          organization_id?: string
          schedule?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "monitored_domains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      traffic_data: {
        Row: {
          brand_searches: number | null
          conversions: number | null
          created_at: string | null
          date: string
          direct_sessions: number | null
          domain_id: string
          id: string
          leads: number | null
          organic_sessions: number | null
          revenue: number | null
          source: string | null
          total_sessions: number | null
        }
        Insert: {
          brand_searches?: number | null
          conversions?: number | null
          created_at?: string | null
          date: string
          direct_sessions?: number | null
          domain_id: string
          id?: string
          leads?: number | null
          organic_sessions?: number | null
          revenue?: number | null
          source?: string | null
          total_sessions?: number | null
        }
        Update: {
          brand_searches?: number | null
          conversions?: number | null
          created_at?: string | null
          date?: string
          direct_sessions?: number | null
          domain_id?: string
          id?: string
          leads?: number | null
          organic_sessions?: number | null
          revenue?: number | null
          source?: string | null
          total_sessions?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "traffic_data_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "monitored_domains"
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
