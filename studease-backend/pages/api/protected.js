// pages/api/protected.js
import { supabase } from '../../lib/supabase';
import cookie from 'cookie';

export default async function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Non autorisé' });
  }

  // Utilisation du token pour valider l'utilisateur
  const { user, error } = await supabase.auth.api.getUser(token);

  if (error || !user) {
    return res.status(401).json({ message: 'Session expirée ou utilisateur non valide' });
  }

  // Continuer l'exécution de l'API
  res.status(200).json({ message: 'Accès autorisé', user });
}
