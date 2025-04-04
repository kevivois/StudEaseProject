import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import {offerSchema} from  "@/lib/schemas"

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const parsedBody = offerSchema.safeParse(body);
        if (!parsedBody.success) {
          return NextResponse.json(
            { error: "Données invalides", details: parsedBody.error.format()},
            { status: 400 }
          );
    }

    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('company_id')
      .eq('auth_user_id', session.user.id)
      .single();

    if (companyError || !company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('offers')
      .insert({
        ...body,
        company_id: company.company_id
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

type Company = {
  company_id: string;
  offer_id:string;
};

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const offerId = params.id;

    let { data, error } = await supabase
      .from('companies')
      .select('company_id')
      .eq('auth_user_id', session.user.id)
      .single();

    if(error || !data){
      throw Error('Company not found'+error?.message)
    }

    let { error:deleteError } = await supabase
      .from('offers')
      .delete()
      .eq('offer_id', offerId)
      .eq('company_id',data.company_id);

    if (deleteError) throw deleteError;


    return NextResponse.json({ message: 'Offer deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const offerId = params.id;
    const body = await request.json();

    const parsedBody = offerSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsedBody.error.format() },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('offers')
      .update(parsedBody.data)
      .eq('offer_id', offerId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
