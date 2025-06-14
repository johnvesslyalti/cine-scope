// lib/auth.ts
import { verifyToken } from './jwt'; // use your own verifyToken function

export async function getUserFromRequest(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);
    // assuming your payload contains id and email
    return {
      id: (payload as any).id,
      email: (payload as any).email,
    };
  } catch (err) {
    console.error('Token verification failed', err);
    return null;
  }
}
