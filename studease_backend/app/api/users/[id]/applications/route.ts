import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getUserDataType,getUserOrCompany } from '@/lib/middleware';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let {user} = await getUserOrCompany(request,params.id)
  if (!user) {
    return NextResponse.json({ error: 'User not found'}, { status: 404 });
  }

  const { data: applications, error } = await supabase
    .from('applications')
    .select(`
      *,
      offers (
        offer_id,
        title,
        company_id,
        location_id
      )
    `)
    .eq('user_id', params.id)
    .order('applied_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch applications', details: error.message }, { status: 500 });
  }

  return NextResponse.json({ applications }, { status: 200 });
}
