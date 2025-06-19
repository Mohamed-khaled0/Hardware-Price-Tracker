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
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: number
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: number
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: number
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      newsletters: {
        Row: {
          created_at: string | null
          email: string
          id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
      price_history: {
        Row: {
          id: string
          price: number
          product_id: number
          recorded_at: string
          source: string
        }
        Insert: {
          id?: string
          price: number
          product_id: number
          recorded_at?: string
          source?: string
        }
        Update: {
          id?: string
          price?: number
          product_id?: number
          recorded_at?: string
          source?: string
        }
        Relationships: []
      }
      product_comparisons: {
        Row: {
          created_at: string
          id: string
          product_ids: number[]
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_ids: number[]
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          product_ids?: number[]
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      product_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          product_id: number
          rating: number
          reviewer_name: string
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id: number
          rating: number
          reviewer_name: string
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id?: number
          rating?: number
          reviewer_name?: string
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string | null
          id: number
          price: number
          thumbnail: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          price: number
          thumbnail?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          id?: number
          price?: number
          thumbnail?: string | null
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          blocked: boolean | null
          created_at: string
          id: string
          roles: string[]
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          blocked?: boolean | null
          created_at?: string
          id: string
          roles?: string[]
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          blocked?: boolean | null
          created_at?: string
          id?: string
          roles?: string[]
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          created_at: string
          id: string
          product_id: number
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: number
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: number
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_user_role: {
        Args: { uid: string; new_role: string }
        Returns: string[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_blocked: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      list_users_with_profiles: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          username: string
          avatar_url: string
          blocked: boolean
          roles: string[]
          created_at: string
          updated_at: string
        }[]
      }
      remove_user_role: {
        Args: { uid: string; old_role: string }
        Returns: string[]
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
