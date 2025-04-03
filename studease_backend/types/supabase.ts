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
      users: {
        Row: {
          user_id: string
          auth_user_id: string
          first_name: string
          last_name: string
          phone_number: string
          locations_id: string | null
          profile_description: string | null
          skills: string[] | null
          availability_start: string | null
          availability_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id?: string
          auth_user_id: string
          first_name: string
          last_name: string
          phone_number: string
          locations_id?: string | null
          profile_description?: string | null
          skills?: string[] | null
          availability_start?: string | null
          availability_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          auth_user_id?: string
          first_name?: string
          last_name?: string
          phone_number?: string
          locations_id?: string | null
          profile_description?: string | null
          skills?: string[] | null
          availability_start?: string | null
          availability_end?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      companies: {
        Row: {
          company_id: string
          auth_user_id: string
          company_name: string
          logo_url: string | null
          company_type_id: string | null
          company_address: string | null
          company_phone: string | null
          company_website: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          company_id?: string
          auth_user_id: string
          company_name: string
          logo_url?: string | null
          company_type_id?: string | null
          company_address?: string | null
          company_phone?: string | null
          company_website?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          company_id?: string
          auth_user_id?: string
          company_name?: string
          logo_url?: string | null
          company_type_id?: string | null
          company_address?: string | null
          company_phone?: string | null
          company_website?: string | null
          description?: string | null
          created_at?: string
        }
      }
      offers: {
        Row: {
          offer_id: string
          title: string
          company_id: string
          job_type_id: string | null
          location_id: string | null
          remuneration_type_id: string | null
          duration_id: string | null
          application_deadline: string | null
          work_location_type: string | null
          profile_description: string | null
          required_skills: string[] | null
          required_documents: string[] | null
          benefits: string[] | null
          application_steps: string[] | null
          working_hours_description: string[] | null
          is_working_hours_flexible: boolean
          contact_email: string | null
          contact_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          offer_id?: string
          title: string
          company_id: string
          job_type_id?: string | null
          location_id?: string | null
          remuneration_type_id?: string | null
          duration_id?: string | null
          application_deadline?: string | null
          work_location_type?: string | null
          profile_description?: string | null
          required_skills?: string[] | null
          required_documents?: string[] | null
          benefits?: string[] | null
          application_steps?: string[] | null
          working_hours_description?: string[] | null
          is_working_hours_flexible?: boolean
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          offer_id?: string
          title?: string
          company_id?: string
          job_type_id?: string | null
          location_id?: string | null
          remuneration_type_id?: string | null
          duration_id?: string | null
          application_deadline?: string | null
          work_location_type?: string | null
          profile_description?: string | null
          required_skills?: string[] | null
          required_documents?: string[] | null
          benefits?: string[] | null
          application_steps?: string[] | null
          working_hours_description?: string[] | null
          is_working_hours_flexible?: boolean
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          user_id: string
          offer_id: string
          status: string
          application_message: string | null
          documents: string[] | null
          applied_at: string
          updated_at: string
          employer_feedback: string | null
          application_progress: string[] | null
        }
        Insert: {
          id?: string
          user_id: string
          offer_id: string
          status?: string
          application_message?: string | null
          documents?: string[] | null
          applied_at?: string
          updated_at?: string
          employer_feedback?: string | null
          application_progress?: string[] | null
        }
        Update: {
          id?: string
          user_id?: string
          offer_id?: string
          status?: string
          application_message?: string | null
          documents?: string[] | null
          applied_at?: string
          updated_at?: string
          employer_feedback?: string | null
          application_progress?: string[] | null
        }
      }
    }
  }
}