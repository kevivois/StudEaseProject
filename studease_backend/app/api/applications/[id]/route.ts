import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {getUserDataType} from '@/lib/middleware'

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

      let {user,company} = await getUserDataType(request)

      const { data: application, error } = await supabase
      .from('applications')
      .select(`
        *,
        offers (
          id,
          company_id
        )
      `)
      .eq('id', params.id)
      .single();

      if (error || !application) {
        return NextResponse.json({ error: 'Application not found' }, { status: 404 });
      }

      const isOwner = application.user_id === user?.user_id;
      const isCompany = application.offers?.company_id === company?.company_id;

      if (!isOwner && !isCompany) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      return NextResponse.json({application:application});
    } catch (error:any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
}