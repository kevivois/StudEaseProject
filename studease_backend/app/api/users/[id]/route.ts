import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getUserDataType, getUserOrCompany } from '@/lib/middleware-helper';
import {userUpdateSchema} from '@/lib/schemas'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { user } = await getUserOrCompany(request, params.id);

    if (!user) {
      return NextResponse.json({ error: 'Do not exist' }, { status: 403 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const {user,company} = await getUserDataType(request)
  if(!user || user.user_id != params.id){
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const parsed = userUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('users')
    .update({
      ...parsed.data,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', params.id).eq("auth_user_id",session.user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: 'Update failed', details: error.message }, { status: 500 });
  }

  return NextResponse.json({ user: data }, { status: 200 });
}
