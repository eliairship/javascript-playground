"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedRoutes = void 0;
var hono_1 = require("hono");
var auth_1 = require("./auth");
var protectedRoutes = new hono_1.Hono();
exports.protectedRoutes = protectedRoutes;
protectedRoutes.use(auth_1.protectedMiddleware);
protectedRoutes.get('/', function (c) {
    var session = c.get('session');
    var user = c.get('user');
    return c.json({ message: 'Secret Value!', session: session, user: user });
});
