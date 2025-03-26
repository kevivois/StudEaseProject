// pages/api/auth/signup.js
import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    const { user, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(200).json({ user });
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
