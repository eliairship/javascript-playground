import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

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
