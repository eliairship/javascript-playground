import { serve } from '@hono/node-server';
import { logger } from 'hono/logger';
import { Hono } from 'hono';
import { authRoutes } from './routes/auth';
import 'dotenv/config';
import { protectedRoutes } from './routes/protected';
const app = new Hono();
app.use(logger());
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
app.route('/auth', authRoutes);
app.route('/protected', protectedRoutes);
app.get('/', (c) => {
    return c.text('Hello Hono!');
});
const port = 4000;
console.log(`Server is running on port ${port}`);
serve({
    fetch: app.fetch,
    port,
});
