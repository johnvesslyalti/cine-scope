import connectDB from "@/lib/db";
import { NextResponse } from "next/server";
import User from "../../../../models/User";
import jwt from 'jsonwebtoken';

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        await connectDB();

        const user = await User.findOne({ email });

        if(!user) {
            return NextResponse.json({ message: "Invalid email or password"}, {status: 400});
        }

        const isMatch = await user.comparePassword(password);

        if(!isMatch) {
            return NextResponse.json({ message: "Invalid email or password"}, {status: 401});
        }

        const token = jwt.sign({userId: user._id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

        return NextResponse.json({
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        }, {status: 200})
    } catch(error) {
        return NextResponse.json({ message: "Something went wrong", error}, {status: 500});
    }
}