import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getUserDataType, getUserOrCompany } from '@/lib/middleware-helper';
import { companyUpdateSchema } from '@/lib/schemas';
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!params.id) {
      return NextResponse.json({ error: 'Missing company ID' }, { status: 400 });
    }

    const { company, user } = await getUserDataType(request)

    if (!company || company.company_id != params.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    const parsed = companyUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('companies')
      .update(parsed.data)
      .eq('company_id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ company: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
