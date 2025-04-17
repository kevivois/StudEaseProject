// /api/offers/[id]/files/[...path].ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import mime from "mime-types"
export async function GET(req: NextRequest, { params }: { params: { id: string, path: string[] } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const filePath = `${decodeURIComponent(params.path.join('/'))}`;
  const { data, error } = await supabase.storage.from('documents').download(filePath)
  if (error || !data) return NextResponse.json({ error: 'File not found' }, { status: 404 });
  const mimeType = mime.lookup(filePath) || 'application/octet-stream';
    const filename = filePath.split('/').pop();

return new NextResponse(data.stream(), {
    status: 200,
    headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `inline; filename="${filename}"`, // or "attachment" to force download
        'Cache-Control': 'no-store',
    },
    });
}
