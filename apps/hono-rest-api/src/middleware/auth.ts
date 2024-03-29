import { MiddlewareHandler } from 'hono';
import { Variables } from 'hono/types';
import { verifyAccessToken } from '../utils/auth-utils';

export const jwtMiddleware: MiddlewareHandler<{
  Variables: Variables;
}> = async (c, next) => {
  const authToken = c.req.header('Authorization')?.split(' ')[1];

  if (authToken) {
    try {
      const token = await verifyAccessToken(authToken);
      if (token) {
        c.set('userId', token.sub);
        await next();
      }
    } catch (error) {
      return new Response(null, {
        status: 401,
      });
    }
  }
  return new Response(null, {
    status: 401,
  });
};
