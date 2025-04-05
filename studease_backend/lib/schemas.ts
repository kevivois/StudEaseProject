import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe requis"),
});
export const registerUserSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  first_name: z.string().min(2, "Prénom requis"),
  last_name: z.string().min(2, "Nom requis"),
  phone_number: z.string().min(10, "Numéro de téléphone requis").optional(),
  location_id: z.string().uuid().nullable().optional(),
  profile_description: z.string().optional(),
  skills: z.array(z.string()).optional(),
  availability_start: z.string().optional(),
  availability_end: z.string().optional(),
});
export const registerCompanySchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  company_name: z.string().min(2, "Nom de l'entreprise requis"),
  company_logo_url: z.string().url().optional(),
  company_type_id: z.string().uuid().nullable(),
  company_address: z.string().optional(),
  company_phone: z.string().optional(),
  company_website: z.string().url().optional(),
  company_description: z.string().optional(),
});


// ✅ USERS
export const userSchema = z.object({
  user_id: z.string().uuid().optional(),
  auth_user_id: z.string().uuid().optional(),
  email: z.string().email("L'email est requis"),
  password: z.string().min(6, "Le mot de passe est requis"),
  first_name: z.string().min(2, "Le prénom est requis"),
  last_name: z.string().min(2, "Le nom est requis"),
  phone_number: z.string().min(6, "Numéro de téléphone requis").optional(),
  location_id: z.string().uuid().nullable().optional(),
  profile_description: z.string().optional(),
  skills: z.array(z.string()).optional(),
  availability_start: z.string().optional(), // Format ISO
  availability_end: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
}).strict();

// ✅ COMPANIES
export const companySchema = z.object({
  company_id: z.string().uuid().optional(),
  auth_user_id: z.string().uuid().optional(),
  email: z.string().email("L'email est requis"),
  password: z.string().min(6, "Le mot de passe est requis"),
  company_name: z.string().min(2, "Nom de l'entreprise requis"),
  company_logo_url: z.string().url().optional(),
  company_type_id: z.string().uuid().nullable(),
  company_address: z.string().optional(),
  company_phone: z.string().optional(),
  company_website: z.string().url().optional(),
  company_description: z.string().optional(),
  created_at: z.string().optional(),
}).strict();

// ✅ OFFERS
export const offerSchema = z.object({
  offer_id: z.string().uuid().optional(),
  title: z.string().min(2, "Titre requis"),
  company_id: z.string().uuid(),
  job_type_id: z.string().uuid(),
  location_id: z.string().uuid().nullable(),
  remuneration_type_id: z.string().uuid().nullable(),
  duration_id: z.string().uuid().nullable(),
  application_deadline: z.string().optional(),
  work_location_type: z.enum(["présentiel", "hybride", "30% présentiel"]).optional(),
  profile_description: z.string().optional(),
  required_skills: z.array(z.string()).optional(),
  required_documents: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  application_steps: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  working_days_hours_description: z.array(z.string()).optional(),
  job_level: z.string().optional(),
  is_working_hours_flexible: z.boolean().default(false),
  contact_email: z.string().email(),
  contact_name: z.string().min(2, "Nom du contact requis"),
  documents_urls: z.array(z.string()).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
}).strict();

// ✅ LOCATIONS
export const locationSchema = z.object({
  location_id: z.string().uuid().optional(),
  country: z.string().optional(),
  region: z.string().optional(),
  city: z.string().optional(),
}).strict();

// ✅ APPLICATIONS
export const applicationSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  offer_id: z.string().uuid(),
  status: z.enum(["en_attente", "acceptée", "refusée"]).default("en_attente"),
  application_message: z.string().optional(),
  documents: z.array(z.string()).optional(),
  applied_at: z.string().optional(),
  updated_at: z.string().optional(),
  employer_feedback: z.string().optional(),
  application_progress: z.array(z.string()).optional(),
}).strict();

// ✅ JOB TYPES
export const jobTypeSchema = z.object({
  job_type_id: z.string().uuid().optional(),
  job_type_name: z.string().min(2, "Nom du type d'emploi requis"),
}).strict();

// ✅ REMUNERATION TYPES
export const remunerationTypeSchema = z.object({
  remuneration_type_id: z.string().uuid().optional(),
  remuneration_type_name: z.string().min(2, "Nom du type de rémunération requis"),
}).strict();

// ✅ ENGAGEMENT DURATIONS
export const engagementDurationSchema = z.object({
  duration_id: z.string().uuid().optional(),
  duration_label: z.string().min(2, "Label requis"),
  is_flexible: z.boolean().default(false),
}).strict();

// ✅ INDUSTRIES
export const industrySchema = z.object({
  industry_id: z.string().uuid().optional(),
  industry_name: z.string().min(2, "Nom de l'industrie requis"),
}).strict();

// ✅ CONTRACT TYPES
export const contractTypeSchema = z.object({
  contract_type_id: z.string().uuid().optional(),
  contract_type_name: z.string().min(2, "Nom du type de contrat requis"),
}).strict();

// ✅ COMPANY TYPES
export const companyTypeSchema = z.object({
  company_type_id: z.string().uuid().optional(),
  label: z.string().min(2, "Label requis"),
}).strict();

// ✅ SAVED OFFERS
export const savedOfferSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  offer_id: z.string().uuid(),
  saved_at: z.string().optional(),
}).strict();

// ✅ OFFER INDUSTRIES
export const offerIndustrySchema = z.object({
  id: z.string().uuid().optional(),
  offer_id: z.string().uuid(),
  industry_id: z.string().uuid(),
}).strict();

// ✅ OFFER CONTRACT TYPES
export const offerContractTypeSchema = z.object({
  id: z.string().uuid().optional(),
  offer_id: z.string().uuid(),
  contract_type_id: z.string().uuid(),
}).strict();
