import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import {remunerationTypeSchema} from "@/lib/schemas"
import { getUserDataType, handleCors } from '@/lib/middleware';

export async function GET(request:NextRequest) {
  await handleCors(request)
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('remuneration_types')
    .select('*')
    .order('remuneration_type_name', { ascending: true });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch remuneration types', details: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 });
}

export async function POST(request: NextRequest) {
    await handleCors(request)
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const authUserId = session.user.id;

    let {company} = await getUserDataType(request)

    if (!company) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const parsed = remunerationTypeSchema.safeParse(body);

    if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    const { remuneration_type_name } = parsed.data;

    const { data, error } = await supabase
    .from('remuneration_types')
    .insert({ remuneration_type_name })
    .select()
    .single();

    if (error) {
    const isUniqueViolation = error.code === '23505';
    return NextResponse.json({
        error: isUniqueViolation ? 'Remuneration type already exists' : 'Failed to create remuneration type',
        details: error.message,
    }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
}
