'use client';

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/store/useAuth";
import axios from "axios";
import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [message, setMessage] = useState<String>("");
    const { setUser } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post("api/auth/login", {
                email,
                password
            })
            const { user, token } = response.data;
            setUser(user, token);
            setMessage("Login Successfull")
        } catch (error: any) {
            console.error(error?.response?.data?.message || "Login failed");
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center">
            {message && (
                <Alert className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm rounded-xl border shadow-lg transition-all duration-300 animate-bounce">
                    {message}
                </Alert>
            )}
            <Card className="w-full max-w-[300px] md:max-w-sm">
                <CardTitle className="text-center text-xl">Login</CardTitle>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        required
                        />
                        </div>
                        <div className="grid gap-2">
                        <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        </div>
                        <Input 
                        id="password" 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required />
                        </div>
                        </div>
                        <Button className="w-full mt-5 cursor-pointer">Submit</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}