============================================================
STUDEASE – Learn, Lead, Succeed
La plateforme suisse de mise en relation étudiants-entreprises
============================================================

1. PRÉSENTATION DU PROJET
------------------------------------------------------------

StudEase est une plateforme suisse innovante dédiée à la mise en relation
des étudiants du niveau tertiaire (HES, Universités, écoles spécialisées)
avec les acteurs du monde professionnel (PME, startups, grandes entreprises).

L’objectif principal est de créer un pont efficace entre le monde académique
et le monde professionnel en centralisant des opportunités souvent dispersées
sur plusieurs plateformes.

StudEase simplifie l’accès aux talents académiques pour les entreprises et
facilite la recherche d’opportunités professionnelles pour les étudiants.


2. PROPOSITION DE VALEUR
------------------------------------------------------------

Pour les étudiants :
- Accès 100% gratuit à la plateforme
- Recherche simplifiée et centralisée d’opportunités
- Jobs étudiants
- Stages (rémunérés ou non)
- Mandats spécifiques
- Travaux de Bachelor, Master et Doctorat
- Postulation rapide et intuitive

Pour les entreprises :
- Accès à un vivier qualifié de talents académiques
- Publication gratuite d’annonces
- Modèle économique "au succès" :
  → Commission uniquement en cas de recrutement
  → Stages non rémunérés et travaux de diplôme : 100% gratuits
- Interface de gestion claire et efficace


3. FONCTIONNALITÉS PRINCIPALES
------------------------------------------------------------

3.1 Côté Étudiants

✔ Moteur de recherche avancé avec filtres :
  - Type d’offre (job, stage, mandat, TB/TM)
  - Secteur d’activité
  - Localisation (canton, ville, rayon)
  - Modalité (présentiel / télétravail)
  - Taux d’activité
  - Type de rémunération

✔ Postulation simplifiée :
  - Téléchargement de CV
  - Lettre de motivation
  - Vidéo de présentation (optionnelle)

✔ Tableau de bord personnel :
  - Gestion des candidatures
  - Offres favorites
  - Indication des disponibilités


3.2 Côté Entreprises

✔ Création d’annonces détaillées :
  - Missions
  - Pré-requis
  - Compétences
  - Langues requises
  - Horaires
  - Bénéfices proposés

✔ Tableau de bord de gestion :
  - Visualisation des candidatures
  - Tri et filtrage
  - Mise en favoris

✔ Accès à une base de profils étudiants :
  - Filtrage par compétences
  - Filtrage par disponibilités


4. ARCHITECTURE TECHNIQUE
------------------------------------------------------------

StudEase repose sur une architecture moderne garantissant sécurité,
scalabilité et performance.

Frontend :
- React
- Next.js (Static Export)

Backend & API :
- Next.js API Routes

Base de données & Authentification :
- Supabase (PostgreSQL)
- Supabase Auth
- JWT
- Cookies HttpOnly pour sécurité renforcée

Stockage de fichiers :
- Supabase Storage
  (CV étudiants, logos entreprises)

Hébergement :
- Infomaniak : hébergement frontend statique + nom de domaine
- Vercel : déploiement des API Routes (backend)


5. INSTALLATION ET CONFIGURATION
------------------------------------------------------------

5.1 Prérequis

- Node.js (version recommandée : >= 18)
- npm ou yarn
- Compte Supabase configuré


5.2 Configuration de l’environnement

Créer un fichier `.env.local` à la racine du projet :

NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anonyme


6. DÉPLOIEMENT
------------------------------------------------------------

6.1 Déploiement du Frontend (Infomaniak)

1. Générer le build statique :
   npm run build && next export

2. Uploader le contenu du dossier /out
   sur votre espace d’hébergement Infomaniak.


6.2 Déploiement du Backend (Vercel)

1. Installer Vercel CLI (si nécessaire)
2. Déployer :
   vercel deploy

Les API Routes seront automatiquement déployées et connectées
à Supabase de manière sécurisée.


7. SÉCURITÉ
------------------------------------------------------------

- Authentification via Supabase Auth
- Tokens JWT sécurisés
- Cookies HttpOnly
- Gestion sécurisée des fichiers via Supabase Storage
- Séparation frontend (statique) / backend (serverless)


8. ROADMAP (ÉVOLUTIONS FUTURES ENVISAGÉES)
------------------------------------------------------------

- Système de messagerie interne
- Matching intelligent basé sur compétences
- Système de notation entreprise / étudiant
- Tableau de statistiques avancées
- Version multilingue (FR / DE / EN)


9. ÉQUIPE DU PROJET
------------------------------------------------------------

StudEase (Learn, Lead, Succeed) a été conceptualisé par :

- Méline Bolis
- Marija Kukeska
- Leina Mondoloni
- Alexandre Mattei

Avec le soutien de :
- HES-SO Valais Wallis
- HEIG-VD


10. LICENCE
------------------------------------------------------------

Projet académique – Tous droits réservés.
Les conditions d’utilisation peuvent être adaptées selon
l’évolution commerciale du projet.


============================================================
STUDEASE – Connecting Talent to Opportunity
============================================================
