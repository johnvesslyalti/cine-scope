import { signToken } from "@/lib/jwt";
import { loginSchema } from "@/validation/auth.schema";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({ error: "Invalid data"}, { status: 400 });
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
        where: {email},
    })

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const token = signToken({ id: user.id, email: user.email });

    return NextResponse.json({
        user: { id: user.id, email: user.email, name: user.name },
        token,
    })
}