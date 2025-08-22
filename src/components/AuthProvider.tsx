'use client';

import { useAuthSync } from '@/store/useAuth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useAuthSync();
  return <>{children}</>;
}
