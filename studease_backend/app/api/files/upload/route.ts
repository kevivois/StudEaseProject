import { getUserDataType } from '@/lib/middleware-helper';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const files = formData.getAll('files') as  File[];

  if (!files) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  let {user,company} = await getUserDataType(req)

  const urlId = user ? `user/${user.user_id}` : ` company/${company!.company_id}`

  let returnUrls = []

  for(let file of files){
    const filePath = `${urlId}/${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Générer un URL temporaire pour accès
    const { data: signedData, error: signedError } = await supabase.storage
      .from('documents')
      .createSignedUrl(filePath, 60 * 60);

    if (signedError) {
      return NextResponse.json({ error: signedError.message }, { status: 500 });
    }
    returnUrls.push({ url: signedData.signedUrl, path: filePath })
  }

  return NextResponse.json({data:returnUrls});
}
