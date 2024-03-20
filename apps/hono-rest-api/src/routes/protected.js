import { Hono } from 'hono';
import { protectedMiddleware } from './auth';
const protectedRoutes = new Hono();
protectedRoutes.use(protectedMiddleware);
protectedRoutes.get('/', (c) => {
    const session = c.get('session');
    const user = c.get('user');
    return c.json({ message: 'Secret Value!', session, user });
});
export { protectedRoutes };
