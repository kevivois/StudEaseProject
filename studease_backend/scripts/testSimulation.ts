import fetch from 'node-fetch';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const headers = {
  'Content-Type': 'application/json',
};

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

async function runSimulation() {
  console.log('🧪 Starting test simulation...');

  // 1. Create a user and a company (simulate auth externally or via direct DB seed)
  console.log('➡️ Simulating login...');
  const loginUser = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email: 'user@test.com', password: 'password' }),
  });
  const userCookies = loginUser.headers.get('set-cookie');

  const loginCompany = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email: 'company@test.com', password: 'password' }),
  });
  const companyCookies = loginCompany.headers.get('set-cookie');

  // 2. Create Location
  console.log('📍 Creating location...');
  const location:any = await fetch(`${API}/locations`, {
    method: 'POST',
    headers: { ...headers, Cookie: userCookies! },
    body: JSON.stringify({ country: 'France', region: 'Île-de-France', city: 'Paris' }),
  }).then(res => res.json());

  // 3. Create contract type
  console.log('📄 Creating contract type...');
  await fetch(`${API}/offers/contract_types`, {
    method: 'POST',
    headers: { ...headers, Cookie: companyCookies! },
    body: JSON.stringify({ contract_type_name: 'CDI' }),
  });

  // 4. Create job type
  await fetch(`${API}/offers/job_types`, {
    method: 'POST',
    headers: { ...headers, Cookie: companyCookies! },
    body: JSON.stringify({ job_type_name: 'Développeur Web' }),
  });

  // 5. Create remuneration type
  await fetch(`${API}/offers/remuneration_types`, {
    method: 'POST',
    headers: { ...headers, Cookie: companyCookies! },
    body: JSON.stringify({ remuneration_type_name: 'Mensuel' }),
  });

  // 6. Create engagement duration
  await fetch(`${API}/offers/engagement_durations`, {
    method: 'POST',
    headers: { ...headers, Cookie: userCookies! },
    body: JSON.stringify({ duration_label: '1-6 mois', is_flexible: true }),
  });

    await fetch(`${API}/offers/job_types`, {
    method: 'POST',
    headers: { ...headers, Cookie: userCookies! },
    body: JSON.stringify({ job_type_name: 'Développeur web'}),
  });


  // 7. Create industry
  const industry:any = await fetch(`${API}/offers/industries`, {
    method: 'POST',
    headers: { ...headers, Cookie: companyCookies! },
    body: JSON.stringify({ industry_name: 'Tech' }),
  }).then(res => res.json());

  // 8. Create offer
  console.log('💼 Creating offer...');
  const offerRes:any = await fetch(`${API}/offers`, {
    method: 'POST',
    headers: { ...headers, Cookie: companyCookies! },
    body: JSON.stringify({
      title: 'Développeur Fullstack',
      location_id: location.data.location_id,
      job_type_id: null,
      remuneration_type_id: null,
      contract_type_id: null,
      duration_id: null,
      company_id: null, // handled server-side
      profile_description: 'Recherche dev passionné.',
      required_skills: ['Node.js', 'React'],
      application_deadline: '2025-12-01',
      activity_rate_min: '80%',
      activity_rate_max: '100%',
      contact_email: 'rh@company.com',
    }),
  }).then(res => res.json());

  const offerId = offerRes.data.offer_id;

  // 9. Link industry to offer
  console.log('🔗 Linking industry...');
  await fetch(`${API}/offers/${offerId}/industries`, {
    method: 'POST',
    headers: { ...headers, Cookie: companyCookies! },
    body: JSON.stringify({ industry_id: industry.data.industry_id }),
  });

  // 10. Apply to offer
  console.log('📩 Applying to offer...');
  await fetch(`${API}/offers/${offerId}/apply`, {
    method: 'POST',
    headers: { ...headers, Cookie: userCookies! },
    body: JSON.stringify({
      application_message: 'Je suis motivé !',
      documents: ['cv.pdf'],
    }),
  });

  // 11. Save offer
  console.log('⭐ Saving offer...');
  await fetch(`${API}/offers/${offerId}/save`, {
    method: 'POST',
    headers: { ...headers, Cookie: userCookies! },
  });

  console.log('✅ Test simulation finished.');
}

runSimulation().catch(console.error);
