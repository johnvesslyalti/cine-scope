'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/store/useAuth";
import { RxCross1, RxHamburgerMenu } from "react-icons/rx";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { navLinks } from "@/constants/NavLinks";
import SearchInput from "./SearchInput";
import { motion, AnimatePresence } from "framer-motion";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, login, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const toggleMenu = () => setMenuOpen(prev => !prev);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleLogin = async () => {
    try {
      await login("google"); // directly start Google login
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const filteredLinks = navLinks.filter(link => {
    if (user && link.guestOnly) return false;
    if (!user && link.authRequired) return false;
    return true;
  });

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts.map(p => p[0]).slice(0, 2).join("").toUpperCase();
  };

  return (
    <>
      {/* Top Navbar */}
      <header className="w-full sticky top-0 z-30 bg-black/70 backdrop-blur-lg shadow-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:px-8 text-white">
          {/* Logo */}
          <Link href="/">
            <div className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-sm hover:opacity-90 transition">
              🎬 Cine Scope
            </div>
          </Link>

          {/* Search Bar (desktop) */}
          <SearchInput className="hidden md:flex" />

          {/* User Info & Hamburger */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-gray-400">{user.email}</div>
                </div>
                <Avatar>
                  <AvatarImage src={user.image ?? ""} alt={user.name ?? "User"} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </div>
            )}

            {/* Hamburger */}
            <button
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="text-2xl font-bold md:hidden focus:outline-none hover:text-cyan-400 transition"
              onClick={toggleMenu}
            >
              {menuOpen ? <RxCross1 /> : <RxHamburgerMenu />}
            </button>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex space-x-6 text-base items-center">
              {filteredLinks.map(link => (
                <Link key={link.label} href={link.path}>
                  <span className="relative group cursor-pointer">
                    {link.label}
                    <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-cyan-400 group-hover:w-full transition-all duration-300" />
                  </span>
                </Link>
              ))}

              {/* Auth Button */}
              {user ? (
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-1.5 text-sm rounded-lg shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Logout"}
                </button>
              ) : (
                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-1.5 text-sm rounded-lg shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
                </button>
              )}
            </nav>
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
            {/* Close */}
            <button
              aria-label="Close menu"
              onClick={toggleMenu}
              className="absolute top-5 right-5 text-3xl text-gray-300 hover:text-white transition"
            >
              <RxCross1 />
            </button>

            {/* User Info (mobile) */}
            {user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-3 mb-8"
              >
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user.image ?? ""} alt={user.name ?? "User"} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <div className="text-lg font-semibold">{user.name}</div>
                  <div className="text-sm text-gray-400">{user.email}</div>
                </div>
              </motion.div>
            )}

            {/* Menu Links */}
            <motion.nav
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } },
              }}
              className="flex flex-col items-center gap-6 text-xl"
            >
              {filteredLinks.map(link => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href={link.path} onClick={toggleMenu}>
                    <span className="hover:text-cyan-400 transition">{link.label}</span>
                  </Link>
                </motion.div>
              ))}
              {user ? (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  disabled={isLoading}
                  className="text-red-400 hover:text-red-500 transition text-xl disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Logout"}
                </motion.button>
              ) : (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => {
                    handleLogin();
                    toggleMenu();
                  }}
                  disabled={isLoading}
                  className="text-cyan-400 hover:text-cyan-500 transition text-xl disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login"}
                </motion.button>
              )}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search (mobile) */}
      <div className="p-5 md:hidden">
        <SearchInput />
      </div>
    </>
  );
}
