// pages/api/auth/login.js
import { supabase } from '../../../lib/supabase';
import cookie from "cookie";
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

    res.setHeader("Set-Cookie", cookie.serialize("next-auth.session-token", data.session.access_token, {
      httpOnly: true, // Prevent JavaScript access
      secure: process.env.NODE_ENV === "production", // Use secure flag in production
      maxAge: 60 * 60 * 24 * 7, // 7 days expiration
      path: "/",
      sameSite: "Strict",
  }));
    return res.status(200).json({ user: data.user, session: data.session });
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
