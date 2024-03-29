import { Hono } from 'hono';

import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { Argon2id } from 'oslo/password';
import { db } from '../db';
import { userTable } from '../schema';
import { v4 as uuidv4 } from 'uuid';
import { generateAccessToken } from '../utils/auth-utils';
import { eq } from 'drizzle-orm';
import { HonoVariables } from '..';

const jwtAuthRoutes = new Hono<{ Variables: HonoVariables }>();

jwtAuthRoutes.post(
  '/signup',
  zValidator(
    'json',
    z.object({
      email: z.string().email(),
      password: z.string().min(5),
    })
  ),
  async (c) => {
    const body = c.req.valid('json');
    const { email, password } = body;
    const hashedPassword = await new Argon2id().hash(password);
    const userId = uuidv4();

    try {
      await db.insert(userTable).values({
        id: userId,
        email,
        hashed_password: hashedPassword,
      });

      const accessToken = await generateAccessToken(userId);

      c.status(200);
      return c.json({ accessToken });
    } catch (err) {
      console.log(err);

      // db error, email taken, etc
      return new Response('Invalid Email or Password', {
        status: 400,
      });
    }
  }
);

jwtAuthRoutes.post(
  '/signin',
  zValidator(
    'json',
    z.object({
      email: z.string().email(),
      password: z.string().min(5),
    })
  ),
  async (c) => {
    const body = c.req.valid('json');
    const { email, password } = body;
    try {
      const users = await db
        .select()
        .from(userTable)
        .where(eq(userTable.email, email))
        .limit(1);

      const user = users[0];

      if (!user) {
        return new Response('Invalid email or password', {
          status: 400,
        });
      }

      const validPassword = await new Argon2id().verify(
        user.hashed_password,
        password
      );

      if (!validPassword) {
        return new Response('Invalid email or password', {
          status: 400,
        });
      }

      const accessToken = await generateAccessToken(user.id);

      c.status(200);
      return c.json({ accessToken });
    } catch (err) {
      console.log(err);

      // db error, email taken, etc
      return new Response('Invalid Email or Password', {
        status: 400,
      });
    }
  }
);

export { jwtAuthRoutes };
