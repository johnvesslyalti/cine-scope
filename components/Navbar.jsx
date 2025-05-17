import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RiMovie2AiLine } from "react-icons/ri";
import Link from "next/link";
import { useAuth } from "../context/authContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    return(
        <nav className="flex justify-between items-center">
            <div className="flex justify-center items-center gap-2 cursor-pointer">
                <RiMovie2AiLine className="text-5xl" />
                <h1 className="text-3xl font-bold">Cine Scope</h1>
            </div>
            <div className="flex w-100 gap-2">
                <Input placeholder="Search..." />
                <Button className="cursor-pointer">Search</Button>
            </div>
            {user ? (
                <div className="flex gap-5">
                <Link href="/login">
                    <Button className="cursor-pointer">Watch List</Button>
                </Link>
                    <Button onClick={() => logout()} className="cursor-pointer">Logout</Button>
            </div>
            ) : (
                <div className="flex gap-5">
                <Link href="/login">
                    <Button className="cursor-pointer">Login</Button>
                </Link>
                <Link href="/signup">
                    <Button className="cursor-pointer">Sign Up</Button>
                </Link>
            </div>
            )}
        </nav>
    )
}