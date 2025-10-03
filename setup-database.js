import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration Supabase
const supabaseUrl = 'https://ixsqqmqipnekmkfgicvq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4c3FxbXFpcG5la21rZmdpY3ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzOTkwMDIsImV4cCI6MjA3NDk3NTAwMn0.CgtFxX3_LiES3XZxD5ey6bBmTQQ0TyTmu6e7gRKR80M';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('🚀 Configuration de la base de données FlashAfrique...\n');

  try {
    // Lire le fichier SQL
    const sqlContent = fs.readFileSync(path.join(__dirname, 'supabase-complete.sql'), 'utf8');
    
    // Diviser le SQL en commandes individuelles
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd && !cmd.startsWith('--') && cmd !== 'NOTIFY pgrst, \'reload schema\'');

    console.log(`📝 ${commands.length} commandes SQL à exécuter...\n`);

    // Exécuter chaque commande via l'API RPC
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (!command) continue;

      console.log(`⏳ Exécution de la commande ${i + 1}/${commands.length}...`);
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: command });
        
        if (error) {
          // Essayer avec l'API REST directement
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`
            },
            body: JSON.stringify({ sql_query: command })
          });

          if (!response.ok) {
            console.log(`⚠️  Commande échouée (sera exécutée manuellement): ${command.substring(0, 50)}...`);
            continue;
          }
        }
        
        console.log(`✅ Commande ${i + 1} exécutée avec succès`);
      } catch (err) {
        console.log(`⚠️  Erreur: ${err.message}`);
      }
    }

    console.log('\n🎉 Configuration terminée !');
    console.log('\n📋 Prochaines étapes:');
    console.log('1. Vérifiez que la table "articles" existe dans votre dashboard Supabase');
    console.log('2. Allez sur: https://supabase.com/dashboard/project/ixsqqmqipnekmkfgicvq/editor');
    console.log('3. Si la table n\'apparaît pas, exécutez manuellement le contenu de supabase-complete.sql dans le SQL Editor');

  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error);
    console.log('\n💡 Solution alternative:');
    console.log('1. Allez sur https://supabase.com/dashboard/project/ixsqqmqipnekmkfgicvq/sql/new');
    console.log('2. Copiez le contenu de supabase-complete.sql');
    console.log('3. Collez-le dans l\'éditeur SQL et cliquez sur "Run"');
  }
}

setupDatabase();
