// import 'dotenv/config';
// import { drizzle } from 'drizzle-orm/postgres-js';
// import * as schema from './schema';
// import postgres from 'postgres';
// export const client = postgres(process.env.DB_URL ?? '');
// export const db = drizzle(client, { schema });
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
const client = createClient({
    url: process.env.TURSO_CONNECTION_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});
export const db = drizzle(client);
