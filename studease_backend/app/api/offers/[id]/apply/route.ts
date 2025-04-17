import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {getUserDataType} from '@/lib/middleware-helper'
import {applicationSchema} from '@/lib/schemas'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  
    try {
      let body = await request.json()
      const supabase = createRouteHandlerClient({ cookies });
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      if(!params.id){
        return NextResponse.json({ error: "no id" }, { status: 500 });
      }
      let offerId = params.id
      
      let {data,error} = await supabase.from('offers').select(`
        *
      `).eq('offer_id', offerId).single().throwOnError();
    

        let dbData = await getUserDataType(request)

        if(dbData.user){
          const parsedBody = applicationSchema.safeParse(body);
            if (!parsedBody.success) {
              return NextResponse.json(
                { error: "Données invalides", details: parsedBody.error.format() },
                { status: 400 }
              );
            }

            const {status,application_message,documents} = parsedBody.data

            let userId = dbData.user.user_id
            let offerId = params.id

            let {data:offerData,error:offerError} = await supabase.from('applications').insert({
              user_id:userId,
              offer_id:offerId,
              status:status,
              application_message:application_message,
              documents:documents,
            }).select().single()

            if(!data || offerError){
              throw new Error("Error while creating applications "+offerError?.message)
            }
            return NextResponse.json({application:offerData});
        }else{
          throw Error("only user can apply to offer")
        }
    } catch (error:any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
}