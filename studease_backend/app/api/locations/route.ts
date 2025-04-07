import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getUserDataType, handleCors } from '@/lib/middleware'; // adapte ce chemin selon ton projet
import { z } from 'zod';

import {locationSchema} from "@/lib/schemas"

export async function GET(request: NextRequest) {
  await handleCors(request)
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .order('country', { ascending: true });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  await handleCors(request)
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parse = locationSchema.safeParse(body);

  if (!parse.success) {
    return NextResponse.json({ error: 'Invalid location data', details: parse.error.format() }, { status: 400 });
  }

  const { country, region, city } = parse.data;

  const { data, error } = await supabase
    .from('locations')
    .insert({ country, region, city })
    .select()
    .single();

  if (error) {
    const isUniqueViolation = error.code === '23505'; // not sure about this lol
    return NextResponse.json(
      { error: isUniqueViolation ? 'Location already exists' : 'Error inserting location', details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ data }, { status: 201 });
}
