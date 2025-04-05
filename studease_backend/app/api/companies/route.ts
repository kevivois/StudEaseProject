import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {middlewareAuth} from '@/lib/middleware'
 

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data, error } = await supabase
      .from('companies')
      .select('*');

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}