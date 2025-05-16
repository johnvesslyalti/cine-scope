'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Page() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    return (
        <div className="h-screen flex justify-center items-center">
            <button
                onClick={() => router.back()}
                className="absolute flex justify-center text-lg gap-2 hover:text-gray-300 items-center top-5 left-5 cursor-pointer"
            >
                <IoIosArrowBack />
                <p>Back</p>
            </button>

            <Card className="min-w-100">
                <CardHeader className="text-3xl text-center">Sign Up</CardHeader>
                <CardContent>
                    <form className="flex flex-col gap-5">
                        <Input name="name" placeholder="Name" type="text" />
                        <Input name="email" placeholder="Email" type="text" />

                        <div className="relative">
                            <Input
                                name="password"
                                placeholder="Password"
                                type={showPassword ? "text" : "password"}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        <Button className="cursor-pointer">Submit</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
