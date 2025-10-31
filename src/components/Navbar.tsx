"use client";

import SearchInput from "./SearchInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/store/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Bookmark, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { RxCross1, RxHamburgerMenu } from "react-icons/rx";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, login, logout, isLoading } = useAuth();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleLogin = async () => {
    try {
      await login("google");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  // Close menus when clicking on links
  const handleLinkClick = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <>
      {/* Top Navbar */}
      <header className="w-full sticky top-0 z-30 bg-black/70 backdrop-blur-lg shadow-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:px-8 text-white">
          {/* Logo */}
          <Link href="/" onClick={handleLinkClick}>
            <div className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-sm hover:opacity-90 transition">
              🎬 Cine Scope
            </div>
          </Link>

          {/* Search Bar (desktop) */}
          <SearchInput className="hidden md:flex" />

          {/* User Info & Hamburger */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="hidden md:flex items-center gap-3 focus:outline-none hover:opacity-80 transition"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={user.image ?? ""}
                      alt={user.name ?? "User"}
                    />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden z-50"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-zinc-700">
                        <div className="text-sm font-medium text-white">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {user.email}
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          href="/watchlist"
                          className="flex items-center gap-3 px-4 py-2 text-white hover:bg-zinc-800 transition"
                          onClick={handleLinkClick}
                        >
                          <Bookmark className="w-4 h-4" />
                          Watchlist
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            handleLinkClick();
                          }}
                          disabled={isLoading}
                          className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-zinc-800 hover:text-red-500 transition disabled:opacity-50"
                        >
                          <LogOut className="w-4 h-4" />
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Logout"
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-1.5 text-sm rounded-lg shadow-md disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Login"
                )}
              </button>
            )}

            {/* Hamburger */}
            <button
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="text-2xl font-bold md:hidden focus:outline-none hover:text-cyan-400 transition"
              onClick={toggleMenu}
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
                  <AvatarImage
                    src={user.image ?? ""}
                    alt={user.name ?? "User"}
                  />
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
              {user ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link
                      href="/watchlist"
                      onClick={() => {
                        handleLinkClick();
                        toggleMenu();
                      }}
                      className="flex items-center gap-3 hover:text-cyan-400 transition"
                    >
                      <Bookmark className="w-5 h-5" />
                      Watchlist
                    </Link>
                  </motion.div>
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => {
                      handleLogout();
                      handleLinkClick();
                      toggleMenu();
                    }}
                    disabled={isLoading}
                    className="flex items-center gap-3 text-red-400 hover:text-red-500 transition text-xl disabled:opacity-50"
                  >
                    <LogOut className="w-5 h-5" />
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Logout"
                    )}
                  </motion.button>
                </>
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
                  className="text-cyan-400 hover:text-cyan-500 transition text-xl"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Login"
                  )}
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
