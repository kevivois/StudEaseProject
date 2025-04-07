import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';
import {jobTypeSchema} from '@/lib/schemas'


export async function GET(request:NextRequest) {
  
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('job_types')
    .select('*')
    .order('job_type_name', { ascending: true });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch job types', details: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 });
}

export async function POST(request: NextRequest) {
  
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if the user is a company
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('company_id')
    .eq('auth_user_id', session.user.id)
    .single();

  if (companyError || !company) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const parsed = jobTypeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
  }

  const { job_type_name } = parsed.data;

  const { data, error } = await supabase
    .from('job_types')
    .insert({ job_type_name })
    .select()
    .single();

  if (error) {
    const isUniqueViolation = error.code === '23505';
    return NextResponse.json({
      error: isUniqueViolation ? 'Job type already exists' : 'Failed to create job type',
      details: error.message,
    }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
