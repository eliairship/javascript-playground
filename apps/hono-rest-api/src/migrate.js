"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var postgres_js_1 = require("drizzle-orm/postgres-js");
var migrator_1 = require("drizzle-orm/postgres-js/migrator");
var postgres_1 = require("postgres");
var sql = (0, postgres_1.default)((_a = process.env.MIGRATION_DB_URL) !== null && _a !== void 0 ? _a : '', { max: 1 });
var db = (0, postgres_js_1.drizzle)(sql);
(0, migrator_1.migrate)(db, { migrationsFolder: 'drizzle' });
sql.end();
// Don't forget to close the connection, otherwise the script will hang
// await client.end();
