# StudEase

### Learn. Lead. Succeed.

**La plateforme suisse qui rapproche les étudiants et les entreprises autour d’opportunités concrètes.**

StudEase centralise les jobs étudiants, stages, mandats et projets de diplôme pour faciliter le passage des études au monde professionnel. Les étudiants présentent leurs compétences et suivent leurs candidatures ; les entreprises publient leurs offres et gèrent les profils reçus.

> Projet académique en évolution. Ce README décrit les fonctionnalités et la configuration présentes dans le dépôt, sans garantir leur disponibilité sur un déploiement donné.

## Sommaire

- [La plateforme](#la-plateforme)
- [Architecture](#architecture)
- [Installation locale](#installation-locale)
- [Routes et API](#routes-et-api)
- [Style et responsive](#style-et-responsive)
- [Commandes et tests](#commandes-et-tests)
- [Déploiement](#déploiement)
- [Dépannage](#dépannage)
- [Administration des comptes](#administration-des-comptes)
- [Précautions de sécurité](#précautions-de-sécurité)
- [Contribuer](#contribuer)
- [Perspectives](#perspectives)
- [Équipe et droits](#équipe-et-droits)

## La plateforme

### Pour les étudiants

- Créer un profil : formation, compétences, présentation et disponibilités.
- Rechercher des offres par mots-clés, horaires, type de travail, lieu, contrat, secteur et taux d’activité.
- Consulter les informations du poste, ses conditions et les documents associés.
- Sauvegarder des offres.
- Envoyer un message de candidature et joindre des documents.
- Retrouver ses candidatures, les étapes de recrutement et les retours de l’entreprise.

L’accès étudiant est présenté comme gratuit. Le public visé est celui des études tertiaires en Suisse, notamment les HES et universités.

### Pour les entreprises

- Présenter l’activité et les coordonnées de l’entreprise.
- Créer et modifier une offre à travers un formulaire en quatre étapes.
- Détailler les conditions de travail, langues, prérequis et documents demandés.
- Consulter les candidatures et leurs pièces jointes.
- Rédiger un retour au candidat et gérer ses annonces.

### Pour tous

La page publique **`/info`** présente StudEase, ses deux parcours et une FAQ. Elle reste accessible sans compte, mais aussi aux utilisateurs connectés.

La racine **`/`** redirige :

- les visiteurs vers `/info` ;
- les étudiants connectés vers `/student` ;
- les entreprises connectées vers `/employer`.

## Architecture

| Couche | Technologies | Rôle |
| --- | --- | --- |
| Frontend | React, TypeScript, Vite, React Router | Application SPA et navigation |
| Interface | Tailwind CSS, Material UI, Emotion | Thème, formulaires et composants responsive |
| Backend | Next.js App Router, TypeScript, Zod | Routes API et validation des données |
| Données | Supabase / PostgreSQL | Profils, offres, candidatures et référentiels |
| Authentification | Supabase Auth et helpers Next.js | Connexion et sessions par cookies |
| Documents | Supabase Storage | Fichiers des offres et candidatures |
| Déploiement configuré | Deux projets Vercel | Frontend statique et API séparée, reliés par proxy |

**Le frontend est construit avec Vite**, et non avec `next export`, même si Next.js figure aussi dans ses dépendances.

### Circulation des requêtes

```text
Navigateur
    |
    | /api/... sur le domaine du frontend
    v
Frontend
    |-- Local : proxy Vite -> http://localhost:3000/api/...
    |-- Vercel : rewrite   -> https://stud-ease-api.vercel.app/api/...
    v
Backend Next.js
    v
Supabase Auth / PostgreSQL / Storage
```

Le navigateur reste sur une seule origine pour les appels API. Cette configuration évite de dépendre des cookies tiers entre les deux domaines Vercel.

### Organisation du dépôt

```text
StudEaseProject
├── studease_frontend
│   ├── src
│   │   ├── pages          # Page publique, authentification, tableaux de bord
│   │   ├── components     # Offres, profils, formulaires et candidatures
│   │   ├── contexts       # État d’authentification
│   │   ├── lib            # Client API
│   │   ├── theme.ts       # Thème Material UI partagé
│   │   └── index.css      # Styles communs
│   ├── scripts            # Tests du client API et du proxy
│   ├── vite.config.ts     # Développement local et proxy
│   └── vercel.json        # Proxy de production et fallback SPA
├── studease_backend
│   ├── app/api            # Routes API Next.js
│   ├── lib                # Schémas, helpers et client Supabase
│   ├── types              # Types de la base
│   ├── scripts            # Administration et données de référence
│   └── db_script.sql      # Référence SQL historique
└── README.md
```

Les deux applications disposent de leurs propres [dépendances frontend](./studease_frontend/package.json) et [dépendances backend](./studease_backend/package.json). Exécuter les commandes npm dans le dossier correspondant, pas à la racine.

## Installation locale

### 1. Prérequis

- Git et npm.
- Une version LTS récente de Node.js compatible avec les dépendances du dépôt.
- Un projet Supabase avec le schéma, les référentiels et les politiques d’accès nécessaires.
- Un bucket Storage **`documents`** et des politiques compatibles avec les uploads et téléchargements.

> [Le fichier SQL](./studease_backend/db_script.sql) est une référence historique, pas une migration prête à exécuter telle quelle : il contient notamment une erreur de syntaxe dans la table `users`, et les routes utilisent des champs supplémentaires. Vérifier le schéma attendu par [les schémas Zod](./studease_backend/lib/schemas.ts) et [les types Supabase](./studease_backend/types/supabase.ts) avant de préparer une nouvelle base. Ne pas appliquer ce script à une base de production sans revue.

### 2. Cloner et installer

Exemples pour **PowerShell**, depuis le dossier où placer le projet :

```powershell
git clone https://github.com/kevivois/StudEaseProject.git
cd .\StudEaseProject

cd .\studease_backend
npm ci

cd ..\studease_frontend
npm ci
```

### 3. Configurer Supabase

Créer **`studease_backend\.env.local`** :

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://VOTRE_PROJET.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=VOTRE_CLE_ANON
```

| Variable | Usage |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique Supabase, soumise aux politiques d’accès |
| `SUPABASE_SERVICE_ROLE_KEY` | Uniquement pour la commande administrative de réinitialisation de mot de passe |

Le frontend n’a pas besoin de clé Supabase pour sa configuration actuelle : il passe par le backend via `/api`.

Les valeurs ci-dessus sont des exemples. **Ne jamais committer les fichiers d’environnement ni les clés administrateur.**

### 4. Démarrer les deux applications

Ouvrir **deux terminaux**, chacun depuis la racine du dépôt.

**Terminal backend :**

```powershell
cd .\studease_backend
npm run dev -- --port 3000
```

**Terminal frontend :**

```powershell
cd .\studease_frontend
npm run dev
```

Ouvrir l’URL affichée par Vite, généralement **`http://localhost:5173/info`**.

Le [proxy Vite](./studease_frontend/vite.config.ts) transmet `/api` au backend local sur le port **3000**. Il ne démarre pas le backend automatiquement. Si ce port change, adapter sa cible.

## Routes et API

### Pages principales

| Route | Accès | Contenu |
| --- | --- | --- |
| `/` | Tous | Redirection selon la session |
| `/info` | Public | Présentation et FAQ |
| `/login` | Public | Connexion |
| `/register` | Public | Inscription |
| `/register?type=student` | Public | Inscription avec parcours étudiant préselectionné |
| `/register?type=company` | Public | Inscription avec parcours entreprise préselectionné |
| `/student` | Étudiant | Recherche, favoris, candidatures et profil |
| `/employer` | Entreprise | Annonces et profil entreprise |
| `/employer/offers/new` | Entreprise | Création d’offre |
| `/employer/offers/:id/edit` | Entreprise | Modification d’offre |
| `/employer/offers/:id` | Entreprise | Détails d’offre et candidatures |

Les routes inconnues affichent une page 404 avec un lien vers l’accueil.

### Familles d’API

Le [client API frontend](./studease_frontend/src/lib/api.ts) utilise le préfixe relatif **`/api`**.

| Préfixe | Responsabilité |
| --- | --- |
| `/api/auth` | Inscription, connexion, déconnexion et session courante |
| `/api/users` | Profils étudiants, candidatures et offres sauvegardées |
| `/api/companies` | Profils entreprises, annonces et référentiels |
| `/api/offers` | Offres, filtres, candidatures, favoris et documents |
| `/api/applications` | Dossiers de candidature, retours et documents |
| `/api/locations` | Référentiel des lieux |

Les structures de réponses varient selon les routes. Consulter [les handlers backend](./studease_backend/app/api) et le client API avant d’ajouter une intégration.

## Style et responsive

L’interface conserve le vert StudEase pour son identité et un turquoise contrasté pour les actions.

- [Thème Material UI](./studease_frontend/src/theme.ts) : couleurs, typographie, champs, boutons, cartes et modales.
- [Styles communs](./studease_frontend/src/index.css) : navigation, formulaires d’authentification et mises en page.
- [Configuration Tailwind](./studease_frontend/tailwind.config.js) : palette partagée.
- [Page publique](./studease_frontend/src/pages/Info.tsx) et [styles associés](./studease_frontend/src/pages/Info.css) : présentation de la plateforme.

Les onglets peuvent défiler sur mobile ; les annonces recruteur passent du tableau aux fiches sous **900 px**, sans retirer leurs actions. L’interface prévoit des labels, des focus clavier visibles et le respect de `prefers-reduced-motion`.

## Commandes et tests

### Frontend

Depuis `studease_frontend` :

```powershell
npm run dev
npm run build
npm run lint
node --test scripts\apiProxy.test.cjs
```

`npm run build` produit **`dist`**. Les tests du proxy vérifient notamment les URLs relatives, le parcours login → `/me`, la transmission des cookies, les uploads et l’ordre des rewrites Vercel, avec un serveur simulé.

`npm run preview` permet de prévisualiser le build statique, mais **n’ajoute pas le proxy de développement `/api`**. Il ne remplace donc pas une validation du parcours authentifié sur Vercel.

### Backend

Depuis `studease_backend` :

```powershell
npm run dev
npm run build
npm run lint
node --test scripts\resetPassword.test.cjs
```

`npm run start` lance le backend après un build. Les tests de réinitialisation utilisent un serveur simulé et ne modifient aucun compte Supabase réel.

> Le build frontend Vite ne remplace pas un contrôle TypeScript complet. Le backend configure également `eslint.ignoreDuringBuilds` : exécuter le lint séparément. Les contrôles complets peuvent révéler des problèmes préexistants ; ne pas déduire d’un build réussi que tous les parcours ou toutes les règles d’accès sont validés.

## Déploiement

### Backend sur Vercel

Créer un projet Vercel avec :

| Réglage | Valeur |
| --- | --- |
| Root Directory | `studease_backend` |
| Framework | Next.js |
| Build Command | `npm run build` |
| Variables d’environnement | URL et clé anon Supabase |

Configurer les paramètres Supabase Auth, les URL de redirection utiles et les politiques de données/Storage pour l’environnement visé.

### Frontend sur Vercel

Créer un second projet :

| Réglage | Valeur |
| --- | --- |
| Root Directory | `studease_frontend` |
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

La [configuration Vercel](./studease_frontend/vercel.json) applique les règles dans cet ordre :

1. `/api/:path*` → `https://stud-ease-api.vercel.app/api/:path*`.
2. Les autres chemins → l’entrée de la SPA.

**Si l’URL du backend change, mettre à jour la destination du proxy et redéployer le frontend.** Le backend doit être accessible au proxy sans écran de connexion de la protection de déploiement Vercel.

### Cookies et sessions

- Le navigateur appelle `/api` sur le domaine du frontend, pas directement sur celui du backend.
- Les cookies sans attribut `Domain` sont associés à l’hôte frontend qui sert la réponse.
- Le client conserve `credentials: 'include'`.
- `SameSite=Lax` convient à ce parcours ; `SameSite=None` n’est pas nécessaire pour le proxy.
- `Secure` est recommandé en production HTTPS, mais ne remplace pas le proxy.
- La persistance (`Max-Age` / `Expires`) est distincte de `Secure`.

Ces points décrivent la configuration à conserver ou vérifier, pas une garantie que tous les attributs de sécurité sont déjà forcés dans le code. Contrôler les headers `Set-Cookie` réellement reçus.

### Autre hébergement statique

Un hébergement comme Infomaniak peut servir le contenu de **`dist`**, mais doit aussi fournir :

- un reverse proxy `/api` vers le backend ;
- un fallback vers `index.html` pour les routes React Router.

Uploader les fichiers statiques seuls ne suffit pas au parcours authentifié. Ne pas utiliser `next export` pour ce frontend.

## Dépannage

| Symptôme | Vérifications |
| --- | --- |
| Login réussi puis `/me` répond `401` | Les deux requêtes doivent cibler `https://DOMAINE_FRONTEND/api/auth/...`. Vérifier que le cookie de login est accepté puis envoyé à `/me`. |
| `/api` renvoie du HTML plutôt que du JSON | Vérifier que le proxy API précède le fallback SPA et que le frontend a été redéployé. |
| Erreur de proxy en local | Démarrer le backend sur le port 3000 et vérifier la cible du proxy Vite. |
| Une route fonctionne en navigation mais pas au rechargement | Vérifier le fallback SPA de l’hébergement. |
| Erreur CORS lors d’appels directs au backend | Utiliser le proxy prévu. Pour une intégration cross-origin distincte, vérifier l’origine exacte autorisée par [le helper CORS](./studease_backend/lib/middleware-helper.ts). |
| Offres ou listes de sélection vides | Vérifier les référentiels Supabase, les réponses API et les politiques d’accès. |
| Upload ou téléchargement refusé | Vérifier la session, le bucket `documents`, les politiques Storage et les droits sur l’offre ou la candidature. |

Après un changement de domaine ou de stratégie de cookies, supprimer les anciens cookies de session du frontend et du backend puis se reconnecter.

### Vérification après déploiement

- [ ] `/info` est accessible sans compte et après rechargement.
- [ ] Le login reçoit un cookie accepté par le navigateur.
- [ ] `/api/auth/me` répond `200` après connexion.
- [ ] Le tableau de bord correspond au type de compte.
- [ ] La session fonctionne après rechargement de page.
- [ ] La déconnexion retire l’accès aux pages protégées.
- [ ] Recherche, formulaires et documents fonctionnent avec un compte de test.
- [ ] Les actions restent accessibles sur mobile.

## Administration des comptes

### Remplacer un mot de passe

Le mot de passe Supabase Auth est **haché** : on ne récupère pas l’original, on le remplace.

Pour un compte que vous êtes autorisé à administrer :

1. Relever son UUID dans **Supabase → Authentication → Users**, pas l’identifiant de la table publique `users` ou `companies`.
2. Ajouter temporairement la clé administrateur dans `studease_backend\.env.local` :

   ```dotenv
   SUPABASE_SERVICE_ROLE_KEY=VOTRE_CLE_SERVICE_ROLE
   ```

3. Depuis la racine du dépôt :

   ```powershell
   cd .\studease_backend
   npm run auth:reset-password -- UUID_SUPABASE_AUTH
   ```

4. Saisir le nouveau mot de passe, puis confirmer avec **`yes`** à « Are you sure? ».
5. Retirer la clé administrateur du fichier après utilisation.

**Attention : le script affiche le mot de passe en clair dans le terminal.** Éviter captures, partages d’écran et enregistrement de la session. Une autre réponse ou la fin de saisie lors de la confirmation annule la modification.

Le [script](./studease_backend/scripts/resetPassword.ts) ne s’exécute pas au démarrage, n’expose aucune route publique et ne prend pas le mot de passe en argument. Il vérifie un minimum de six caractères ; les règles Supabase supplémentaires restent applicables. La variable `NEW_PASSWORD` n’est plus utilisée.

### Données de référence

[Le script `addData.ts`](./studease_backend/scripts/addData.ts) contient des données de référence et des exemples. Il nécessite une revue et une configuration adaptées avant utilisation : **ne pas l’exécuter automatiquement sur une base de production**.

## Précautions de sécurité

- Ne jamais publier de clé `service_role`, de mot de passe ou de token de session.
- Ne pas préfixer une clé administrateur par `NEXT_PUBLIC_` ou `VITE_`.
- Ne jamais stocker un mot de passe en clair dans les tables métier.
- Vérifier les politiques Row Level Security et Storage avant ouverture publique.
- Les protections de routes React ne remplacent pas les contrôles d’autorisation backend et base de données.
- Utiliser HTTPS en production et vérifier les attributs effectifs des cookies.
- Ne pas considérer ce README comme un audit de sécurité.

## Contribuer

1. Installer et lancer les deux applications localement.
2. Limiter les changements au parcours concerné et préserver les contrats API.
3. Réutiliser le thème et les composants partagés pour les changements d’interface.
4. Exécuter les builds, lints et tests pertinents.
5. Vérifier les états vide, chargement et erreur, ainsi que le clavier et les petits écrans.
6. Mettre à jour la documentation en cas de changement de configuration ou de comportement.

Les tests automatisés présents ne couvrent pas l’ensemble du produit. Compléter la validation avec des comptes et données de test, sans utiliser de données personnelles réelles.

## Perspectives

Pistes issues de la vision du projet, **non présentées comme déjà implémentées** :

- Messagerie entre étudiants et entreprises.
- Matching fondé sur les compétences.
- Statistiques avancées.
- Interface multilingue.
- Système de notation.

Le modèle économique envisagé pour les entreprises repose sur une logique « au succès ». Le dépôt ne documente pas de parcours de facturation implémenté.

## Équipe et droits

StudEase a été conceptualisé par :

- Méline Bolis
- Marija Kukeska
- Leina Mondoloni
- Alexandre Mattei

Avec le soutien de **HES-SO Valais Wallis** et **HEIG-VD**.

Projet académique — **tous droits réservés**. Aucune licence open source n’est accordée par ce README ; les conditions d’utilisation pourront évoluer avec le projet.

---

**StudEase — Connecting Talent to Opportunity.**
