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
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

  try {
     const response = await fetch(`api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const text = await response.text(); // first, get raw text
    console.log("Raw response:", text);

    const data = JSON.parse(text); // then parse JSON manually
    console.log("Parsed JSON:", data);
    setName('');
    setEmail('');
    setPassword('');
  } catch (error) {
    console.error("Signup error:", error);
  }
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
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <Input name="name" onChange={(e) => setName(e.target.value)} value={name} placeholder="Name" type="text" />
                        <Input name="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Email" type="text" />

                        <div className="relative">
                            <Input
                                name="password"
                                placeholder="Password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
