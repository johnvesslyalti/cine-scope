"use client";

import SearchInput from "./SearchInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Bookmark, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { RxCross1, RxHamburgerMenu } from "react-icons/rx";

// ⭐ Better Auth client
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const router = useRouter();

  // pulls session + user directly from Better Auth
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user ?? null;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // ⭐ HYDRATION FIX — Prevent mismatched server/client HTML
  if (!mounted) {
    return (
      <header className="w-full sticky top-0 z-30 bg-black/70 backdrop-blur-lg shadow-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-3 md:px-8 text-white flex justify-between">
          <div className="text-2xl font-extrabold">🎬 Cine Scope</div>
          <div className="w-24 h-8 rounded bg-zinc-800 animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <>
      {/* Top Navbar */}
      <header className="w-full sticky top-0 z-30 bg-black/70 backdrop-blur-lg shadow-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:px-8 text-white">

          {/* Logo */}
          <Link href="/" onClick={handleLinkClick}>
            <div className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              🎬 Cine Scope
            </div>
          </Link>

          {/* Search Bar */}
          <SearchInput className="hidden md:flex" />

          {/* Right Side */}
          <div className="flex items-center gap-4">

            {/* Auth Area */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="hidden md:flex items-center gap-3 hover:opacity-80 transition"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.image ?? ""} alt={user.name ?? "User"} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl"
                    >
                      <div className="px-4 py-3 border-b border-zinc-700">
                        <div className="text-sm font-medium">{user.name}</div>
                        <div className="text-xs text-gray-400">{user.email}</div>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/watchlist"
                          onClick={handleLinkClick}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-zinc-800"
                        >
                          <Bookmark className="w-4 h-4" />
                          Watchlist
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-zinc-800"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                disabled={isPending}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-1.5 rounded-lg shadow-md"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
              </button>
            )}

            {/* Hamburger */}
            <button
              onClick={toggleMenu}
              className="text-2xl md:hidden hover:text-cyan-400"
            >
              {menuOpen ? <RxCross1 /> : <RxHamburgerMenu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="fixed inset-0 bg-black/95 text-white flex flex-col items-center justify-center gap-8 z-50"
          >
            <button className="absolute top-5 right-5 text-3xl" onClick={toggleMenu}>
              <RxCross1 />
            </button>

            {user && (
              <div className="flex flex-col items-center gap-3 mb-8">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <div className="text-lg font-semibold">{user.name}</div>
                  <div className="text-sm text-gray-400">{user.email}</div>
                </div>
              </div>
            )}

            <nav className="flex flex-col items-center gap-6 text-xl">
              {user ? (
                <>
                  <Link
                    href="/watchlist"
                    onClick={() => {
                      toggleMenu();
                      handleLinkClick();
                    }}
                    className="flex items-center gap-3 hover:text-cyan-400"
                  >
                    <Bookmark className="w-5 h-5" />
                    Watchlist
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="flex items-center gap-3 text-red-400 hover:text-red-500"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    handleLogin();
                    toggleMenu();
                  }}
                  className="text-cyan-400 hover:text-cyan-500"
                >
                  Login
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-5 md:hidden">
        <SearchInput />
      </div>
    </>
  );
}
