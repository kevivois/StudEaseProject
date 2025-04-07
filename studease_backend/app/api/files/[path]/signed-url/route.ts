import { handleCors } from '@/lib/middleware';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { path: string } }) {
  await handleCors(req)
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const filePath = decodeURIComponent(params.path); // path = users/UUID/filename.pdf

  const { data, error } = await supabase.storage
    .from('documents')
    .createSignedUrl(filePath, 60 * 60); // URL valable 1h

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ url: data.signedUrl });
}
