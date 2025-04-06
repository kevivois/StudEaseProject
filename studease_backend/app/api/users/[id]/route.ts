import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {getUserOrCompany} from '@/lib/middleware'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let {user} = await getUserOrCompany(request,params.id)


    if (!user) {
      return NextResponse.json({ error: 'Do not exist' }, { status: 403 });
    }
    return NextResponse.json({ user: user });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
