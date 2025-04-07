import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getUserOrCompany } from '@/lib/middleware-helper';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    
    try {
      const supabase = createRouteHandlerClient({ cookies });
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      if(!params.id){
        return NextResponse.json({ error: "no id" }, { status: 500 });
      }
      let {company} = await getUserOrCompany(request,params.id)
      
      if(!company){
        return NextResponse.json({ error: 'Do not exist' }, { status: 403 });
      }

      
  
      return NextResponse.json({company:company});
    } catch (error:any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
}