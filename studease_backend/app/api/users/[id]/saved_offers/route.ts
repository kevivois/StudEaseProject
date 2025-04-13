import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Fetch the user's saved offers using the user ID from the params
    const { data, error } = await supabase
      .from('saved_offers')
      .select(`
        id, 
        user_id, 
        offer_id,
        offers(*)
      `)
      .eq('user_id', params.id) // Filter by user_id

    // If there is an error, throw it
    if (error) throw error;

    // Return the saved offers data
    return NextResponse.json({ saved_offers: data });
  } catch (error: any) {
    // Handle any errors that occurred during the request
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
