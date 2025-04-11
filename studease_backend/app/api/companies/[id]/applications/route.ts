import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });

  const companyId = params.id;

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Étape 1 : Récupérer les offres de la company
  const { data: offers, error: offersError } = await supabase
    .from('offers')
    .select('offer_id')
    .eq('company_id', companyId);

  if (offersError) {
    return NextResponse.json({ error: offersError.message }, { status: 500 });
  }

  const offerIds = offers?.map((o) => o.offer_id);
  if (!offerIds || offerIds.length === 0) {
    return NextResponse.json({ applications: [] });
  }

  // Étape 2 : Récupérer les applications liées à ces offres
  const { data: applications, error: applicationsError } = await supabase
    .from('applications')
    .select('*, users(*), offers(*)')
    .in('offer_id', offerIds);

  if (applicationsError) {
    return NextResponse.json({ error: applicationsError.message }, { status: 500 });
  }

  return NextResponse.json({ applications });
}
