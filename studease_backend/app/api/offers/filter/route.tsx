import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


    const body = await request.json();

    const {
      jobTypeId,
      locationId,
      contractTypeId,
      industryIds,
      searchTerm,
      isFlexible,
      activityRateMin,
      activityRateMax,
      workingHoursSearch,
    } = body;

    let query = supabase
      .from('offers')
      .select(`
        *,
        industries:offer_industries(industries(*)),
        companies(*),
        job_types(*),
        locations(*),
        remuneration_types(*),
        engagement_durations(*),
        contract_types(*)
      `);

    if (Array.isArray(jobTypeId) && jobTypeId.length > 0) {
      query = query.in('job_type_id', jobTypeId);
    }

    if (Array.isArray(locationId) && locationId.length > 0) {
      query = query.in('location_id', locationId);
    }

    if (Array.isArray(contractTypeId) && contractTypeId.length > 0) {
      query = query.in('contract_type_id', contractTypeId);
    }

    if (isFlexible !== undefined) {
      query = query.eq('is_working_hours_flexible', isFlexible);
    }

    if (activityRateMin) {
      query = query.gte('activity_rate_min', activityRateMin);
    }

    if (activityRateMax) {
      query = query.lte('activity_rate_max', activityRateMax);
    }

    if (workingHoursSearch) {
      query = query
        .filter('working_days_hours_description', 'cs', `{${workingHoursSearch}}`);
    }

    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,profile_description.ilike.%${searchTerm}%,job_level.ilike.%${searchTerm}%`);
    }
    const { data, error } = await query;
    
    if (error) throw error;

    // Filtrage par industries côté backend si besoin
    let filtered = data;
    if (industryIds?.length) {
      filtered = filtered.filter((offer: any) => {
        const offerIndustryIds = offer.industries?.map((i: any) => i.industries?.industry_id) || [];
        return industryIds.every((id:any) => offerIndustryIds.includes(id));
      });
    }

    // Transformer industries en array d'IDs pour le frontend
    const transformed = filtered.map((offer: any) => ({
      ...offer,
      industries: offer.industries?.map((i: any) => {
        return {industry_id:i.industries?.industry_id,industry_name:i.industries?.industry_name}
      }) || [],
    }));

    return NextResponse.json({ offers: transformed });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
