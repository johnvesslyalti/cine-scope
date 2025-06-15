// lib/auth.ts
import { verifyToken } from './jwt';

interface JwtPayload {
  id: string;
  email: string;
}

export async function getUserFromRequest(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token) as JwtPayload;
    return {
      id: payload.id,
      email: payload.email,
    };
  } catch (err) {
    console.error('Token verification failed', err);
    return null;
  }
}
