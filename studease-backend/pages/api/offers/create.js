// pages/api/offers/create.js
import { supabase } from '@/lib/supabase';
import { protectRoute } from "@/lib/auth.middlware";
export default async function handler(req, res) {
  if (req.method === 'POST') {
    await protectRoute(req,res);

    
  }
  return res.status(405).json({ message: 'Method Not Allowed' });
}
