'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState<string | "">("");
    const [password, setPassword] = useState<string | "">("");

    const handleSubmit = async () => {
        try {
            const response = await axios.post()
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center">
            <Card className="w-full max-w-[300px] md:max-w-sm">
                <CardTitle className="text-center text-xl">Login</CardTitle>
                <CardContent>
                    <form>
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
                        <Button className="w-full mt-5">Submit</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}