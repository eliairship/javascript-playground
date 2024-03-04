import 'dotenv/config';

import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import postgres from 'postgres';

console.log(process.env.DB_URL);

export const client = postgres(process.env.DB_URL ?? '');

export const db = drizzle(client, { schema });
