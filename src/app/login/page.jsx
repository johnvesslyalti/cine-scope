'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";

export default function Page() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add login logic here
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
      <Card className="min-w-[400px]">
        <CardHeader className="text-3xl text-center">Login</CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              name="email"
              placeholder="Email"
              type="text"
              autoComplete="email"
            />
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
            <Button type="submit" className="cursor-pointer">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
