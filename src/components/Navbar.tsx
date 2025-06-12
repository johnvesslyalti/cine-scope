'use client';

import { useState } from "react";
import { RxCross1, RxHamburgerMenu } from "react-icons/rx";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    return(
        <>
            <div className="flex items-center justify-between px-4 py-3 md:px-8">
                <div className="text-xl font-bold">Cine Scope</div>
                <button className="text-xl font-bold md:hidden focus:outline-none" onClick={toggleMenu}>{menuOpen ? <RxCross1 /> : <RxHamburgerMenu />}</button>
            
                {/* Desktop View */}
                <div className="hidden md:flex space-x-8 text-lg">
                    <button>Home</button>
                    <button>Movies</button>
                    <button>TV Shows</button>
                </div>
            </div>

            {menuOpen && (
                <div className="flex flex-col gap-5 pb-3">
                    <button>Home</button>
                    <button>Movies</button>
                    <button>TV Shows</button>
                </div>
            )}
        </>
    )
}