import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
 

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { data, error } = await supabase
      .from('companies')
      .select('*');

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}