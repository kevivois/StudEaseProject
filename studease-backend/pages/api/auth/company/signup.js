// pages/api/auth/signupCompany.js
import { createUser } from '@/lib/supabase'; // Fonction de création d'utilisateur dans auth.users
import { companySchema } from '@/lib/schema'; // Schéma de validation pour une entreprise
import { validateData } from '@/lib/validation' // Fonction de validation des données
import {supabase} from '@/lib/supabase'
import {company_type_id_exist} from '@/lib/checkingFunctions'
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const { email, password, company_name, company_type_id, company_address, company_phone, company_website } = req.body;


    // Validation des données envoyées
    const errors = await validateData(req.body, companySchema);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    await company_type_id_exist(req,res,company_type_id)

    // Création de l'utilisateur dans auth.users
    const createdUserData = await createUser(email, password);

    if (createdUserData.error) {
      return res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error: createdUserData.error.message });
    }



    // Enregistrement dans la table `companies` en utilisant l'ID de `auth.users`
    const response = await supabase
      .from('companies')
      .insert([{
        company_id: createdUserData.user.id,  // Utilisation de l'ID de auth.users
        company_name,
        company_type_id,
        company_address,
        company_phone,
        company_website
      }]);
    if (response.error) {
      return res.status(500).json({ message: 'Erreur lors de la création de l\'entreprise', error: response.error.message });
    }

    // Réponse à l'utilisateur
    return res.status(200).json({ message: 'Compte entreprise créé avec succès', company: response.data });

  } catch (error) {
    return res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
  }
}
