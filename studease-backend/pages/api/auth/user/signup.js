// pages/api/auth/signupStudent.js
import { createUser } from '@/lib/supabase'; // Fonction de création d'utilisateur dans auth.users
import { userSchema } from '@/lib/schema'; // Schéma de validation pour un étudiant
import { validateData } from '@/lib/validation'; // Fonction de validation des données
import {supabase} from "@/lib/supabase"
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const { email, password, first_name, last_name, profile_description, skills } = req.body;


    // Validation des données envoyées
    const errors = await validateData(req.body, userSchema);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Création de l'utilisateur dans auth.users
    const createdUserData = await createUser(email, password);

    if (createdUserData.error) {
      return res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error: createdUserData.error.message });
    }

    // Enregistrement dans la table `users` pour un étudiant ou un utilisateur
    const response = await supabase
      .from('users')
      .insert([{
        user_id: createdUserData.user.id,  // Lier l'utilisateur créé à l'auth.users
        first_name,
        last_name,
        profile_description,
        skills
      }]);

    if (response.error) {
      return res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error: response.error.message });
    }

    // Retourner les données de l'utilisateur créé
    return res.status(200).json({ message: 'Utilisateur créé avec succès', data: response.data });

  } catch (error) {
    return res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
  }
}
