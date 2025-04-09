import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

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

export async function getUserDataType(req: NextRequest) {
  try {
    const supabase = createMiddlewareClient({ req, res: NextResponse.next() });
    const { data: { session } } = await supabase.auth.getSession();

    // Si la session n'existe pas, retournez directement null pour l'utilisateur et l'entreprise
    if (!session) {
      return { user: null, company: null };
    }


    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*, saved_offers(*), applications(*)")
      .eq("auth_user_id", session.user.id)
      .single();


    // Si les données de l'utilisateur n'ont pas été trouvées, on tente de récupérer les données de l'entreprise
    if (!userData) {
      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .select("*, offers(*)")
        .eq("auth_user_id", session.user.id)
        .single();

      if (companyError && userError) {
        throw Error(companyError.message + "|"+userError.message);
      }

      return { user: null,company:{type:"company",...companyData} };
    }

    return { user:{...userData,type:"student"}, company: null };
  } catch (error) {
    console.error("Error in getUserDataType:", error);
    return { user: null, company: null }; // Retour par défaut en cas d'erreur
  }
}

export async function getUserOrCompany(req: NextRequest, id: string) {
  try {
    const supabase = createMiddlewareClient({ req, res: NextResponse.next() });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return { user: null, company: null };
    }

    // Tentez de récupérer les données de l'utilisateur avec l'ID fourni
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*, saved_offers(*), applications(*)")
      .eq("user_id", id)
      .single();

    if (userError) {
      throw userError;
    }

    if (userData) {
      return { user: {type:"student",...userData}, company: null };
    }

    // Si l'utilisateur n'a pas été trouvé, tentez de récupérer les données de l'entreprise
    const { data: companyData, error: companyError } = await supabase
      .from("companies")
      .select("*, offers(*)")
      .eq("company_id", id)
      .single();

    if (companyError) {
      throw companyError;
    }

    return { user: null, company:{type:"company",...companyData} };
  } catch (error) {
    console.error("Error in getUserOrCompany:", error);
    return { user: null, company: null }; // Retour par défaut en cas d'erreur
  }
}


export function getHeaders() {

    let headers = new Headers()
  
    // Set CORS headers for all API routes
    headers.append('Access-Control-Allow-Credentials', "true")
    headers.append('Access-Control-Allow-Origin', 'http://localhost:5173') // frontend url
    headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS')
    headers.append(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version,Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization,'    )

  
    return headers;
}