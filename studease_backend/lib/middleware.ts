import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middlewareAuth(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  return res;
}

export async function getUserDataType(req:NextRequest){
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();

  if(!session){
    return {user:null,company:null}
  }
  let userReturnData = null
  let companyReturnData = null
  const {data:userData,error:userError} = await supabase.from("users").select('*').eq("auth_user_id",session.user.id).single()
  
  if(userError){
    throw userError
  }
  
  if(!userData){
    const {data:companyData,error:companyError} = await supabase.from("companies").select('*').eq("auth_user_id",session.user.id).single()
    companyReturnData = companyData
    if(companyError){
      throw companyError
    }


  }else{
    userReturnData = userData
  }
  if(!userReturnData && companyReturnData){
    throw new Error ("id isnt a company or a user")
  }
  return {user:userReturnData,company:companyReturnData}

}