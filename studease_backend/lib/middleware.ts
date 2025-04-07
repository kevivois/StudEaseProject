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
  let userReturnData:any = null
  let companyReturnData:any = null
  const {data:userData,error:userError} = await supabase.from("users").select(` *,
      auth.users(id,email),
      saved_offers(*),
      applications(*)`).eq("auth_user_id",session.user.id).single()
  
  if(userError){
    throw userError
  }
  
  if(!userData){
    const {data:companyData,error:companyError} = await supabase.from("companies").select(`*,auth.users(id,email,password),offers(*)`).eq("auth_user_id",session.user.id).single()
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


export async function getUserOrCompany(req:NextRequest,id:any){
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();

  if(!session){
    return {user:null,company:null}
  }
  let userReturnData = null
  let companyReturnData = null
  const {data:userData,error:userError} = await supabase.from("users").select(` *,
      auth.users(id,email),
      saved_offers(*),
      applications(*)`).eq("user_id",id).single()
  
  if(userError){
    throw userError
  }
  
  if(!userData){
    const {data:companyData,error:companyError} = await supabase.from("companies").select(`*,auth.users(id,email,password),offers(*)`).eq("company_id",id).single()
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

export async function handleCors(request:NextRequest) {
    const res = NextResponse.next();
  
    // Set CORS headers for all API routes
    res.headers.append('Access-Control-Allow-Credentials', "true")
    res.headers.append('Access-Control-Allow-Origin', 'http://localhost:5173') // frontend url
    res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS')
    res.headers.append(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version,Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization,'    )

  
    return res;
}