'use client';

import { useAuthSync, useAuth } from '@/store/useAuth';
import { useSession } from 'next-auth/react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { user } = useAuth();
  
  // Debug logging
  console.log('AuthProvider - Session status:', status);
  console.log('AuthProvider - Session data:', session);
  console.log('AuthProvider - Zustand user:', user);
  
  useAuthSync();
  return <>{children}</>;
}
