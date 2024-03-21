import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const sql = postgres(process.env.MIGRATION_DB_URL ?? '', { max: 1 });
const db = drizzle(sql);
migrate(db, { migrationsFolder: 'drizzle' });
sql.end();
// Don't forget to close the connection, otherwise the script will hang
// await client.end();
