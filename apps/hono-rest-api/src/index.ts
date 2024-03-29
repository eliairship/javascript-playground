import { serve } from '@hono/node-server';
import { logger } from 'hono/logger';
import { Hono } from 'hono';
import { authRoutes, lucia } from './routes/auth';
import 'dotenv/config';
import { getCookie } from 'hono/cookie';
import { Session, User } from 'lucia';
import { protectedRoutes } from './routes/protected';
import { jwtAuthRoutes } from './routes/jwt-auth';

export type HonoVariables = {
  userId: string | null;
};

const app = new Hono<{ Variables: HonoVariables }>();
app.use(logger());

// app.route('/auth', authRoutes);
app.route('/auth', jwtAuthRoutes);
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
