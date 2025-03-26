// pages/api/auth/login.js
import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(200).json({ user: data.user, session: data.session });
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
