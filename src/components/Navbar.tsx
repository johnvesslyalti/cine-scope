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
        router.push('/login'); // Redirect after logout
    };

    const filteredLinks = navLinks.filter(link => {
        if (user && link.guestOnly) return false;
        if (!user && link.authRequired) return false;
        return true;
    });

    return (
        <>
            {/* Top Navbar */}
            <div className="flex items-center justify-between px-4 py-3 md:px-8 bg-black text-white z-20 relative">
                <div className="text-xl font-bold">Cine Scope</div>
                <button
                    className="text-2xl font-bold md:hidden focus:outline-none"
                    onClick={toggleMenu}
                >
                    {menuOpen ? <RxCross1 /> : <RxHamburgerMenu />}
                </button>

                {/* Desktop Navigation */}
                <div className="hidden md:flex space-x-8 text-lg items-center">
                    {filteredLinks.map(link => (
                        <Link key={link.label} href={link.path}>
                            <button className="cursor-pointer">{link.label}</button>
                        </Link>
                    ))}
                    {user && (
                        <Button
                            onClick={handleLogout}
                            className="cursor-pointer"
                        >
                            Logout
                        </Button>
                    )}
                </div>
            </div>

            {/* Mobile Overlay Menu */}
            {menuOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-95 text-white flex flex-col items-center justify-center gap-6 z-50 md:hidden">
                    <button onClick={toggleMenu} className="absolute top-4 right-4 text-3xl">
                        <RxCross1 />
                    </button>
                    <div className="flex flex-col items-center gap-6">
                        {filteredLinks.map(link => (
                            <Link key={link.label} href={link.path} onClick={toggleMenu}>
                                <button className="text-2xl">{link.label}</button>
                            </Link>
                        ))}
                        {user && (
                            <button
                                onClick={() => {
                                    handleLogout();
                                    toggleMenu();
                                }}
                                className="text-2xl text-red-400 hover:underline"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
