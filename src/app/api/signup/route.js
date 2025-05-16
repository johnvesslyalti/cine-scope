import connectDB from "@/lib/db";
import User from "../../../../models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const {name, email, password} = await req.json();

        await connectDB();

        const existUser = await User.findOne({ email });
        if(existUser) {
            return NextResponse.json({ message: "User already exists"}, {status: 400})
        }

        const newUser = await User.create({
            name: name,
            email: email,
            password: password
        });

        return NextResponse.json({ message: "User Registered successfully"});
    } catch(error) {
        return NextResponse.json({ message: "Error registering user", error}, { status: 500});
    }
}