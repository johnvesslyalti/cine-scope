import { cookies } from "next/headers";
import { verifyToken } from "./jwt";
import { prisma } from "./prisma";

export async function getUserFromToken(req?: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = verifyToken(token) as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    return user;
  } catch (err: any) {
    console.error("Token verification failed", err);
    return null;
  }
}
