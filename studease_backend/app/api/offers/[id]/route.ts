
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { offerSchema, offerUpdateSchema } from '@/lib/schemas';
import { getUserDataType } from '@/lib/middleware-helper';

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
    
    let {data,error} = await supabase.from('offers').select(`
      *,industries:offer_industries(industries(*)),companies(*),job_types(*),locations(*),remuneration_types(*),engagement_durations(*),contract_types(*))
    `).eq('offer_id', params.id).single();
    
    if (error) throw error;
    
    if(!data) throw Error("do not exist")

    let {data:appData,error:appError} = await supabase.from("applications").select(`
      *,
      offers (
       *,industries:offer_industries(industries(*)),companies(*),job_types(*),locations(*),remuneration_types(*),engagement_durations(*),contract_types(*)
      ),
      users(*)
    `).eq('offer_id', params.id)

    return NextResponse.json({offer:{offer:data,applications:appData}});
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const offerId = params.id;

    let {company} = await getUserDataType(request)

    if(!company){
      throw Error('only company can delete offer')
    }

    let { error:deleteError } = await supabase
      .from('offers')
      .delete()
      .eq('offer_id', offerId)
      .eq('company_id',company.company_id);

    if (deleteError) throw deleteError;


    return NextResponse.json({ message: 'Offer deleted successfully' });
  } catch (error: any) {
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

    const offerId = params.id;
    const body = await request.json();

    const parsedBody = offerUpdateSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsedBody.error.format() },
        { status: 400 }
      );
    }

    let {company} = await getUserDataType(request)

    if(!company) throw Error ("only company can update an offer")

    await supabase.from("offers").select("*").eq("offer_id",params.id).eq("company_id",company.company_id).single().throwOnError()

    let industries = parsedBody.data['industries'] ?? []

    industries.forEach(async (industry:any) => {
      let {data,error} = await supabase.from('offer_industries').select("*").eq("offer_id",params.id).eq("industry_id",industry).single()
      if(!data){
        await supabase.from("offer_industries").insert({
          offer_id:params.id,
          industry_id:industry
        })
      }
    })
    delete parsedBody.data['industries']

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
