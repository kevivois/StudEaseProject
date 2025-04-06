import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getUserDataType } from '@/lib/middleware';
import { z } from 'zod';

import {contractTypeSchema} from "@/lib/schemas"


export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('contract_types')
    .select('*')
    .order('contract_type_name', { ascending: true });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch contract types' }, { status: 500 });
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

  if (!company) {
    return NextResponse.json({ error: 'Only companies can create contract types' }, { status: 403 });
  }

  const body = await request.json();
  const parse = contractTypeSchema.safeParse(body);

  if (!parse.success) {
    return NextResponse.json({ error: 'Invalid input', details: parse.error.format() }, { status: 400 });
  }

  const { contract_type_name } = parse.data;

  const { data, error } = await supabase
    .from('contract_types')
    .insert({ contract_type_name })
    .select()
    .single();

  if (error) {
    const isUniqueViolation = error.code === '23505';
    return NextResponse.json(
      { error: isUniqueViolation ? 'Contract type already exists' : 'Insert failed', details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ data }, { status: 201 });
}
