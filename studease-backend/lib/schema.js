import Joi from 'joi';

// Schéma de validation des utilisateurs
export const userSchema = Joi.object({
  user_id: Joi.string().guid({ version: 'uuidv4' }),  // UUID
  first_name: Joi.string().max(100).required(),
  last_name: Joi.string().max(100).required(),
  email: Joi.string().email().max(100).required(),
  password: Joi.string().min(6).max(255).required(),
  profile_description: Joi.string().optional(),
  skills: Joi.array().items(Joi.string()).optional(),
  created_at: Joi.string().isoDate().optional(),
  updated_at: Joi.string().isoDate().optional()
});

// Schéma de validation des offres
export const offerSchema = Joi.object({
  offer_id: Joi.string().guid({ version: 'uuidv4' }).optional(),  // UUID
  title: Joi.string().max(255).required(),
  description: Joi.string().optional(),
  job_type_id: Joi.string().guid({ version: 'uuidv4' }).optional(),  // UUID
  location_id: Joi.string().guid({ version: 'uuidv4' }).optional(),  // UUID
  remuneration_type_id: Joi.string().guid({ version: 'uuidv4' }).optional(),  // UUID
  duration_id: Joi.string().guid({ version: 'uuidv4' }).optional(),  // UUID
  start_date: Joi.string().isoDate().optional(),  // Date
  application_deadline: Joi.string().isoDate().optional(),  // Date
  is_remote: Joi.boolean().optional(),
  is_part_time: Joi.boolean().optional(),
  working_hours_id: Joi.string().guid({ version: 'uuidv4' }).optional(),  // UUID
  profile_description: Joi.string().optional(),
  required_skills: Joi.array().items(Joi.string()).optional(),  // Array de texte
  created_at: Joi.string().isoDate().optional(),
  updated_at: Joi.string().isoDate().optional()
});

// Schéma de validation des types de travail
export const jobTypeSchema = Joi.object({
  job_type_id: Joi.string().guid({ version: 'uuidv4' }).optional(),  // UUID
  job_type_name: Joi.string().max(100).required()
});

// Schéma de validation des localisations
export const locationSchema = Joi.object({
  location_id: Joi.string().guid({ version: 'uuidv4' }).optional(),  // UUID
  country: Joi.string().max(100).optional(),
  city: Joi.string().max(100).optional(),
  address: Joi.string().optional()
});

// Schéma de validation des horaires de travail
export const workingHoursSchema = Joi.object({
  working_hours_id: Joi.string().guid({ version: 'uuidv4' }).optional(),  // UUID
  start_time: Joi.string().pattern(/^([0-9]{2}):([0-9]{2})$/).required(),  // TIME format HH:MM
  end_time: Joi.string().pattern(/^([0-9]{2}):([0-9]{2})$/).required(),  // TIME format HH:MM
  days_of_week: Joi.string().optional()
});

// Schéma de validation des types de rémunération
export const remunerationTypeSchema = Joi.object({
  remuneration_type_id: Joi.string().guid({ version: 'uuidv4' }).optional(),  // UUID
  remuneration_type_name: Joi.string().max(100).required()
});

// Schéma de validation des durées d'engagement
export const engagementDurationSchema = Joi.object({
  duration_id: Joi.string().guid({ version: 'uuidv4' }).optional(),  // UUID
  duration_name: Joi.string().max(100).required()
});

// Schéma de validation des compétences
export const skillSchema = Joi.object({
  skill_id: Joi.string().guid({ version: 'uuidv4' }).optional(),  // UUID
  skill_name: Joi.string().max(100).required()
});

// Schéma de validation des types d'entreprises
export const companyTypeSchema = Joi.object({
  company_type_id: Joi.string().guid({ version: 'uuidv4' }).optional(),  // UUID
  company_type_name: Joi.string().max(100).required()
});

// Schéma de validation des pays
export const countrySchema = Joi.object({
  country_id: Joi.string().guid({ version: 'uuidv4' }).optional(),  // UUID
  country_name: Joi.string().max(100).required()
});

