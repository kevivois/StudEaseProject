import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { offer_id, application_message, documents } = body;

    // Get user_id from users table
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('user_id')
      .eq('auth_user_id', session.user.id)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('applications')
      .insert({
        user_id: user.user_id,
        offer_id,
        application_message,
        documents,
        status: 'en_attente',
        application_progress: ['Candidature soumise']
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user_id from users table
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('user_id')
      .eq('auth_user_id', session.user.id)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        offers (
          title,
          companies (
            company_name
          )
        )
      `)
      .eq('user_id', user.user_id);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}