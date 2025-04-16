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
  const files = formData.getAll('files').filter(
    (f): f is File => f instanceof File
  );

  if (!files || files.length === 0) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  let {user,company} = await getUserDataType(req)

  const urlId = user!=null ? `user/${session.user.id}` : `company/${session.user.id}`

  let returnUrls = []

  for(let file of files){
    const filePath = `${urlId}/${encodeURIComponent(file.name)}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }
    returnUrls.push(filePath)
  }

  return NextResponse.json({data:returnUrls});
}
