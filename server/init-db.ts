import fs from 'fs';
import path from 'path';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

async function runInit() {
  console.log('----------------------------------------------------');
  console.log('🐘 3-Tier Expense Manager - Database Initializer');
  console.log('----------------------------------------------------');

  const connectionString = process.env.DATABASE_URL;
  const host = process.env.PGHOST || 'localhost';
  const port = parseInt(process.env.PGPORT || '5432', 10);
  const user = process.env.PGUSER || 'postgres';
  const password = process.env.PGPASSWORD || 'postgres';
  const database = process.env.PGDATABASE || 'expense_db';

  console.log(`Connecting to PostgreSQL at ${host}:${port}/${database} (User: ${user})...`);

  const pool = new Pool({
    connectionString: connectionString || undefined,
    host,
    port,
    user,
    password,
    database,
    connectionTimeoutMillis: 5000,
  });

  try {
    const client = await pool.connect();
    console.log('✓ Successfully connected to PostgreSQL instance.');

    // 1. Run schema.sql
    const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log(`Reading SQL Schema from: ${schemaPath}`);
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      console.log('Executing DDL statements (Creating tables, indexes, triggers)...');
      await client.query(schemaSql);
      console.log('✓ Schema and indexes initialized successfully.');
    } else {
      console.warn(`! Schema file not found at ${schemaPath}`);
    }

    // 2. Check if seeding is needed
    const countRes = await client.query('SELECT COUNT(*) FROM expenses');
    const rowCount = parseInt(countRes.rows[0].count, 10);
    console.log(`Current expense rows in database: ${rowCount}`);

    if (rowCount === 0) {
      const seedPath = path.join(process.cwd(), 'database', 'seed.sql');
      if (fs.existsSync(seedPath)) {
        console.log(`Seeding initial realistic data from: ${seedPath}`);
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        await client.query(seedSql);
        console.log('✓ Seed data inserted successfully.');
      }
    }

    const finalRes = await client.query('SELECT COUNT(*) FROM expenses');
    console.log(`✓ Total expenses now in database: ${finalRes.rows[0].count}`);

    client.release();
    await pool.end();
    console.log('----------------------------------------------------');
    console.log('🎉 Database initialization complete. Ready to run "npm run dev".');
    console.log('----------------------------------------------------');
    process.exit(0);
  } catch (err: any) {
    console.error('----------------------------------------------------');
    console.error('❌ Failed to connect to PostgreSQL:');
    console.error(err.message);
    console.error('----------------------------------------------------');
    console.error('Troubleshooting Tips:');
    console.error('1. Make sure PostgreSQL service is running on your machine (e.g. `brew services start postgresql` or `sudo service postgresql start`)');
    console.error(`2. Ensure the database "${database}" exists: run \`createdb ${database}\` or \`psql -U ${user} -c "CREATE DATABASE ${database};"\``);
    console.error('3. Check your .env credentials (PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE)');
    console.error('----------------------------------------------------');
    process.exit(1);
  }
}

runInit();
