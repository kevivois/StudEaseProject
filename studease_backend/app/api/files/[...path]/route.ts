
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import mime from 'mime-types'; // npm install mime-types
export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const filePath = decodeURIComponent(params.path.join("/")); // path = users/UUID/filename.pdf

  const { data, error } = await supabase.storage
    .from('documents')
    .download(filePath)

  if (error || !data) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
  const mimeType = mime.lookup(filePath) || 'application/octet-stream';
  const response = new NextResponse(data, {
    status: 200,
    headers: {
      'Content-Type': mimeType, // Important !
      'Content-Disposition': `inline; filename="${params.path.at(-1)}"`,
      'Cache-Control': 'private, max-age=0, no-cache',
    },
  });

  return response;
}
