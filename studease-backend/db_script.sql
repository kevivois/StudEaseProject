-- Table des utilisateurs (users)
CREATE TABLE users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,  -- Référence directe à auth.users
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    profile_description TEXT,
    skills TEXT[],  -- Liste des compétences sous forme de tableau
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Table des offres (offers)
CREATE TABLE offers (
    offer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- UUID généré aléatoirement par défaut
    title VARCHAR(255) NOT NULL,
    description TEXT,
    job_type_id UUID REFERENCES job_types(job_type_id),  -- UUID comme clé étrangère
    location_id UUID REFERENCES locations(location_id),  -- UUID comme clé étrangère
    remuneration_type_id UUID REFERENCES remuneration_types(remuneration_type_id),  -- UUID comme clé étrangère
    duration_id UUID REFERENCES engagement_durations(duration_id),  -- UUID comme clé étrangère
    start_date DATE,
    application_deadline DATE,
    is_remote BOOLEAN DEFAULT FALSE,
    is_part_time BOOLEAN DEFAULT FALSE,
    working_hours_id UUID REFERENCES working_hours(working_hours_id),  -- UUID comme clé étrangère
    profile_description TEXT,  -- Description du profil recherché
    required_skills TEXT[],  -- Liste des compétences requises
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des types de travail (job_types)
CREATE TABLE job_types (
    job_type_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- UUID généré aléatoirement par défaut
    job_type_name VARCHAR(100) UNIQUE NOT NULL
);

-- Table des localisations (locations)
CREATE TABLE locations (
    location_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- UUID généré aléatoirement par défaut
    country VARCHAR(100),
    city VARCHAR(100),
    address VARCHAR(255)
);

-- Table des horaires de travail (working_hours)
CREATE TABLE working_hours (
    working_hours_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- UUID généré aléatoirement par défaut
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    days_of_week VARCHAR(100)  -- Par exemple : 'Lundi, Mercredi, Vendredi'
);

-- Table des types de rémunération (remuneration_types)
CREATE TABLE remuneration_types (
    remuneration_type_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- UUID généré aléatoirement par défaut
    remuneration_type_name VARCHAR(100) UNIQUE NOT NULL
);

-- Table des durées d'engagement (engagement_durations)
CREATE TABLE engagement_durations (
    duration_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- UUID généré aléatoirement par défaut
    duration_name VARCHAR(100) UNIQUE NOT NULL
);

-- Table des compétences (skills)
CREATE TABLE skills (
    skill_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- UUID généré aléatoirement par défaut
    skill_name VARCHAR(100) UNIQUE NOT NULL
);

-- Table des relations entre les offres et les compétences requises (offer_skills)
CREATE TABLE offer_skills (
    offer_id UUID REFERENCES offers(offer_id),  -- UUID comme clé étrangère
    skill_id UUID REFERENCES skills(skill_id),  -- UUID comme clé étrangère
    PRIMARY KEY (offer_id, skill_id)
);

-- Table des types d'entreprises (company_types)
CREATE TABLE company_types (
    company_type_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- UUID généré aléatoirement par défaut
    company_type_name VARCHAR(100) UNIQUE NOT NULL
);

-- Table des pays (countries) pour gestion des pays de localisation des offres
CREATE TABLE countries (
    country_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- UUID généré aléatoirement par défaut
    country_name VARCHAR(100) UNIQUE NOT NULL
);

-- Table des types de contrat (contract_types)
CREATE TABLE contract_types (
    contract_type_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- UUID généré aléatoirement par défaut
    contract_type_name VARCHAR(100) UNIQUE NOT NULL
);

-- Table des relations entre les offres et les modalités de travail (offer_working_modality)
CREATE TABLE offer_working_modality (
    offer_id UUID REFERENCES offers(offer_id),  -- UUID comme clé étrangère
    working_modality VARCHAR(100),
    PRIMARY KEY (offer_id, working_modality)
);

-- Table des relations entre les offres et la durée de l'engagement
CREATE TABLE offer_engagement_duration (
    offer_id UUID REFERENCES offers(offer_id),  -- UUID comme clé étrangère
    duration_id UUID REFERENCES engagement_durations(duration_id),  -- UUID comme clé étrangère
    PRIMARY KEY (offer_id, duration_id)
);

-- Table des mois où l'engagement est possible (offer_engagement_months)
CREATE TABLE offer_engagement_months (
    offer_id UUID REFERENCES offers(offer_id),  -- UUID comme clé étrangère
    month VARCHAR(20) CHECK (month IN ('Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre')),
    PRIMARY KEY (offer_id, month)
);

-- Table des types de rémunération des offres
CREATE TABLE offer_remuneration_types (
    offer_id UUID REFERENCES offers(offer_id),  -- UUID comme clé étrangère
    remuneration_type_id UUID REFERENCES remuneration_types(remuneration_type_id),  -- UUID comme clé étrangère
    PRIMARY KEY (offer_id, remuneration_type_id)
);

-- Table des relations entre les utilisateurs et les offres sauvegardées (saved_offers)
CREATE TABLE saved_offers (
    user_id UUID REFERENCES users(user_id),  -- UUID comme clé étrangère
    offer_id UUID REFERENCES offers(offer_id),  -- UUID comme clé étrangère
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, offer_id)
);

-- Table des relations entre les utilisateurs et les offres postulées (applied_offers)
CREATE TABLE applied_offers (
    user_id UUID REFERENCES users(user_id),  -- UUID comme clé étrangère
    offer_id UUID REFERENCES offers(offer_id),  -- UUID comme clé étrangère
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, offer_id)
);

-- Table des entreprises (companies)
CREATE TABLE companies (
    company_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,  -- Clé étrangère vers auth.users
    company_name VARCHAR(255) UNIQUE NOT NULL,
    company_type_id UUID REFERENCES company_types(company_type_id),  -- UUID comme clé étrangère
    company_address VARCHAR(255),
    company_phone VARCHAR(20),
    company_website VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Table de gestion des langues parlées (user_languages)
CREATE TABLE user_languages (
    user_id UUID REFERENCES users(user_id),  -- UUID comme clé étrangère
    language VARCHAR(50),  -- Langue parlée
    PRIMARY KEY (user_id, language)
);

-- Table des favoris (user_favorites) pour stocker les offres favorites des étudiants
CREATE TABLE user_favorites (
    user_id UUID REFERENCES users(user_id),  -- UUID comme clé étrangère
    offer_id UUID REFERENCES offers(offer_id),  -- UUID comme clé étrangère
    favorite_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, offer_id)
);

-- Table des candidatures (applications) - Liens entre utilisateurs et offres
CREATE TABLE applications (
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,  -- Référence à l'utilisateur
    offer_id UUID REFERENCES offers(offer_id) ON DELETE CASCADE,  -- Référence à l'offre
    status VARCHAR(20) DEFAULT 'en_attente',  -- Statut de la candidature (par défaut "en attente")
    application_message TEXT,  -- Message de l'utilisateur lors de la candidature
    documents TEXT[],  -- Liste des documents (liens)
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Date et heure de la candidature
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Date et heure de la dernière mise à jour de la candidature
    PRIMARY KEY (user_id, offer_id)  -- Clé primaire sur la combinaison user_id et offer_id
);
