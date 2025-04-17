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
  profile_description: z.string().optional().default(''),
  skills: z.array(z.string()).optional().default([]),
  availability_start: z.string().optional().nullable(),
  availability_end: z.string().optional().nullable(),
});
export const registerCompanySchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  company_name: z.string().min(2, "Nom de l'entreprise requis"),
  company_logo_url: z.string().url().optional().nullable(),
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
  company_logo_url: z.string().url().optional().nullable(),
  company_type_id: z.string().uuid().nullable(),
  company_address: z.string().optional(),
  company_phone: z.string().optional(),
  company_website: z.string().url().optional(),
  company_description: z.string().optional(),
  created_at: z.string().optional(),
}).strict();

// ✅ OFFERS
export const offerSchema = z.object({
  title: z.string().min(2, "Titre requis"),
  job_type_id: z.string().uuid(),
  location_id: z.string().uuid(),
  remuneration_type_id: z.string().uuid(),
  duration_id: z.string().uuid().optional().nullable(),
  application_deadline: z.string().date(),
  work_location_type: z.string(),
  contract_type_id: z.string().uuid(),
  profile_description: z.string().optional(),
  required_skills: z.array(z.string()).optional().default([]),
  activity_rate_min:z.number(),
  activity_rate_max:z.number(),
  required_documents: z.array(z.string()).optional().default([]),
  benefits: z.array(z.string()).optional().default([]),
  application_steps: z.array(z.string()).optional().default([]),
  languages: z.array(z.string()).optional().default([]),
  working_days_hours_description: z.array(z.string()).default([]),
  job_level: z.string(),
  is_working_hours_flexible: z.boolean().default(false),
  contact_email: z.string().email(),
  contact_name: z.string().min(2, "Nom du contact requis"),
  documents_urls: z.array(z.string()).optional().default([]),
  startDate:z.string().date().optional().nullable(),
  endDate:z.string().date().optional().nullable(),
  max_appliants:z.number(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
}).strict();

export const offerUpdateSchema = z.object({
  title: z.string().min(2, "Titre requis"),
  job_type_id: z.string().uuid(),
  location_id: z.string().uuid(),
  remuneration_type_id: z.string().uuid(),
  duration_id: z.string().uuid().optional().nullable(),
  application_deadline: z.string().date(),
  work_location_type: z.string(),
  startDate:z.string().date().optional().nullable(),
  endDate:z.string().date().optional().nullable(),
  contract_type_id: z.string().uuid(),
  profile_description: z.string().optional(),
  required_skills: z.array(z.string()).optional().default([]),
  activity_rate_min:z.number(),
  activity_rate_max:z.number(),
  required_documents: z.array(z.string()).optional().default([]),
  benefits: z.array(z.string()).optional().default([]),
  application_steps: z.array(z.string()).optional().default([]),
  languages: z.array(z.string()).optional().default([]),
  working_days_hours_description: z.array(z.string()).default([]),
  job_level: z.string(),
  is_working_hours_flexible: z.boolean().default(false),
  contact_email: z.string().email(),
  contact_name: z.string().min(2, "Nom du contact requis"),
  documents_urls: z.array(z.string()).optional().default([]),
  max_appliants:z.number(),
  industries:z.array(z.string().uuid()).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
}).strict();


export const createOfferSchema = z.object({
  title: z.string().min(2, "Titre requis"),
  job_type_id: z.string().uuid(),
  location_id: z.string().uuid(),
  remuneration_type_id: z.string().uuid(),
  duration_id: z.string().uuid().optional().nullable(),
  application_deadline: z.string().date(),
  work_location_type: z.string(),
  industries:z.array(z.string().uuid()),
  startDate:z.string().date().optional().nullable(),
  endDate:z.string().date().optional().nullable(),
  contract_type_id: z.string().uuid(),
  profile_description: z.string().optional(),
  required_skills: z.array(z.string()).optional().default([]),
  activity_rate_min:z.number(),
  activity_rate_max:z.number(),
  required_documents: z.array(z.string()).optional().default([]),
  benefits: z.array(z.string()).optional().default([]),
  application_steps: z.array(z.string()).optional().default([]),
  languages: z.array(z.string()).optional().default([]),
  working_days_hours_description: z.array(z.string()).default([]),
  job_level: z.string(),
  max_appliants:z.number(),
  is_working_hours_flexible: z.boolean().default(false),
  contact_email: z.string().email(),
  contact_name: z.string().min(2, "Nom du contact requis"),
  documents_urls: z.array(z.string()).optional().default([]),
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
  status: z.string().default("en attente"),
  application_message: z.string().min(1,'application_message has to be more than 10 characters'),
  documents: z.array(z.string()).optional().default([]),
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

export const userUpdateSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
  location_id: z.string().uuid().optional(),
  profile_description: z.string().optional(),
  skills: z.array(z.string()).optional(),
  availability_start: z.string().optional(), // ISO Date
  availability_end: z.string().optional(),
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


export const companyUpdateSchema = z.object({
  company_name: z.string().optional(),
  company_logo_url: z.string().optional().nullable(),
  company_address: z.string().optional(),
  company_phone: z.string().optional(),
  company_website: z.string().optional(),
  company_description: z.string().optional(),
});

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
});