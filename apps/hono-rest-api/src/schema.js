import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
const userTable = sqliteTable('user', {
    id: text('id').primaryKey(),
    email: text('email').unique().notNull(),
    hashed_password: text('hashed_password').notNull(),
});
const sessionTable = sqliteTable('session', {
    id: text('id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => userTable.id),
    expiresAt: integer('expires_at').notNull(),
});
export { userTable, sessionTable };
