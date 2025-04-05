import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { registerUserSchema } from "@/lib/schemas"; // Import du schéma

export async function POST(request: Request) {

  try{

  const body = await request.json();

  const parsedBody = registerUserSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsedBody.error.format() },
        { status: 400 }
      );
    }
  const { email, password, first_name, last_name, profile_description, skills } = parsedBody.data
  const supabase = createRouteHandlerClient({ cookies });
  const { data, error } = await supabase.auth.signUp({ email, password });

  if(!data || !data.user || !data.user.id){
    throw new Error("created user data is null : server Error ")
  }

  const response = await supabase
      .from('users')
      .insert([{
        auth_user_id: data.user.id,  // Lier l'utilisateur créé à l'auth.users
        first_name,
        last_name,
        profile_description,
        skills
      }]);
    if (response.error) {
      return NextResponse.json({ message: 'Erreur lors de la création de l\'utilisateur', error: response.error.message },{status:404});
    }

  

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ user: data.user, message: "Signup successful" });
  } catch(error:any){
    return NextResponse.json({error:error.message},{status:404})
  }
}
