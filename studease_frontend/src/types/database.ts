// Database Types
export interface JobType {
  job_type_id: string;
  job_type_name: string;
}

export interface Location {
  location_id: string;
  country: string;
  region: string;
  city: string;
}

export interface RemunerationType {
  remuneration_type_id: string;
  remuneration_type_name: string;
}

export interface EngagementDuration {
  duration_id: string;
  duration_label: string;
  is_flexible: boolean;
}

export interface Industry {
  industry_id: string;
  industry_name: string;
}

export interface ContractType {
  contract_type_id: string;
  contract_type_name: string;
}

export interface User {
  user_id: string;
  auth_user_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  location_id: string;
  profile_description: string;
  skills: string[];
  availability_start: string;
  availability_end: string;
  created_at: string;
  updated_at: string;
  email:string;
}

export interface Company {
  company_id: string;
  auth_user_id: string;
  company_name: string;
  company_logo_url: string;
  company_type_id: string;
  company_address: string;
  company_phone: string;
  company_website: string;
  company_description: string;
  created_at: string;
}

export interface Offer {
  offer_id: string;
  title: string;
  company_id: string;
  job_type_id: string;
  location_id: string;
  remuneration_type_id: string;
  contract_type_id: string;
  duration_id: string;
  application_deadline: string;
  start: string;
  end: string | null;
  work_location_type: string;
  profile_description: string;
  required_skills: string[];
  required_documents: string[];
  benefits: string[];
  application_steps: string[];
  languages: string[];
  activity_rate_min: string;
  activity_rate_max: string;
  working_days_hours_description: string[];
  job_level: string;
  is_working_hours_flexible: boolean;
  contact_email: string;
  contact_name: string;
  documents_urls: string[];
  created_at: string;
  updated_at: string;
  company?: Company;
  industries?: Industry[];
}

export interface Application {
  id: string;
  user_id: string;
  offer_id: string;
  status: string;
  application_message: string;
  documents: string[];
  applied_at: string;
  updated_at: string;
  employer_feedback: string | null;
  application_progress: string[];
  offer?: Offer;
  user?:User;
}

export interface SavedOffer {
  id: string;
  user_id: string;
  offer_id: string;
  saved_at: string;
  offer?: Offer;
}