// /api/applications/[id]/files/upload.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { getUserDataType } from '@/lib/middleware-helper';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const application_id = params.id;
  const formData = await req.formData();
  const files = formData.getAll('files') as File[];

  let {user,company} = await getUserDataType(req)

  const { data: application, error:applicationError } = await supabase
      .from('applications')
      .select(`
        *,
        offers (
          *,companies(*),locations(*)
        ),users(*)`)
      .eq('id', params.id)
      .single();

      if (applicationError || !application) {
        return NextResponse.json({ error: 'Application not found' }, { status: 404 });
      }
      const isOwner = application.user_id === user?.user_id;

      if (!isOwner) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

  if (!files?.length) return NextResponse.json({ error: 'No files provided' }, { status: 400 });
  

  const paths = [];

  for (const file of files) {
    const path = `applications/${application_id}/${file.name}`;
    const { error } = await supabase.storage.from('documents').upload(path, file, {
      upsert: true,
      contentType: file.type,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    paths.push(path);
  }

  const updatedDocs = [...(application?.documents || []), ...paths];

  const { data:updatedData,error: updateError } = await supabase
  .from('applications')
  .update({ documents: updatedDocs })
  .eq('id', params.id).select(`
    *,
    offers (
      *,companies(*),locations(*)
    ),users(*)`)

    if (updateError || !updatedData) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ data: updatedData });
}
