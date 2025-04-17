import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { getUserDataType, getUserOrCompany } from '@/lib/middleware-helper';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  const offerId = params.id;

  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const files = formData.getAll('files') as File[];

  if (!files?.length) return NextResponse.json({ error: 'No files provided' }, { status: 400 });

  const uploadedPaths: string[] = [];

  for (const file of files) {
    const path = `offers/${offerId}/${file.name}`;
    const { error } = await supabase.storage.from('documents').upload(path, file, {
      upsert: true,
      contentType: file.type,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    uploadedPaths.push(path);
  }

  let {user,company} = await getUserDataType(req)

  if(!company){
    return NextResponse.json({error:"Forbidden"},{status:404})
  }

  // Fetch current document list
  const { data: existingOffer, error: fetchError } = await supabase
    .from('offers')
    .select('offer_id,company_id,documents_urls')
    .eq('offer_id', offerId).eq("company_id",company.company_id)
    .single();

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 404 });

  const updatedDocs = [...(existingOffer?.documents_urls || []), ...uploadedPaths];

  // Update the offer with the new file paths
  const { data:updatedData,error: updateError } = await supabase
    .from('offers')
    .update({ documents_urls: updatedDocs })
    .eq('offer_id', offerId).select(`
        *,industries:offer_industries(industries(*)),companies(*),job_types(*),locations(*),remuneration_types(*),engagement_durations(*),contract_types(*))
      `)

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ data: updatedData });
}
