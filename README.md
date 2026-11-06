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

Page de garde publique : `/info`
- Presentation de StudEase, des parcours et des questions frequentes.
- Accessible sans compte, y compris aux visiteurs deja connectes.
- La racine `/` y redirige les visiteurs non connectes ; les comptes connectes
  conservent leur redirection vers leur tableau de bord.
- Les liens etudiant / entreprise preselectionnent le type de compte a l'inscription.
- Mise en page responsive et animations respectant la reduction des mouvements.

Style du frontend :
- Theme Material UI partage dans `studease_frontend/src/theme.ts`.
- Styles et classes de mise en page communs dans `studease_frontend/src/index.css`.
- Vert StudEase pour l'identite, turquoise contraste pour les actions.
- Formulaires accessibles avec labels, navigation clavier et mouvements reduits.
- Onglets defilants sur mobile ; les offres recruteur s'affichent en fiches
  sous 900 px, sans supprimer les actions de consultation, modification ou suppression.
- Les routes, appels API, filtres et etapes des formulaires restent inchanges.

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


5.3 Remplacer un mot de passe (administrateur)

Depuis le dossier `studease_backend`, ajouter temporairement dans `.env.local` :

SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role

La variable NEXT_PUBLIC_SUPABASE_URL doit aussi etre renseignee dans ce fichier.
Ne jamais publier la cle service_role ni lui donner un prefixe NEXT_PUBLIC_.
Ne pas committer ce fichier ni le nouveau mot de passe.

Executer dans PowerShell :

    cd .\studease_backend
    npm run auth:reset-password -- UUID_SUPABASE_AUTH

Remplacer UUID_SUPABASE_AUTH par l'identifiant du compte dans Supabase >
Authentication > Users (pas l'identifiant de la table publique users ou companies).
Le script demande le nouveau mot de passe dans la console et l'affiche en clair.
Il demande ensuite "Are you sure?" : taper yes pour confirmer. Toute autre
reponse ou une fin de saisie annule la modification.
Attention aux captures d'ecran, au partage d'ecran et aux journaux du terminal.
NEW_PASSWORD n'est plus utilise : retirer cette variable si elle est presente.
Le script utilise Supabase Auth Admin, sans modifier directement le hash en DB.
Il affiche un message de reussite seulement apres une mise a jour reussie et retourne
un code d'erreur en cas d'echec. Les regles de mot de passe Supabase restent applicables.

Retirer SUPABASE_SERVICE_ROLE_KEY de `.env.local` apres utilisation.
Cette commande est manuelle : elle ne s'execute pas au demarrage du serveur et
n'ajoute aucune route publique. Aucun mot de passe ne doit etre passe en argument.


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
