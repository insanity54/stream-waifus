export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      settings: {
        Row: {
          is_streamer: boolean | null
          created_at: string | null
          id: number
          user: string
        }
        Insert: {
          is_streamer?: boolean | null
          created_at?: string | null
          id?: number
          user: string
        }
        Update: {
          is_streamer?: boolean | null
          created_at?: string | null
          id?: number
          user?: string
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