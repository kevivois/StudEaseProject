import {protectRoute} from "@/lib/auth.middlware"
import {supabase} from "@/lib/supabase"
export default async function handler(req, res) {
    await protectRoute(req,res)
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Company ID is required' });
    }
    if(id != req.user.company_id){
        return res.status(404).json({ error: 'Not authorized to access this data' });
    }
    
    let company = await supabase.from("companies").select("*").eq("company_id",id).single()

    if(!company.data){
        return res.status(405).json({ error: 'No company with id '+id });
    }
    
    try {
        switch (req.method) {
            case 'GET':
                return res.status(200).json(company.data);

            case 'PUT': {
                const updates = Object.entries(req.body).reduce((acc, [key, value]) => {
                    if (key !== "company_id" && value !== null && value !== undefined) {
                        acc[key] = value;
                    }
                    return acc;
                }, {});
            
                const { data, error } = await supabase
                    .from('companies')
                    .update(updates)
                    .eq('company_id', id)
                    .select()
                    .single();

                if (error) return res.status(500).json({ error: error.message });
                return res.status(200).json(data);
            }

            case 'DELETE': {
                return res.status(405).json({ error: "Method Not Allowed(1)" });
                /*
                const { error } = await supabase
                    .from('companies')
                    .delete()
                    .eq('company_id', id);

                if (error) return res.status(500).json({ error: error.message });
                return res.status(200).json({ message: "Company deleted successfully" });
                */
            }
            default:
                return res.status(405).json({ error: "Method Not Allowed" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}