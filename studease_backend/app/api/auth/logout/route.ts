import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { handleCors } from '@/lib/middleware';
export async function POST(request:NextRequest) {
  handleCors(request);
  const supabase = createRouteHandlerClient({ cookies });

  // Supprimer la session active
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Logout successful" });
}
