

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
    UNIQUE (country,region,city)
);

-- Table des types de rémunération (remuneration_types)
CREATE TABLE remuneration_types (
    remuneration_type_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    remuneration_type_name VARCHAR(100) UNIQUE NOT NULL
);

-- Table des durées d'engagement (engagement_durations)
CREATE TABLE engagement_durations (
    duration_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    duration_label VARCHAR(50) NOT NULL, -- Ex: "<1 mois", "1-6 mois", "6-12 mois"
    is_flexible BOOLEAN DEFAULT FALSE,
    UNIQUE(duration_label,is_flexible)
);

-- Table des secteurs d’activité (industries)
CREATE TABLE industries (
    industry_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    industry_name VARCHAR(255) UNIQUE NOT NULL
);

-- Table des types de contrat (contract_types)
CREATE TABLE contract_types (
    contract_type_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_type_name VARCHAR(100) UNIQUE NOT NULL
);

-- Table des utilisateurs (users)
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,  -- Référence directe à auth.users
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number varchar(100) NOT NULL,
    location_id uuid REFERENCES locations(location_id) ON DELETE SET NULL,
    profile_description TEXT,
    skills TEXT[],  -- Liste des compétences sous forme de tableau
    availability_start DATE, -- Dates de disponibilité pour les entreprises
    availability_end DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE company_types (
    company_type_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label VARCHAR(20) NOT NULL
);

-- Table des entreprises (companies)
CREATE TABLE companies (
    company_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, 
    company_name VARCHAR(255) UNIQUE NOT NULL,
    company_logo_url TEXT, -- Ajout du logo de l'entreprise
    company_type_id UUID NOT NULL REFERENCES company_types(company_type_id), 
    company_address VARCHAR(255),
    company_phone VARCHAR(20),
    company_website VARCHAR(255),
    company_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des offres (offers)
CREATE TABLE offers (
    offer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    company_id UUID REFERENCES companies(company_id) ON DELETE CASCADE,
    job_type_id UUID REFERENCES job_types(job_type_id) ON DELETE SET NULL,
    location_id UUID REFERENCES locations(location_id) ON DELETE SET NULL,
    remuneration_type_id UUID REFERENCES remuneration_types(remuneration_type_id),
    contract_type_id UUID REFERENCES contract_types(contract_type_id) ON DELETE SET NULL,
    duration_id UUID REFERENCES engagement_durations(duration_id) ON DELETE SET NULL,
    application_deadline DATE,
    start DATE NOT NULL,
    end DATE DEFAULT NULL,
    work_location_type VARCHAR(20), -- presentiel,hybride,30% présentiel
    profile_description TEXT,
    required_skills TEXT[], -- not sure for now  
    required_documents TEXT[], -- CV, lettre de motivation, etc.
    benefits TEXT[], -- Liste des avantages offerts
    application_steps TEXT[], -- Étapes du processus de recrutement (ex: postulation, entretien)
    languages TEXT[],
    activity_rate_min VARCHAR(50) NOT NULL,
    activity_rate_max VARCHAR(50) NOT NULL,
    working_days_hours_description TEXT[],
    job_level VARCHAR(50),
    is_working_hours_flexible BOOLEAN DEFAULT FALSE,
    contact_email VARCHAR(255), -- Contact pour postuler
    contact_name VARCHAR(255), -- Contact pour postuler
    documents_urls TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des relations entre les utilisateurs et les offres sauvegardées (saved_offers)
CREATE TABLE saved_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    offer_id UUID REFERENCES offers(offer_id) ON DELETE CASCADE,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des candidatures (applications)
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    offer_id UUID REFERENCES offers(offer_id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'en_attente',  
    application_message TEXT,
    documents TEXT[],  
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    employer_feedback TEXT, -- Commentaires des recruteurs
    application_progress TEXT[] -- Liste des étapes de la candidature
);


-- Table de lien entre les offres et les secteurs d'activité
CREATE TABLE offer_industries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offer_id UUID REFERENCES offers(offer_id) ON DELETE CASCADE,
    industry_id UUID REFERENCES industries(industry_id) ON DELETE CASCADE
);
