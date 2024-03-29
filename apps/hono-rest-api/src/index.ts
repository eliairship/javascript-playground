import { serve } from '@hono/node-server';
import { logger } from 'hono/logger';
import { Hono } from 'hono';
import { authRoutes } from './routes/auth';
import 'dotenv/config';
import { Session, User } from 'lucia';
import { protectedRoutes } from './routes/protected';
import { cors } from 'hono/cors';

export type HonoVariables = {
  session: Session | null;
  user: User | null;
};

const app = new Hono<{ Variables: HonoVariables }>();
app.use(logger());

app.use(
  '/auth/*',
  cors({
    origin(origin) {
      return origin;
    },
    credentials: true,
  })
);

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
