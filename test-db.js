import db, { testConnection, isPostgres } from './database.js';

console.log('='.repeat(50));
console.log(`  ApexServices ${isPostgres ? 'PostgreSQL' : 'SQLite'} Database Connection Test`);
console.log('='.repeat(50));

async function run() {
  const status = await testConnection();

  if (status.connected) {
    console.log(' Status:          CONNECTED');
    console.log(` Database Type:   ${status.database}`);
    console.log(` Version:         ${status.version}`);
    console.log(` Database Target: ${status.path}`);
    console.log(` Total Tables:    ${status.tables.length}`);
    console.log(' Available Tables:');

    for (const tableName of status.tables) {
      try {
        const countRes = await db.prepare(`SELECT COUNT(*) as count FROM "${tableName}"`).get();
        console.log(`   - ${tableName.padEnd(20)} (${countRes?.count ?? 0} records)`);
      } catch (err) {
        console.log(`   - ${tableName.padEnd(20)} (error: ${err.message})`);
      }
    }

    console.log('='.repeat(50));
    console.log('Database connection is working successfully!');
    console.log('='.repeat(50));
  } else {
    console.error(' Status: FAILED');
    console.error(' Error:', status.error);
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
