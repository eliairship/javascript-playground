import { Hono } from 'hono';
import { HonoVariables } from '..';
import { jwtMiddleware } from '../middleware/auth';
import { db } from '../db';

const protectedRoutes = new Hono<{ Variables: HonoVariables }>();
protectedRoutes.use(jwtMiddleware);
protectedRoutes.get('/', async (c) => {
  const userId = c.get('userId');
  if (userId) {
    const user = await db.query.userTable.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
      columns: {
        hashed_password: false,
      },
    });
    return c.json({ message: 'Secret Value!', user });
  }
  return new Response(null, {
    status: 401,
  });
});

export { protectedRoutes };
