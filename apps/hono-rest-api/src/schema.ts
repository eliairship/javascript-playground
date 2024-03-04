// import { Client } from 'pg';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// import { env } from 'hono/adapter'

// console.log(env('DB_URL'));
// console.log(process.env.DB_URL);

// const pool = new pg.Pool({
//   connectionString: process.env.DB_URL,
// });
// export const db = drizzle(pool);
// const client = postgres(process.env.DB_URL ?? '');

// const client = new Client({
//   connectionString: process.env.DB_URL,
//   // connectionString: 'postgres://user:password@host:port/db',
// });
// export const db = drizzle(client);

const userTable = pgTable('user', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  hashed_password: text('hashed_password').notNull(),
});

const sessionTable = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});

export { userTable, sessionTable };
