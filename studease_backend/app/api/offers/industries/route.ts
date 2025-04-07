import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getUserDataType, handleCors } from '@/lib/middleware';
import { industrySchema } from '@/lib/schemas';

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('industries')
    .select('*')
    .order('industry_name', { ascending: true });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch industries' }, { status: 500 });
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
  
    const { user, company } = await getUserDataType(request);
    if (!user && !company) {
      return NextResponse.json({ error: 'Only authenticated users or companies can create industries' }, { status: 403 });
    }
  
    const body = await request.json();
    const parsed = industrySchema.safeParse(body);
  
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }
  
    const { industry_name } = parsed.data;
  
    const { data, error } = await supabase
      .from('industries')
      .insert({ industry_name })
      .select()
      .single();
  
    if (error) {
      const isUnique = error.code === '23505';
      return NextResponse.json({
        error: isUnique ? 'Industry already exists' : 'Insert failed',
        details: error.message,
      }, { status: 500 });
    }
  
    return NextResponse.json({ data }, { status: 201 });
  }
