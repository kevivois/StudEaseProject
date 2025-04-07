import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getUserDataType } from '@/lib/middleware-helper'; // ← adapte selon ton chemin
import { z } from 'zod';

import {companyTypeSchema} from "@/lib/schemas"


export async function GET(request: NextRequest) {
  
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('company_types')
    .select('*')
    .order('label', { ascending: true });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch company types' }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { company } = await getUserDataType(request);

  // Seules les companies peuvent créer
  if (!company) {
    return NextResponse.json({ error: 'Only companies can create company types' }, { status: 403 });
  }

  const body = await request.json();

  const parse = companyTypeSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: 'Invalid label', details: parse.error.format() }, { status: 400 });
  }

  const { label } = parse.data;

  const { data, error } = await supabase
    .from('company_types')
    .insert({ label })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: 'Error creating company type', details: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
