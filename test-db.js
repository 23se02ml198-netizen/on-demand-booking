import db, { testConnection } from './database.js';

console.log('='.repeat(50));
console.log('  ApexServices SQLite Database Connection Test');
console.log('='.repeat(50));

const status = testConnection();

if (status.connected) {
  console.log(' Status:          CONNECTED');
  console.log(` Database Type:   ${status.database}`);
  console.log(` SQLite Version:  ${status.version}`);
  console.log(` Database File:   ${status.path}`);
  console.log(` Total Tables:    ${status.tables.length}`);
  console.log(' Available Tables:');

  status.tables.forEach((tableName) => {
    try {
      const count = db.prepare(`SELECT COUNT(*) as count FROM "${tableName}"`).get().count;
      console.log(`   - ${tableName.padEnd(20)} (${count} records)`);
    } catch (err) {
      console.log(`   - ${tableName.padEnd(20)} (error: ${err.message})`);
    }
  });

  console.log('='.repeat(50));
  console.log('Database connection is working successfully!');
  console.log('='.repeat(50));
} else {
  console.error(' Status: FAILED');
  console.error(' Error:', status.error);
  process.exit(1);
}
