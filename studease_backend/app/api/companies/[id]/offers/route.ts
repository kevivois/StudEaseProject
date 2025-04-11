import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getUserOrCompany } from '@/lib/middleware-helper'; // Votre fonction middleware pour récupérer l'utilisateur ou l'entreprise

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        
        // Initialiser le client Supabase avec les cookies
        const supabase = createRouteHandlerClient({ cookies });
        // Récupérer la session de l'utilisateur connecté
        const { data: { session } } = await supabase.auth.getSession();
        
        // Si la session n'existe pas, renvoyer une erreur 401 (non autorisé)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Vérifier si l'ID de l'entreprise est passé dans les paramètres de l'URL
        if (!params.id) {
            return NextResponse.json({ error: "No company ID provided" }, { status: 400 });
        }

        // Récupérer l'entreprise associée à cet ID
        
        let { company } = await getUserOrCompany(request, params.id);

        // Si l'entreprise n'existe pas, renvoyer une erreur 403 (interdit)
        if (!company) {
            return NextResponse.json({ error: 'Company not found or not authorized' }, { status: 403 });
        }

        // Récupérer les offres associées à cette entreprise
        const { data: offers, error } = await supabase
            .from('offers') // Table des offres
            .select('*,applications(*)') // Sélectionner toutes les colonnes
            .eq('company_id', params.id) // Filtrer par company_id
            .order('created_at', { ascending: false }); // Trier par date de création, décroissant
        
        // Si une erreur survient lors de la récupération des offres
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Renvoie les données de l'entreprise avec les offres associées
        return NextResponse.json({ company, offers }, { status: 200 });
    } catch (error: any) {
        // Gestion des erreurs génériques
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
