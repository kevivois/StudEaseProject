-- Table des utilisateurs (users)
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,  -- Référence directe à auth.users
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    profile_description TEXT,
    skills TEXT[],  -- Liste des compétences sous forme de tableau
    preferred_languages TEXT[], -- Langues parlées par l'utilisateur
    availability_start DATE, -- Dates de disponibilité pour les entreprises
    availability_end DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des entreprises (companies)
CREATE TABLE companies (
    company_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, 
    company_name VARCHAR(255) UNIQUE NOT NULL,
    logo_url TEXT, -- Ajout du logo de l'entreprise
    company_type_id UUID REFERENCES company_types(company_type_id), 
    company_address VARCHAR(255),
    company_phone VARCHAR(20),
    company_website VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des offres (offers)
CREATE TABLE offers (
    offer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    company_id UUID REFERENCES companies(company_id),
    job_type_id UUID REFERENCES job_types(job_type_id),
    location_id UUID REFERENCES locations(location_id),
    remuneration_type_id UUID REFERENCES remuneration_types(remuneration_type_id),
    duration_id UUID REFERENCES engagement_durations(duration_id),
    application_deadline DATE,
    start_date DATE,
    end_date DATE,
    is_remote BOOLEAN DEFAULT FALSE,
    is_part_time BOOLEAN DEFAULT FALSE,
    profile_description TEXT,
    required_skills TEXT[],  
    required_documents TEXT[], -- CV, lettre de motivation, etc.
    benefits TEXT[], -- Liste des avantages offerts
    application_steps TEXT[], -- Étapes du processus de recrutement (ex: postulation, entretien)
    is_working_hours_flexible BOOLEAN DEFAULT FALSE,
    contact_email VARCHAR(255), -- Contact pour postuler
    contact_name VARCHAR(255), -- Contact pour postuler
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des horaires de travail (offer_working_hours)
CREATE TABLE offer_working_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offer_id UUID REFERENCES offers(offer_id) ON DELETE CASCADE,
    working_hours_id UUID REFERENCES working_hours(working_hours_id) ON DELETE CASCADE
);

-- Table des types de travail (job_types)
CREATE TABLE job_types (
    job_type_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_type_name VARCHAR(100) UNIQUE NOT NULL
);

-- Table des localisations (locations)
CREATE TABLE locations (
    location_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country VARCHAR(100),
    region VARCHAR(100),
    city VARCHAR(100),
);

-- Table des horaires de travail (working_hours)
CREATE TABLE working_hours (
    working_hours_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    days_of_week VARCHAR(100)  -- Ex: 'Lundi, Mercredi, Vendredi'
);

-- Table des types de rémunération (remuneration_types)
CREATE TABLE remuneration_types (
    remuneration_type_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    remuneration_type_name VARCHAR(100) UNIQUE NOT NULL
);

-- Table des durées d'engagement (engagement_durations)
CREATE TABLE engagement_durations (
    duration_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    duration_label VARCHAR(50) UNIQUE NOT NULL, -- Ex: "<1 mois", "1-6 mois", "6-12 mois"
    is_flexible BOOLEAN DEFAULT FALSE
);

-- Table des relations entre les utilisateurs et les offres sauvegardées (saved_offers)
CREATE TABLE saved_offers (
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    offer_id UUID REFERENCES offers(offer_id) ON DELETE CASCADE,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, offer_id)
);

-- Table des candidatures (applications)
CREATE TABLE applications (
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    offer_id UUID REFERENCES offers(offer_id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'en_attente',  
    application_message TEXT,
    documents TEXT[],  
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    employer_feedback TEXT, -- Commentaires des recruteurs
    application_progress TEXT[], -- Liste des étapes de la candidature
    PRIMARY KEY (user_id, offer_id)
);

-- Table des secteurs d’activité (industries)
CREATE TABLE industries (
    industry_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    industry_name VARCHAR(255) UNIQUE NOT NULL
);

-- Table de lien entre les offres et les secteurs d'activité
CREATE TABLE offer_industries (
    offer_id UUID REFERENCES offers(offer_id) ON DELETE CASCADE,
    industry_id UUID REFERENCES industries(industry_id) ON DELETE CASCADE,
    PRIMARY KEY (offer_id, industry_id)
);

-- Table des types de contrat (contract_types)
CREATE TABLE contract_types (
    contract_type_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_type_name VARCHAR(100) UNIQUE NOT NULL
);

-- Table des relations entre offres et types de contrat
CREATE TABLE offer_contract_types (
    offer_id UUID REFERENCES offers(offer_id) ON DELETE CASCADE,
    contract_type_id UUID REFERENCES contract_types(contract_type_id) ON DELETE CASCADE,
    PRIMARY KEY (offer_id, contract_type_id)
);
