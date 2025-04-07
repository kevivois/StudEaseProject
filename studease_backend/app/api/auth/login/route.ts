import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { z } from "zod";

import { loginSchema } from "@/lib/schemas"; // Import du schéma
import { getHeaders } from '@/lib/middleware-helper';


export async function POST(request: NextRequest) {
  ;
  const body = await request.json();


  const parsedBody = loginSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsedBody.error.format() },
        { status: 400 }
      );
    }
  const { email, password } = parsedBody.data
  
  const supabase = createRouteHandlerClient({ cookies });
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ user: data.user, message: "Login successful" });
}

export async function OPTIONS(request:NextRequest){
  return NextResponse.json({},{status:200,headers:getHeaders()})
}
