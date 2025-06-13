'use client';

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import axios, { AxiosError } from "axios";
import { useState } from "react";

export default function Register() {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/auth/register", {
                name,
                email,
                password
            });
            setMessage("Registration Succesful");
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            const error = err as AxiosError;

            if (error.response?.status === 409) {
            setMessage("User already exists");
            } else {
            setMessage("Something went wrong");
            }
            setTimeout(() => setMessage(null), 3000);
            console.error(error.message);
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
                <CardTitle className="text-center text-xl">Register</CardTitle>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        required
                        />
                        </div>
                        <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        <Button type="submit" className="w-full mt-5 cursor-pointer">Submit</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}