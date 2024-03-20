// import 'dotenv/config';
// import { drizzle } from 'drizzle-orm/sqlite-core';
// import { migrate } from 'drizzle-orm/postgres-js/migrator';
// import postgres from 'postgres';
// const sql = postgres(process.env.MIGRATION_DB_URL ?? '', { max: 1 });
// const db = drizzle(sql);
// await migrate(db, { migrationsFolder: 'drizzle' });
// await sql.end();
// Don't forget to close the connection, otherwise the script will hang
// await client.end();
import 'dotenv/config';
import { resolve } from 'node:path';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { db } from './db';
(async () => {
    await migrate(db, { migrationsFolder: resolve(__dirname, '../drizzle') });
})();
