import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { createInterface } from 'node:readline';
import { z } from 'zod';

async function main() {
  const envResult = dotenv.config({ path: '.env.local' });
  if (envResult.error && !('code' in envResult.error && envResult.error.code === 'ENOENT')) {
    throw envResult.error;
  }

  if (process.argv.length !== 3) {
    throw new Error('Usage : npm run auth:reset-password -- <UUID_SUPABASE_AUTH>');
  }

  const userId = z.string().uuid().safeParse(process.argv[2]);
  if (!userId.success) {
    throw new Error('Identifiant invalide : utiliser un UUID de Supabase Authentication > Users.');
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis.');
  }
  const consoleInput = createInterface({ input: process.stdin, output: process.stdout });
  const answers = consoleInput[Symbol.asyncIterator]();
  let password: string;
  try {
    console.log(`Compte Supabase Auth : ${userId.data}`);
    console.log('Attention : le mot de passe sera visible en clair dans le terminal.');
    process.stdout.write('Nouveau mot de passe : ');
    const passwordAnswer = await answers.next();
    if (passwordAnswer.done) {
      throw new Error('Saisie interrompue : aucun mot de passe modifie.');
    }
    password = passwordAnswer.value;
    if (password.length < 6) {
      throw new Error('Le mot de passe doit contenir au moins 6 caracteres.');
    }
    console.log(`Mot de passe choisi : ${password}`);
    process.stdout.write('Are you sure? Tapez yes pour confirmer : ');
    const confirmation = await answers.next();
    if (confirmation.done || confirmation.value.trim().toLowerCase() !== 'yes') {
      console.log('Operation annulee : aucun mot de passe modifie.');
      return;
    }
  } finally {
    consoleInput.close();
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const { data, error } = await supabase.auth.admin.updateUserById(userId.data, { password });
  if (error) {
    throw new Error(`Supabase : ${error.message}`);
  }
  if (!data.user || data.user.id !== userId.data) {
    throw new Error('Supabase ne confirme pas la mise a jour du compte demande.');
  }

  console.log('Mot de passe remplace.');
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Erreur inattendue lors de la reinitialisation.');
  process.exitCode = 1;
});
