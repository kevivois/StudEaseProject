import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { z } from "zod";

import { registerCompanySchema } from "@/lib/schemas"; // Import du schéma

export async function POST(request: Request) {

  try{

    const body = await request.json();


  const parsedBody = registerCompanySchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsedBody.error.format() },
        { status: 400 }
      );
    }


  const { email, password, company_name, company_type_id, company_address, company_phone, company_website } = parsedBody.data;

  const supabase = createRouteHandlerClient({ cookies });
  const { data, error } = await supabase.auth.signUp({ email, password });

  if(!data || !data.user || !data.user.id){
    throw new Error("created user data is null : server Error "+error?.message)
  }

  const response = await supabase
      .from('companies')
      .insert([{
        company_id: data?.user?.id,  // Utilisation de l'ID de auth.users
        company_name,
        company_type_id,
        company_address,
        company_phone,
        company_website
      }]);
    if (response.error) {
      return NextResponse.json({ message: 'Erreur lors de la création de l\'entreprise', error: response.error.message },{status:404});
    }

  

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ user: data.user, message: "Signup successful" });
  } catch(error:any){
    return NextResponse.json({error:error.message},{status:404})
  }
}
