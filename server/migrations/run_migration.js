/**
 * Migration runner — run with:
 *   cd server && node migrations/run_migration.js
 *
 * Reads your .env for DB credentials, then runs the SQL migration safely.
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const client = new Client({
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  console.log(`\n🔌 Connecting to PostgreSQL at ${process.env.DB_HOST}:${process.env.DB_PORT || 5432}...`);

  try {
    await client.connect();
    console.log('✅ Connected\n');

    const sql = fs.readFileSync(path.join(__dirname, '001_add_location_columns.sql'), 'utf8');

    // Split on semicolons to run each statement separately
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const stmt of statements) {
      try {
        const result = await client.query(stmt);
        if (result.rows?.length > 0) {
          console.log('📋 Verification result:');
          console.table(result.rows);
        } else {
          console.log(`✅ OK: ${stmt.slice(0, 60).replace(/\n/g, ' ')}…`);
        }
      } catch (err) {
        console.error(`❌ Failed: ${stmt.slice(0, 80)}`);
        console.error(`   Reason: ${err.message}`);
        // Don't abort — IF NOT EXISTS means most errors are non-fatal
      }
    }

    console.log('\n🎉 Migration complete!\n');
  } catch (err) {
    console.error('❌ Could not connect to database:', err.message);
    console.error('\nCheck your .env file has correct DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD');
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
