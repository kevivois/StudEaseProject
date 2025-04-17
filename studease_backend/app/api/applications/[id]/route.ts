import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {getUserDataType,getHeaders} from '@/lib/middleware-helper'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const supabase = createRouteHandlerClient({ cookies });
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      if(!params.id){
        return NextResponse.json({ error: "no id" }, { status: 500 });
      }

      let {user,company} = await getUserDataType(request)

      const { data: application, error } = await supabase
      .from('applications')
      .select(`
        *,
        offers (
          *,companies(*),locations(*)
        ),users(*)`)
      .eq('id', params.id)
      .single();

      if (error || !application) {
        return NextResponse.json({ error: 'Application not found | '+error?.message }, { status: 404 });
      }

      const isOwner = application.user_id === user?.user_id;
      const isCompany = application.offers?.company_id === company?.company_id;

      if (!isOwner && !isCompany) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      return NextResponse.json({application:application});
    } catch (error:any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
} 

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!params.id) {
      return NextResponse.json({ error: "Missing application ID" }, { status: 400 });
    }

    const { user, company } = await getUserDataType(request);
    const updates = await request.json();

    const { data: application, error } = await supabase
      .from('applications')
      .select(`*, offers(company_id)`)
      .eq('id', params.id)
      .single();

    if (error || !application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const isUserOwner = user && application.user_id === user.user_id;
    const isCompanyOwner = company && application.offers?.company_id === company.company_id;

    let allowedFields: Record<string, any> = {};

    if (isUserOwner) {
      if ('application_message' in updates) {
        allowedFields.application_message = updates.application_message;
      }
    }

    if (isCompanyOwner) {
      if ('employer_feedback' in updates) {
        allowedFields.employer_feedback = updates.employer_feedback;
      }
      if ('application_progress' in updates) {
        allowedFields.application_progress = updates.application_progress;
      }
    }

    // Si aucune modif autorisée
    if (Object.keys(allowedFields).length === 0) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data: updatedApp, error: updateError } = await supabase
      .from('applications')
      .update(allowedFields)
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({ application: updatedApp });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
