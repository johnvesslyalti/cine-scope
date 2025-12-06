import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
 baseURL: "https://johnvesslyalti-cinescope.vercel.app" // The base URL of your auth server
});