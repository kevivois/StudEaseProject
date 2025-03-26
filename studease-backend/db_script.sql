
-- 2. Table des types d'offre (offer_types)
CREATE TABLE offer_types (
    id SERIAL PRIMARY KEY,
    type_name VARCHAR(20) UNIQUE NOT NULL  -- 'stage', 'mandat', 'job', 'CDD', 'CDI', 'mission', 'independant'
);

-- 3. Table des statuts de candidature (application_status)
CREATE TABLE application_status (
    id SERIAL PRIMARY KEY,
    status_name VARCHAR(20) UNIQUE NOT NULL  -- 'en_attente', 'accepte', 'refuse'
);

-- 4. Table des utilisateurs (users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);
CREATE TABLE companies (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 5. Table des offres (offers)
CREATE TABLE offers (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,  -- Le titre de l'offre
    description TEXT,             -- La description détaillée de l'offre
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,  -- L'entreprise qui a créé l'offre
    num_positions INTEGER NOT NULL,  -- Nombre de personnes à recruter pour l'offre
    offer_type_id INTEGER REFERENCES offer_types(id) ON DELETE SET NULL,  -- Référence vers le type d'offre
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Table des candidatures (applications)
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,  -- L'étudiant qui postule
    offer_id INTEGER REFERENCES offers(id) ON DELETE CASCADE,  -- L'offre à laquelle l'étudiant postule
    application_message TEXT,  -- Message de postulation de l'étudiant
    status_id INTEGER REFERENCES application_status(id) ON DELETE SET NULL,  -- Référence vers le statut de la candidature
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
