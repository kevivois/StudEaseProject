// pages/api/auth/logout.js
import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(200).json({ message: 'User logged out' });
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
