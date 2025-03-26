// pages/api/auth/login.js
import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
    res.status(200).json({ message: 'Hello' });
}
