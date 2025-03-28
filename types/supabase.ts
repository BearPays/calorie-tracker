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
          email: string
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      food_items: {
        Row: {
          id: string
          name: string
          calories: number
          protein: number | null
          carbs: number | null
          fat: number | null
          serving_size: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          calories: number
          protein?: number | null
          carbs?: number | null
          fat?: number | null
          serving_size: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          calories?: number
          protein?: number | null
          carbs?: number | null
          fat?: number | null
          serving_size?: string
          created_at?: string
          updated_at?: string
        }
      }
      meals: {
        Row: {
          id: string
          user_id: string
          name: string
          date: string
          meal_type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          date: string
          meal_type: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          date?: string
          meal_type?: string
          created_at?: string
          updated_at?: string
        }
      }
      meal_items: {
        Row: {
          id: string
          meal_id: string
          food_item_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          meal_id: string
          food_item_id: string
          quantity: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          meal_id?: string
          food_item_id?: string
          quantity?: number
          created_at?: string
          updated_at?: string
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
  }
} 