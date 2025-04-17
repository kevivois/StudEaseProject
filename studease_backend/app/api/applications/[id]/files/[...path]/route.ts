// /api/applications/[id]/files/[...path].ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { getUserDataType } from '@/lib/middleware-helper';
import mime from "mime-types"
export async function GET(req: NextRequest, { params }: { params: { id: string, path: string[] } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const filePath = `${decodeURIComponent(params.path.join('/'))}`;

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
      const isCompany = application.offers?.company_id === company?.company_id;

      if (!isOwner && !isCompany) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
  
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
