"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = exports.protectedMiddleware = exports.lucia = void 0;
var hono_1 = require("hono");
var lucia_1 = require("lucia");
var adapter_drizzle_1 = require("@lucia-auth/adapter-drizzle");
var schema_1 = require("../schema");
var zod_validator_1 = require("@hono/zod-validator");
var zod_1 = require("zod");
var password_1 = require("oslo/password");
var db_1 = require("../db");
var drizzle_orm_1 = require("drizzle-orm");
var cookie_1 = require("hono/cookie");
var adapter = new adapter_drizzle_1.DrizzlePostgreSQLAdapter(db_1.db, schema_1.sessionTable, schema_1.userTable);
exports.lucia = new lucia_1.Lucia(adapter, {
    sessionCookie: {
        attributes: {
            // set to `true` when using HTTPS
            secure: process.env.NODE_ENV === 'production',
        },
    },
});
var protectedMiddleware = function (c, next) { return __awaiter(void 0, void 0, void 0, function () {
    var sessionId, _a, session, user, sessionCookie;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                sessionId = (0, cookie_1.getCookie)(c, exports.lucia.sessionCookieName);
                if (!sessionId) {
                    return [2 /*return*/, new Response(null, {
                            status: 401,
                        })];
                }
                return [4 /*yield*/, exports.lucia.validateSession(sessionId)];
            case 1:
                _a = _b.sent(), session = _a.session, user = _a.user;
                if (!session || !user) {
                    return [2 /*return*/, new Response(null, {
                            status: 401,
                        })];
                }
                if (session && session.fresh) {
                    sessionCookie = exports.lucia.createBlankSessionCookie();
                    c.res.headers.append('Set-Cookie', sessionCookie.serialize());
                }
                c.set('session', session);
                c.set('user', user);
                return [4 /*yield*/, next()];
            case 2:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.protectedMiddleware = protectedMiddleware;
var authRoutes = new hono_1.Hono();
exports.authRoutes = authRoutes;
authRoutes.post('/signup', (0, zod_validator_1.zValidator)('json', zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(5),
})), function (c) { return __awaiter(void 0, void 0, void 0, function () {
    var body, email, password, hashedPassword, userId, session, sessionCookie, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = c.req.valid('json');
                email = body.email, password = body.password;
                return [4 /*yield*/, new password_1.Argon2id().hash(password)];
            case 1:
                hashedPassword = _a.sent();
                userId = (0, lucia_1.generateId)(15);
                _a.label = 2;
            case 2:
                _a.trys.push([2, 6, , 7]);
                return [4 /*yield*/, db_1.db.insert(schema_1.userTable).values({
                        id: userId,
                        email: email,
                        hashed_password: hashedPassword,
                    })];
            case 3:
                _a.sent();
                return [4 /*yield*/, exports.lucia.createSession(userId, {})];
            case 4:
                session = _a.sent();
                sessionCookie = exports.lucia.createSessionCookie(session.id);
                // c.req.header.s.set("Set-Cookie", sessionCookie.serialize());
                return [4 /*yield*/, (0, cookie_1.setCookie)(c, sessionCookie.name, sessionCookie.serialize())];
            case 5:
                // c.req.header.s.set("Set-Cookie", sessionCookie.serialize());
                _a.sent();
                // await setCookie(c, sessionCookie.name, sessionCookie.value, {
                //   ...sessionCookie.attributes,
                //   sameSite: sessionCookie.attributes.sameSite?.toUpperCase as
                //     | 'Strict'
                //     | 'Lax'
                //     | 'None'
                //     | undefined,
                // });
                c.status(302);
                return [2 /*return*/, c.text('Success!')];
            case 6:
                err_1 = _a.sent();
                console.log(err_1);
                // db error, email taken, etc
                return [2 /*return*/, new Response('Invalid Email or Password', {
                        status: 400,
                    })];
            case 7: return [2 /*return*/];
        }
    });
}); });
authRoutes.post('/login', (0, zod_validator_1.zValidator)('json', zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(5),
})), function (c) { return __awaiter(void 0, void 0, void 0, function () {
    var body, email, password, users, user, validPassword, session, sessionCookie;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                body = c.req.valid('json');
                email = body.email, password = body.password;
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.userTable)
                        .where((0, drizzle_orm_1.eq)(schema_1.userTable.email, email))
                        .limit(1)];
            case 1:
                users = _b.sent();
                user = users[0];
                if (!user) {
                    // NOTE:
                    // Returning immediately allows malicious actors to figure out valid emails from response times,
                    // allowing them to only focus on guessing passwords in brute-force attacks.
                    // As a preventive measure, you may want to hash passwords even for invalid emails.
                    // However, valid emails can be already be revealed with the signup page
                    // and a similar timing issue can likely be found in password reset implementation.
                    // It will also be much more resource intensive.
                    // Since protecting against this is none-trivial,
                    // it is crucial your implementation is protected against brute-force attacks with login throttling etc.
                    // If emails/usernames are public, you may outright tell the user that the username is invalid.
                    return [2 /*return*/, new Response('Invalid email or password', {
                            status: 400,
                        })];
                }
                return [4 /*yield*/, new password_1.Argon2id().verify(user.hashed_password, password)];
            case 2:
                validPassword = _b.sent();
                if (!validPassword) {
                    return [2 /*return*/, new Response('Invalid email or password', {
                            status: 400,
                        })];
                }
                return [4 /*yield*/, exports.lucia.createSession(user.id, {})];
            case 3:
                session = _b.sent();
                sessionCookie = exports.lucia.createSessionCookie(session.id);
                return [4 /*yield*/, (0, cookie_1.setCookie)(c, sessionCookie.name, sessionCookie.value, __assign(__assign({}, sessionCookie.attributes), { sameSite: (_a = sessionCookie.attributes.sameSite) === null || _a === void 0 ? void 0 : _a.toUpperCase }))];
            case 4:
                _b.sent();
                c.status(302);
                return [2 /*return*/, c.text('Success!')];
        }
    });
}); });
authRoutes.post('/logout', exports.protectedMiddleware, function (c) { return __awaiter(void 0, void 0, void 0, function () {
    var session;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                session = c.get('session');
                return [4 /*yield*/, (0, cookie_1.deleteCookie)(c, exports.lucia.sessionCookieName)];
            case 1:
                _b.sent();
                // await setCookie(c, lucia.sessionCookieName, '')
                return [4 /*yield*/, exports.lucia.invalidateSession((_a = session === null || session === void 0 ? void 0 : session.id) !== null && _a !== void 0 ? _a : '')];
            case 2:
                // await setCookie(c, lucia.sessionCookieName, '')
                _b.sent();
                return [2 /*return*/, c.text('Logged out.')];
        }
    });
}); });
