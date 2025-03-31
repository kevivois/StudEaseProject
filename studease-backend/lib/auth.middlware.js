import { supabase } from "@/lib/supabase";
import cookie from "cookie";
export async function protectRoute(req, res) {
    const cookies = cookie.parse(req.headers.cookie || "");

    const token = cookies["next-auth.session-token"];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify the token with Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // Attach user info to the request
    req.user = data.user;
}
