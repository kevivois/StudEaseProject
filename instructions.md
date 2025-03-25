# 🚀 Solution d'Hébergement pour le Projet

## **📌 Architecture Technique**

| **Composant**      | **Technologie**         | **Hébergement**        | **Description** |
|--------------------|------------------------|------------------------|----------------|
| **Frontend (React + Next.js Static)** | **Next.js (Static Export)** | **Infomaniak (Web Hosting)** | Hébergement des fichiers HTML/CSS/JS générés après `next export` |
| **Backend (API Auth, CRUD, etc.)** | **Next.js API Routes** | **Vercel (gratuit)** | Gestion des API Routes sécurisées et de l'auth avec Supabase |
| **Base de données** | **Supabase (PostgreSQL)** | **Supabase Cloud (gratuit)** | Stockage des utilisateurs, offres d'emploi, candidatures |
| **Authentification** | **Supabase Auth (JWT + Cookies HttpOnly)** | **Backend sur Vercel** | Stockage sécurisé des sessions avec des cookies HttpOnly |
| **Stockage des fichiers (CV, logos, etc.)** | **Supabase Storage** | **Supabase Cloud** | Stocke les fichiers uploadés (CVs, logos d'entreprise, etc.) |
| **Nom de domaine** | **Infomaniak** | **Infomaniak DNS** | Gère le domaine personnalisé pour le frontend et backend |

---

## **💡 Pourquoi cette solution ?**
✅ **Infomaniak gère bien les sites statiques** (React + Next.js Static)
✅ **Vercel est optimisé pour Next.js** (performant et gratuit pour petit projet)
✅ **Supabase gère tout : DB, Auth, et Storage** (intégration fluide)
✅ **Cookies HttpOnly pour une meilleure sécurité**

---

## **🚀 Déploiement**
### **1️⃣ Frontend (React + Next.js Static sur Infomaniak)**
```bash
npm run build && next export
```
- Uploader le contenu du dossier `out/` sur l'hébergement Infomaniak.

### **2️⃣ Backend (Next.js API sur Vercel)**
```bash
vercel deploy
```
- Déploiement rapide sur **Vercel** avec gestion des API Routes.

---

## **📌 Configuration des variables d’environnement**
Créer un fichier `.env.local` :
```ini
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

🎉 **Tout est prêt pour un projet sécurisé et scalable !** 🚀
