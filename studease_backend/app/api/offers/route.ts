import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import {offerSchema} from  "@/lib/schemas"
import {getUserDataType} from "@/lib/middleware"
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


    let {user,company} = await getUserDataType(request)
    if (!company) {
      return NextResponse.json({ error: 'only company can create offer' }, { status: 404 });
    }

    let body = await request.json();

    if(body.application_deadline){
      body.application_deadline = new Date(body.application_deadline)
    }

    const parsedBody = offerSchema.safeParse(body);
        if (!parsedBody.success) {
          return NextResponse.json(
            { error: "Données invalides", details: parsedBody.error.format()},
            { status: 400 }
          );
    }


    let {title,job_type_id,location_id,contract_type_id,remuneration_type_id,duration_id,application_deadline,work_location_type,profile_description,required_documents,required_skills,languages,job_level,is_working_hours_flexible,contact_email,contact_name,documents_urls} = parsedBody.data
    
    await supabase.from("locations").select("*").eq("location_id",location_id).single().throwOnError()
    await supabase.from("contract_types").select("*").eq("contract_type_id",contract_type_id).single().throwOnError()
    await supabase.from("remuneration_types").select("*").eq("remuneration_type_id",remuneration_type_id).single().throwOnError()
    await supabase.from("engagement_durations").select("*").eq("duration_id",duration_id).single().throwOnError()
    await supabase.from("job_types").select("*").eq("job_type_id",job_type_id).single().throwOnError()



    let insertObj = {company_id:company.company_id,contract_type_id,title,job_type_id,location_id,remuneration_type_id,duration_id,application_deadline,work_location_type,profile_description,required_documents,required_skills,languages,job_level,is_working_hours_flexible,contact_email,contact_name,documents_urls}

    const { data, error } = await supabase
      .from('offers')
      .insert({
        ...insertObj
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({offer:data});
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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
