import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getUserDataType } from '@/lib/middleware';
import { z } from 'zod';

const linkSchema = z.object({
  industry_id: z.string().uuid(),
}).strict();

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {

  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { company } = await getUserDataType(request);
    if (!company) {
        return NextResponse.json({ error: 'Only companies can link industries to offers' }, { status: 403 });
    }

    if (!params.id) {
        return NextResponse.json({ error: 'Missing offer ID' }, { status: 400 });
    }

    const body = await request.json();
    const parsed = linkSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    const { industry_id } = parsed.data;

    await supabase.from("offers").select("*").eq("offer_id",params.id).single().throwOnError()

    const { data, error } = await supabase
        .from('offer_industries')
        .insert({
        offer_id: params.id,
        industry_id,
        })
        .select()
        .single();

    if (error) {
        const isDuplicate = error.code === '23505';
        return NextResponse.json({
        error: isDuplicate ? 'This industry is already linked to the offer' : 'Insert failed',
        details: error.message,
        }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
    }catch(error:any){
        return NextResponse.json({error:error?.message},{status:404})
    }
}
