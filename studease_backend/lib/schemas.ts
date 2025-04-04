import { z } from "zod";

// ✅ Schéma pour la table USERS
export const userSchema = z.object({
  email:z.string().email().min(4,"l'email est requis"),
  password:z.string().min(4,"le mot de passe est requis"),
  user_id: z.string().uuid().optional(),
  auth_user_id: z.string().uuid().optional(),
  first_name: z.string().min(2, "Le prénom est requis"),
  last_name: z.string().min(2, "Le nom est requis"),
  phone_number: z.string().min(10, "Numéro de téléphone requis").optional(),
  locations_id: z.string().uuid().nullable().optional(),
  profile_description: z.string().optional(),
  skills: z.array(z.string()).optional(),
  availability_start: z.string().optional(), // Date en format ISO
  availability_end: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
}).strict();

// ✅ Schéma pour la table COMPANIES
export const companySchema = z.object({
  email:z.string().email().min(4,"l'email est requis"),
  password:z.string().min(4,"le mot de passe est requis"),
  company_id: z.string().uuid().optional(),
  auth_user_id: z.string().uuid().optional(),
  company_name: z.string().min(2, "Nom de l'entreprise requis"),
  logo_url: z.string().url().optional(),
  company_type_id: z.string().uuid().nullable(),
  company_address: z.string().optional(),
  company_phone: z.string().optional(),
  company_website: z.string().url().optional(),
  description: z.string().optional(),
  created_at: z.string().optional(),
}).strict();

// ✅ Schéma pour la table OFFERS
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
  working_hours_description: z.array(z.string()).optional(),
  is_working_hours_flexible: z.boolean().default(false),
  contact_email: z.string().email(),
  contact_name: z.string().min(2, "Nom du contact requis"),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
}).strict();

// ✅ Schéma pour la table LOCATIONS
export const locationSchema = z.object({
  location_id: z.string().uuid().optional(),
  country: z.string().optional(),
  region: z.string().optional(),
  city: z.string().optional(),
}).strict();

// ✅ Schéma pour la table APPLICATIONS
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

// ✅ Schéma pour la table JOB TYPES
export const jobTypeSchema = z.object({
  job_type_id: z.string().uuid().optional(),
  job_type_name: z.string().min(2, "Nom du type d'emploi requis"),
}).strict();

// ✅ Schéma pour la table REMUNERATION TYPES
export const remunerationTypeSchema = z.object({
  remuneration_type_id: z.string().uuid().optional(),
  remuneration_type_name: z.string().min(2, "Nom du type de rémunération requis"),
}).strict();

// ✅ Schéma pour la table WORKING HOURS
export const workingHoursSchema = z.object({
  working_hours_id: z.string().uuid().optional(),
  start_time: z.string(), // Format HH:mm:ss
  end_time: z.string(),
  day_of_week: z.string(),
}).strict();

// ✅ Schéma pour la table ENGAGEMENT DURATIONS
export const engagementDurationSchema = z.object({
  duration_id: z.string().uuid().optional(),
  duration_label: z.string().min(2, "Label requis"),
  is_flexible: z.boolean().default(false),
}).strict();

// ✅ Schéma pour la table INDUSTRIES
export const industrySchema = z.object({
  industry_id: z.string().uuid().optional(),
  industry_name: z.string().min(2, "Nom de l'industrie requis"),
}).strict();

// ✅ Schéma pour la table CONTRACT TYPES
export const contractTypeSchema = z.object({
  contract_type_id: z.string().uuid().optional(),
  contract_type_name: z.string().min(2, "Nom du type de contrat requis"),
}).strict();
