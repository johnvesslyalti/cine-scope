'use client';

import { useState } from "react";
import { useAuth } from "@/store/useAuth";
import { RxCross1, RxHamburgerMenu } from "react-icons/rx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { navLinks } from "@/constants/NavLinks";
import { Button } from "./ui/button";

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
            <header className="w-full sticky top-0 z-30 bg-black/90 backdrop-blur-md shadow-sm border-b border-zinc-800">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:px-8 text-white">
                    <Link href="/"><div className="text-2xl font-semibold tracking-wide text-white">🎬 Cine Scope</div></Link>

                    {/* Hamburger Icon */}
                    <button
                        className="text-2xl font-bold md:hidden focus:outline-none"
                        onClick={toggleMenu}
                    >
                        {menuOpen ? <RxCross1 /> : <RxHamburgerMenu />}
                    </button>

                    {/* Desktop Nav Links */}
                    <nav className="hidden md:flex space-x-6 text-base items-center">
                        {filteredLinks.map(link => (
                            <Link key={link.label} href={link.path}>
                                <span className="hover:text-cyan-400 transition-colors duration-200 cursor-pointer">
                                    {link.label}
                                </span>
                            </Link>
                        ))}
                        {user && (
                            <Button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 text-sm rounded-xl shadow transition"
                            >
                                Logout
                            </Button>
                        )}
                    </nav>
                </div>
            </header>

            {/* Mobile Overlay */}
            {menuOpen && (
                <div className="fixed inset-0 bg-black/95 text-white flex flex-col items-center justify-center gap-8 z-50 transition-all duration-300">
                    <button onClick={toggleMenu} className="absolute top-5 right-5 text-3xl text-gray-300 hover:text-white">
                        <RxCross1 />
                    </button>

                    <nav className="flex flex-col items-center gap-6 text-xl">
                        {filteredLinks.map(link => (
                            <Link key={link.label} href={link.path} onClick={toggleMenu}>
                                <span className="hover:text-cyan-400 transition">{link.label}</span>
                            </Link>
                        ))}
                        {user && (
                            <button
                                onClick={() => {
                                    handleLogout();
                                    toggleMenu();
                                }}
                                className="text-red-400 hover:text-red-500 transition text-xl"
                            >
                                Logout
                            </button>
                        )}
                    </nav>
                </div>
            )}
        </>
    );
}
