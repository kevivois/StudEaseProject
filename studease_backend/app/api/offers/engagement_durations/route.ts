import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getUserDataType } from '@/lib/middleware-helper';
import { z } from 'zod';

import {engagementDurationSchema} from "@/lib/schemas"


export async function GET(request: NextRequest) {
  
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('engagement_durations')
    .select('*')
    .order('duration_label', { ascending: true });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch durations' }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }


  const body = await request.json();
  const parse = engagementDurationSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: 'Invalid input', details: parse.error.format() }, { status: 400 });
  }
  const { duration_label, is_flexible } = parse.data;

  const { data, error } = await supabase
    .from('engagement_durations')
    .insert({ duration_label, is_flexible })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      'Insert failed',
      { status: 500 }
    );
  }

  return NextResponse.json({ data }, { status: 201 });
}
