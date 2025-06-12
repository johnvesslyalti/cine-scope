import { registerSchema } from "@/validation/auth.schema";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function Post(req: Request) {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({
            error: "Invalid request",
            issues: parsed.error.issues,
        }, { status: 400 });
    }

    const { email, password, name } = parsed.data;

    const existingUser = await prisma.user.findUnique({
        where: {email},
    })
    if (existingUser) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            email,
            password: hashed,
            name: name ?? "default name",
        }
    })
}