import 'dotenv/config';
import jwt from 'jsonwebtoken';

interface JWTPayload {
  sub: string;
}

const secretKey = process.env.AUTH_SECRET ?? 'some-random-key';

export async function generateAccessToken(userId: string): Promise<string> {
  const payload: JWTPayload = { sub: userId };
  return jwt.sign(payload, secretKey, {
    expiresIn: 1200,
  });
}

export async function verifyAccessToken(
  accessToken: string
): Promise<string | JWTPayload> {
  return jwt.verify(accessToken, secretKey) as string | JWTPayload;
}
