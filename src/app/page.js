'use client';

import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Page() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    const url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
    const options = {
    method: 'GET',
    headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`
        }
    };

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        return shuffled;
    }

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch(url, options);
                const data = await response.json();
                const shuffledMovies = shuffleArray(data.results);
                setMovies(shuffledMovies);
                setLoading(false);
            } catch(error) {
                console.error(error);
            }
        }
        fetchMovies();
    }, []);

    return(
        <div className="flex flex-col p-5">
            <header>
                <Navbar />
            </header>
            <main className="flex-grow grid grid-cols-5 p-5 gap-5 relative">
                {loading && (
                    <div className="absolute w-5 h-5 top-1/2 left-1/2 border-2 border-t-sky-500 animate-spin rounded-xl"></div>
                )}
                {movies.map((movie) => (
                    <Card className="flex flex-col h-[400px] hover:scale-102" key={movie.id}>
                        <CardHeader className="flex-shrink-0 p-5">
                            <img 
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            className="object-cover rounded h-48 w-full"
                            />
                        </CardHeader>
                        <CardContent className="flex flex-grow justify-center items-center overflow-hidden line-clamp-2">
                            <p>{movie.title}</p>
                        </CardContent>
                        <CardFooter className="flex w-full justify-center items-center">
                            <Button>Add to WatchList</Button>
                        </CardFooter>
                    </Card>
                ))}
            </main>
            <footer>
                <Footer />
            </footer>
        </div>
    )
}