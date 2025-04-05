import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';


export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
      const supabase = createRouteHandlerClient({ cookies });
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      if(!params.id){
        return NextResponse.json({ error: "no id" }, { status: 500 });
      }
      let offerId = params.id
      
      let {data,error} = await supabase.from('offers').select(`
        *,industries(*),companies(*),job_types(*),locations(*),remuneration_types(*),engagement_durations(*),contract_types(*)
      `).eq('offer_id', offerId).single();
      
      if (error) throw error;
      
      if(!data) throw Error("do not exist")
  
      return NextResponse.json({offer:data});
    } catch (error:any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
}