// Schéma de validation des types de contrat
export const contractTypeSchema = Joi.object({
  contract_type_id: Joi.string().guid({ version: 'uuidv4' }).optional(),  // UUID
  contract_type_name: Joi.string().max(100).required()
});

// Schéma de validation des modalités de travail des offres
export const offerWorkingModalitySchema = Joi.object({
  offer_id: Joi.string().guid({ version: 'uuidv4' }).required(),  // UUID
  working_modality: Joi.string().max(100).required()
});

// Schéma de validation des relations entre les offres et la durée de l'engagement
export const offerEngagementDurationSchema = Joi.object({
  offer_id: Joi.string().guid({ version: 'uuidv4' }).required(),  // UUID
  duration_id: Joi.string().guid({ version: 'uuidv4' }).required()  // UUID
});

// Schéma de validation des relations entre les offres et les mois d'engagement
export const offerEngagementMonthsSchema = Joi.object({
  offer_id: Joi.string().guid({ version: 'uuidv4' }).required(),  // UUID
  month: Joi.string().valid('Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre').required()
});

// Schéma de validation des types de rémunération des offres
export const offerRemunerationTypeSchema = Joi.object({
  offer_id: Joi.string().guid({ version: 'uuidv4' }).required(),  // UUID
  remuneration_type_id: Joi.string().guid({ version: 'uuidv4' }).required()  // UUID
});

// Schéma de validation des offres sauvegardées
export const savedOfferSchema = Joi.object({
  user_id: Joi.string().guid({ version: 'uuidv4' }).required(),  // UUID
  offer_id: Joi.string().guid({ version: 'uuidv4' }).required(),  // UUID
  saved_at: Joi.string().isoDate().optional()  // TIMESTAMP
});

// Schéma de validation des offres appliquées
export const appliedOfferSchema = Joi.object({
  user_id: Joi.string().guid({ version: 'uuidv4' }).required(),  // UUID
  offer_id: Joi.string().guid({ version: 'uuidv4' }).required(),  // UUID
  applied_at: Joi.string().isoDate().optional(),  // TIMESTAMP
});

// Schéma de validation des entreprises
export const companySchema = Joi.object({
  company_id: Joi.string().guid({ version: 'uuidv4' }).optional(),  // UUID (référence à auth.users)
  email:Joi.string().email().required(),
  password:Joi.string().required(),
  company_name: Joi.string().max(100).required(),
  company_type_id: Joi.string().guid({ version: 'uuidv4' }).required(),  // UUID
  company_address: Joi.string().optional(),
  company_phone: Joi.string().optional(),
  company_website: Joi.string().uri().optional()
});

// Schéma de validation des langues parlées par les utilisateurs
export const userLanguageSchema = Joi.object({
  user_id: Joi.string().guid({ version: 'uuidv4' }).required(),  // UUID
  language: Joi.string().max(100).required()
});

// Schéma de validation des favoris des utilisateurs
export const userFavoriteSchema = Joi.object({
  user_id: Joi.string().guid({ version: 'uuidv4' }).required(),  // UUID
  offer_id: Joi.string().guid({ version: 'uuidv4' }).required(),  // UUID
  favorite_at: Joi.string().isoDate().optional()  // TIMESTAMP
});

// Schéma de validation des candidatures des utilisateurs
export const applicationSchema = Joi.object({
  user_id: Joi.string().guid({ version: 'uuidv4' }).required(),  // UUID
  offer_id: Joi.string().guid({ version: 'uuidv4' }).required(),  // UUID
  status: Joi.string().optional(),
  application_message: Joi.string().optional(),
  documents: Joi.array().items(Joi.string().uri()).optional(),  // Array de liens
  applied_at: Joi.string().isoDate().optional(),  // TIMESTAMP
  updated_at: Joi.string().isoDate().optional()  // TIMESTAMP
});
