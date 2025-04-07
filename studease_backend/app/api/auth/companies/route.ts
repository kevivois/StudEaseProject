import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { handleCors } from '@/lib/middleware';

import { registerCompanySchema } from "@/lib/schemas"; // Import du schéma

export async function POST(request: NextRequest) {
  handleCors(request);
  try{
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json();


  const parsedBody = registerCompanySchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsedBody.error.format() },
        { status: 400 }
      );
    }


  const { email, password, company_name, company_type_id, company_address, company_phone, company_website } = parsedBody.data;


  await supabase.from("company_types").select("*").eq("company_type_id",company_type_id).single().throwOnError()

  const { data, error } = await supabase.auth.signUp({ email, password });

  if(!data || !data.user || !data.user.id){
    throw new Error("server Error "+error?.message)
  }

  const response = await supabase
      .from('companies')
      .insert([{
        auth_user_id: data?.user?.id,  // Utilisation de l'ID de auth.users
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
