"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionTable = exports.userTable = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var userTable = (0, pg_core_1.pgTable)('user', {
    id: (0, pg_core_1.text)('id').primaryKey(),
    email: (0, pg_core_1.text)('email').unique().notNull(),
    hashed_password: (0, pg_core_1.text)('hashed_password').notNull(),
});
exports.userTable = userTable;
var sessionTable = (0, pg_core_1.pgTable)('session', {
    id: (0, pg_core_1.text)('id').primaryKey(),
    userId: (0, pg_core_1.text)('user_id')
        .notNull()
        .references(function () { return userTable.id; }),
    expiresAt: (0, pg_core_1.timestamp)('expires_at', {
        withTimezone: true,
        mode: 'date',
    }).notNull(),
});
exports.sessionTable = sessionTable;
