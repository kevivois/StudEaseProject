import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  '',
  ''
);

// 📦 Types
type Location = { country: string; region: string; city: string };
type Duration = { label: string; flexible: boolean };

// 🧠 Données statiques
const jobTypes: string[] = ['Job étudiant', 'Stage', 'Mandat', 'Proposition de TB ou TM'];

const locations: Location[] = [
  { country: 'Suisse', region: 'Vaud', city: 'Lausanne' },
  { country: 'Suisse', region: 'Genève', city: 'Genève' },
  { country: 'Suisse', region: 'Berne', city: 'Berne' }
];

const remunerationTypes: string[] = [
  'Rémunéré (horaire)', 'Rémunéré (mensuel)', 'À la tâche', 'Non-rémunéré (bénévolat)'
];

const engagementDurations: Duration[] = [
  { label: '< 1 mois', flexible: false },
  { label: '2 – 12 mois', flexible: false },
  { label: '> 1 an', flexible: false },
  { label: 'À tâche/mission', flexible: true }
];

const industries: string[] = [
  'Architecture', 'Informatique', 'Marketing / Communication',
  'Médecine / Santé', 'Restauration / Service', 'Ingénierie', 'Tourisme'
];

const contractTypes: string[] = ['CDD', 'CDI', 'Indépendant', 'À la tâche/mission'];

const companyTypes: string[] = ['Start-up', 'PME', 'Grande entreprise', 'Association', 'Agence', 'Institution fédérale'];

// 🔁 Fonction utilitaire d'insertion
async function insertArray<T>(table: string, data: T[], mapFn?: (item: T) => object) {
  for (const entry of data) {
    const values = mapFn ? mapFn(entry) : entry;
    const { error } = await supabase.from(table).insert([values]);
    if (error) {
      console.error(`❌ ${table}:`, error.message);
    } else {
      console.log(`✅ ${table} →`, JSON.stringify(values));
    }
  }
}

// 🌟 Insertion principale
async function main() {
  console.log('🚀 Insertion des données statiques...');

  await insertArray('job_types', jobTypes, name => ({ job_type_name: name }));
  await insertArray('locations', locations);
  await insertArray('remuneration_types', remunerationTypes, name => ({ remuneration_type_name: name }));
  await insertArray('engagement_durations', engagementDurations, d => ({
    duration_label: d.label,
    is_flexible: d.flexible
  }));
  await insertArray('industries', industries, name => ({ industry_name: name }));
  await insertArray('contract_types', contractTypes, name => ({ contract_type_name: name }));
  await insertArray('company_types', companyTypes, label => ({ label }));

  console.log('✨ Données statiques insérées.');

  const { data: location } = await supabase.from('locations').select('location_id').limit(1).maybeSingle();
  const { data: companyType } = await supabase.from('company_types').select('company_type_id').limit(1).maybeSingle();

  const dummyUserAuthUserId = '65a4f401-45e5-4bd1-aaed-0a6175612f63';
  const dummyCompanyAuthUserId = 'ee79b6fa-5bcd-49a7-bf73-3c9391512d2e'; 
  /*
  // 👤 User
  const { data: user, error: userError } = await supabase.from('users').insert([{
    auth_user_id: dummyUserAuthUserId,
    first_name: 'Jane',
    last_name: 'Doe',
    email: 'jane@demo.com',
    phone_number: '+41791234567',
    location_id: location?.location_id,
    profile_description: 'Étudiante en marketing digital',
    skills: ['communication', 'SEO', 'gestion de projet'],
    availability_start: new Date(),
    availability_end: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
  }]).select('*').maybeSingle();

  if (userError) {
    console.error('❌ Utilisateur:', userError.message);
  } else {
    console.log('👩‍🎓 Utilisateur créé:', user?.email);
  }

  // 🏢 Company
  const { error: companyError } = await supabase.from('companies').insert([{
    auth_user_id: dummyCompanyAuthUserId,
    email: 'contact@faketech.ch',
    company_name: 'FakeTech SA',
    company_logo_url: 'https://placehold.co/100x100',
    company_type_id: companyType?.company_type_id,
    company_address: 'Rue de l’Innovation 42, 1000 Lausanne',
    company_phone: '+41223456789',
    company_website: 'https://faketech.ch',
    company_description: 'Entreprise fictive dans le domaine de la tech éducative.'
  }]);

  if (companyError) {
    console.error('❌ Entreprise:', companyError.message);
  } else {
    console.log('🏢 Entreprise créée: FakeTech SA');
  }
  */
  console.log('✅ Script terminé.');
}

main();
