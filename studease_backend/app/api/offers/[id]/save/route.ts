import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getUserDataType, handleCors } from '@/lib/middleware';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  await handleCors(request)
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { user } = await getUserDataType(request);
  if (!user) {
    return NextResponse.json({ error: 'Only users can save offers' }, { status: 403 });
  }

  const offerId = params.id;
  if (!offerId) {
    return NextResponse.json({ error: 'Missing offer ID' }, { status: 400 });
  }

  // Check if already saved
  const { data: existing, error: fetchError } = await supabase
    .from('saved_offers')
    .select('id')
    .eq('user_id', user.user_id)
    .eq('offer_id', offerId)
    .maybeSingle(); 

  if (fetchError) {
    return NextResponse.json({ error: 'Failed to check saved offer', details: fetchError.message }, { status: 500 });
  }

  if (existing) {
    // Unsave
    const { error: deleteError } = await supabase
      .from('saved_offers')
      .delete()
      .eq('id', existing.id);

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to unsave offer', details: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Offer unsaved successfully', saved: false });
  } else {
    // Save
    const { data: saved, error: saveError } = await supabase
      .from('saved_offers')
      .insert({
        user_id: user.user_id,
        offer_id: offerId,
      })
      .select()
      .single();

    if (saveError) {
      return NextResponse.json({ error: 'Failed to save offer', details: saveError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Offer saved successfully', saved: true, data: saved });
  }
}
