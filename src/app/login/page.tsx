'use client';

import { useAuth } from '@/store/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FaGoogle, FaFilm } from 'react-icons/fa';
import Link from 'next/link';

export default function LoginPage() {
  const { user, login, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleGoogleLogin = async () => {
    await login('google');
  };

  if (user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FaFilm className="text-6xl text-cyan-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to Cine Scope</h1>
          <p className="text-gray-400">Sign in to manage your movie watchlist</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="space-y-6">
            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaGoogle className="text-xl" />
              {isLoading ? 'Signing in...' : 'Continue with Google'}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-400">or</span>
              </div>
            </div>

            {/* Guest Access */}
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-4">
                Want to explore without signing in?
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all duration-200 border border-white/20"
              >
                Browse as Guest
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            By signing in, you agree to our{' '}
            <Link href="#" className="text-cyan-400 hover:text-cyan-300">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" className="text-cyan-400 hover:text-cyan-300">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
