/**
 * Hand-written to match supabase/migrations/0001_init.sql, following the shape
 * that `supabase gen types typescript` produces (each table needs
 * `Relationships`; the schema needs `Views`/`Functions`/`Enums`/`CompositeTypes`).
 *
 * REGENERATE from the live schema once linked, to stay perfectly in sync:
 *   supabase gen types typescript --linked > src/lib/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: 'user' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: 'user' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          role?: 'user' | 'admin';
          updated_at?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          organization: string | null;
          message: string;
          ip_hash: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          organization?: string | null;
          message: string;
          ip_hash?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          email?: string;
          organization?: string | null;
          message?: string;
          ip_hash?: string | null;
        };
        Relationships: [];
      };
      subscribers: {
        Row: {
          id: string;
          email: string;
          status: 'pending' | 'confirmed' | 'unsubscribed';
          confirm_token: string;
          source: string | null;
          created_at: string;
          confirmed_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          status?: 'pending' | 'confirmed' | 'unsubscribed';
          confirm_token?: string;
          source?: string | null;
          created_at?: string;
          confirmed_at?: string | null;
        };
        Update: {
          status?: 'pending' | 'confirmed' | 'unsubscribed';
          confirmed_at?: string | null;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          data: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          title: string;
          data?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          data?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
