'use client';

import { useState } from "react";
import { useAuth } from "@/store/useAuth";
import { RxCross1, RxHamburgerMenu } from "react-icons/rx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { navLinks } from "@/constants/NavLinks";
import { Button } from "./ui/button";
import SearchInput from "./SearchInput";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const toggleMenu = () => setMenuOpen(prev => !prev);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const filteredLinks = navLinks.filter(link => {
    if (user && link.guestOnly) return false;
    if (!user && link.authRequired) return false;
    return true;
  });

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

          {/* Hamburger Icon */}
          <button
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
            {user && (
              <Button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-1.5 text-sm rounded-lg shadow-md"
              >
                Logout
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 bg-black/95 text-white flex flex-col items-center justify-center gap-8 z-50"
          >
            {/* Close button */}
            <button
              onClick={toggleMenu}
              className="absolute top-5 right-5 text-3xl text-gray-300 hover:text-white transition"
            >
              <RxCross1 />
            </button>

            {/* Menu links */}
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
                    <span className="hover:text-cyan-400 transition">
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
              {user && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="text-red-400 hover:text-red-500 transition text-xl"
                >
                  Logout
                </motion.button>
              )}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Bar (mobile) */}
      <div className="p-5 md:hidden">
        <SearchInput />
      </div>
    </>
  );
}
