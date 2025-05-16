'use client';

import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

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
        <div className="flex flex-col p-5">
            <header>
                <Navbar />
            </header>
            <main className="flex-grow grid grid-cols-5 p-5 gap-5 relative">
                {loading && (
                    <div className="absolute w-5 h-5 top-1/2 left-1/2 border-2 border-t-sky-500 animate-spin rounded-xl"></div>
                )}
                {movies.map((movie) => (
                    <div key={movie.id}>
                        <img 
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="rounded"
                        />
                        <h2>{movie.title}</h2>
                    </div>
                ))}
            </main>
            <footer>
                <Footer />
            </footer>
        </div>
    )
}