'use client';

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NotificationContainer } from "@/components/Notification";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <ThemeProvider>
          {children}
          <NotificationContainer />
        </ThemeProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
