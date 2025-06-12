'use client';

import { useState } from "react";
import { RxCross1, RxHamburgerMenu } from "react-icons/rx";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    return (
        <>
            {/* Navbar */}
            <div className="flex items-center justify-between px-4 py-3 md:px-8 bg-black text-white z-20 relative">
                <div className="text-xl font-bold">Cine Scope</div>
                <button
                    className="text-2xl font-bold md:hidden focus:outline-none"
                    onClick={toggleMenu}
                >
                    {menuOpen ? <RxCross1 /> : <RxHamburgerMenu />}
                </button>

                {/* Desktop Navigation */}
                <div className="hidden md:flex space-x-8 text-lg">
                    <button>Home</button>
                    <button>Movies</button>
                    <button>TV Shows</button>
                </div>
            </div>

            {/* Mobile Overlay Menu */}
            {menuOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-95 text-white flex flex-col items-center justify-center gap-6 z-50 md:hidden">
                    <button onClick={toggleMenu} className="absolute top-4 right-4 text-3xl">
                        <RxCross1 />
                    </button>
                    <button className="text-2xl">Home</button>
                    <button className="text-2xl">Movies</button>
                    <button className="text-2xl">TV Shows</button>
                </div>
            )}
        </>
    );
}
