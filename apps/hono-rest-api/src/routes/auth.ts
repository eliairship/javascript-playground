import { Hono, MiddlewareHandler } from 'hono';
import { Lucia, generateId } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { sessionTable, userTable } from '../schema';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { Argon2id } from 'oslo/password';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { HonoVariables } from '..';
import { Variables } from 'hono/types';

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === 'production',
    },
  },
});

// IMPORTANT!
declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
  }
}

export const protectedMiddleware: MiddlewareHandler<{
  Variables: Variables;
}> = async (c, next) => {
  const sessionId = getCookie(c, lucia.sessionCookieName);
  if (!sessionId) {
    return new Response(null, {
      status: 401,
    });
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (!session || !user) {
    return new Response(null, {
      status: 401,
    });
  }
  if (session && session.fresh) {
    // set session cookie
    const sessionCookie = lucia.createBlankSessionCookie();
    c.res.headers.append('Set-Cookie', sessionCookie.serialize());
  }

  c.set('session', session);
  c.set('user', user);

  await next();
};

const authRoutes = new Hono<{ Variables: HonoVariables }>();
authRoutes.post(
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
    const userId = generateId(15);

    try {
      await db.insert(userTable).values({
        id: userId,
        email,
        hashed_password: hashedPassword,
      });

      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      // c.req.header.s.set("Set-Cookie", sessionCookie.serialize());
      await setCookie(c, sessionCookie.name, sessionCookie.serialize());

      // await setCookie(c, sessionCookie.name, sessionCookie.value, {
      //   ...sessionCookie.attributes,
      //   sameSite: sessionCookie.attributes.sameSite?.toUpperCase as
      //     | 'Strict'
      //     | 'Lax'
      //     | 'None'
      //     | undefined,
      // });
      c.status(302);
      return c.text('Success!');
    } catch (err) {
      console.log(err);

      // db error, email taken, etc
      return new Response('Invalid Email or Password', {
        status: 400,
      });
    }
  }
);

authRoutes.post(
  '/login',
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
    const users = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1);

    const user = users[0];

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

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    await setCookie(c, sessionCookie.name, sessionCookie.value, {
      ...sessionCookie.attributes,
      sameSite: sessionCookie.attributes.sameSite?.toUpperCase as
        | 'Strict'
        | 'Lax'
        | 'None'
        | undefined,
    });
    c.status(302);
    return c.text('Success!');
  }
);
authRoutes.post('/logout', protectedMiddleware, async (c) => {
  const session = c.get('session');
  await deleteCookie(c, lucia.sessionCookieName);
  // await setCookie(c, lucia.sessionCookieName, '')
  await lucia.invalidateSession(session?.id ?? '');
  return c.text('Logged out.');
});

export { authRoutes };
