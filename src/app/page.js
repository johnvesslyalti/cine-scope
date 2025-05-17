'use client';

import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import  Link  from "next/link";

export default function Page() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    const url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
    const options = {
    method: 'GET',
    headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`
        }
    };

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch(url, options);
                const data = await response.json();
                setMovies(data.results);
                setLoading(false);
            } catch(error) {
                console.error(error);
            }
        }
        fetchMovies();
    }, []);

    return(
        <div>
            <div className="flex flex-col p-5 h-screen">
                    <header>
                    <Navbar />
                </header>
                <main className="flex-grow grid grid-cols-5 p-5 gap-5 relative">
                    {loading && (
                        <div className="absolute w-5 h-5 top-1/2 left-1/2 border-2 border-t-sky-500 animate-spin rounded-xl"></div>
                    )}
                    {movies.map((movie) => (
                        <Link href={`/${movie.id}`} key={movie.id}>
                            <Card className="flex flex-col h-[400px] hover:scale-102" >
                                <CardHeader className="flex-shrink-0 p-5">
                                    <img 
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title}
                                    className="object-cover rounded h-48 w-full"
                                    />
                                </CardHeader>
                                <CardContent className="flex flex-grow justify-center items-center overflow-hidden line-clamp-2">
                                    <p className="text-center font-bold">{movie.title}</p>
                                </CardContent>
                                <CardFooter className="flex w-full justify-center items-center">
                                    <Button className="font-bold cursor-pointer">Add to WatchList</Button>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </main>
            </div>
            <footer>
                <Footer />
            </footer>
        </div>
    )
}