// pages/api/offers/create.js
import { supabase } from '../../../lib/supabase';
// this is an example
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, description, type } = req.body;

    const { data, error } = await supabase
      .from('offers')
      .insert([{ title, description, type }]);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(201).json({ offer: data });
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
