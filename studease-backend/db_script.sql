CREATE TABLE offer_types (
    id SERIAL PRIMARY KEY,
    type_name VARCHAR(20) UNIQUE NOT NULL  -- 'stage', 'mandat', 'job', 'CDD', 'CDI', 'mission', 'independant'
);
CREATE TABLE activity_sectors (
    id SERIAL PRIMARY KEY,
    sector_name VARCHAR(100) UNIQUE NOT NULL  -- 'Informatique', 'Marketing', 'Finance', etc.
);
CREATE TABLE application_status (
    id SERIAL PRIMARY KEY,
    status_name VARCHAR(20) UNIQUE NOT NULL  -- 'en_attente', 'accepte', 'refuse'
);
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    language VARCHAR(50),           -- Langue de l'étudiant (ex: français, anglais)
    available_from DATE,            -- Date de disponibilité
    availability_percentage INTEGER, -- Pourcentage de disponibilité
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE companies (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    company_logo_url VARCHAR(255),    -- URL du logo de l'entreprise
    company_description TEXT,        -- Description de l'entreprise
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE offers (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,  -- Le titre de l'offre
    description TEXT,             -- La description détaillée de l'offre
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,  -- L'entreprise qui a créé l'offre
    num_positions INTEGER NOT NULL,  -- Nombre de personnes à recruter pour l'offre
    offer_type_id INTEGER REFERENCES offer_types(id) ON DELETE SET NULL,  -- Référence vers le type d'offre
    activity_sector_id INTEGER REFERENCES activity_sectors(id) ON DELETE SET NULL,  -- Secteur d'activité de l'offre
    work_location VARCHAR(255),    -- Lieu de travail
    working_hours VARCHAR(50),     -- Horaires de travail
    salary_range VARCHAR(100),     -- Plage de salaire (ex: 3000-4000 EUR)
    contract_type VARCHAR(50),     -- Type de contrat (CDD, CDI, freelance, etc.)
    start_date DATE,               -- Date de début de l'offre
    end_date DATE,                 -- Date de fin (le cas échéant)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,  -- L'étudiant qui postule
    offer_id INTEGER REFERENCES offers(id) ON DELETE CASCADE,  -- L'offre à laquelle l'étudiant postule
    application_message TEXT,  -- Message de postulation de l'étudiant
    status_id INTEGER REFERENCES application_status(id) ON DELETE SET NULL,  -- Référence vers le statut de la candidature
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);