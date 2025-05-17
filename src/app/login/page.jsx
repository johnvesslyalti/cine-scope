'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { useAuth } from "../../../context/authContext";
import CustomAlert from "../../../components/CustomAlert";

export default function Page() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if(!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      login(data.user, data.token);
      setEmail('');
      setPassword('');
      setMessage("Login Successfull");
      setLoading(true);
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch(error) {
      console.error("Signup error", error);
      setLoading(false);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center relative">
      {message && <CustomAlert message={message}/>}
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
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
                            <Input
                                name="password"
                                placeholder="Password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
            <Button type="submit" className="cursor-pointer" disabled={loading}>
              {loading ? "Logging in..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
