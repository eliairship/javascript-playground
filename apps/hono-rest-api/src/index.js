"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_server_1 = require("@hono/node-server");
var logger_1 = require("hono/logger");
var hono_1 = require("hono");
var auth_1 = require("./routes/auth");
require("dotenv/config");
var protected_1 = require("./routes/protected");
var app = new hono_1.Hono();
app.use((0, logger_1.logger)());
// app.use(async (c, next) => {
//   const sessionId = getCookie(c, lucia.sessionCookieName);
//   if (!sessionId) {
//     return new Response(null, {
//       status: 401,
//     });
//   }
//   const { session, user } = await lucia.validateSession(sessionId);
//   if (session && session.fresh) {
//     // set session cookie
//     const sessionCookie = lucia.createBlankSessionCookie();
//     c.res.headers.append('Set-Cookie', sessionCookie.serialize());
//   }
//   c.set('session', session);
//   c.set('user', user);
//   await next();
// });
app.route('/auth', auth_1.authRoutes);
app.route('/protected', protected_1.protectedRoutes);
app.get('/', function (c) {
    return c.text('Hello Hono!');
});
var port = 4000;
console.log("Server is running on port ".concat(port));
(0, node_server_1.serve)({
    fetch: app.fetch,
    port: port,
});
