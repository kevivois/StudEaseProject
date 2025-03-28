
import {supabase} from '@/lib/supabase'
export async function company_type_id_exist(req,res,company_type_id) {
    if(company_type_id == null){
        return res.status(400).json({error:"Error checking company type"})
    }
    const { data: companyTypeData, error: companyTypeError } = await supabase
        .from('company_types')
        .select('company_type_id')
        .eq('company_type_id', company_type_id)  // Check for matching company_type_id
        .single();  // Ensures only one result (or none)

        if (companyTypeError) {
        return res.status(400).json({ error: 'Error checking company type.' });
        }

        if (!companyTypeData) {
        return res.status(404).json({ error: 'Company type not found.' });
        }
}