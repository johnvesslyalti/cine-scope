import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
 baseURL: "https://johnvesslyalti-cinescope.vercel.app/api/auth"
 //baseURL: "http://localhost:3000"
});