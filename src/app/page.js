'use client';

import { useEffect, useState, useCallback } from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import MovieCard from "../../components/MoviesCard";
import Loading from "../../components/Loading";

export default function Page() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchMovies = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);

        const url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`
            }
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            setMovies(prev => [...prev, ...data.results]);
            setHasMore(data.page < data.total_pages); // or use a max limit like page < 10
            setPage(prev => prev + 1);
        } catch (error) {
            console.error("Failed to fetch movies:", error);
        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore]);

    useEffect(() => {
        fetchMovies(); // initial fetch
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop + 200 >= document.documentElement.offsetHeight &&
                !loading && hasMore
            ) {
                fetchMovies();
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [fetchMovies, loading, hasMore]);

    return (
        <div>
            <div className="flex flex-col p-5 min-h-screen">
                <header>
                    <Navbar />
                </header>
                <main className="flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-5 gap-5 relative">
                    {movies.map((movie, index) => (
                            <MovieCard key={movie.id + index + movie.title} movie={movie} index={index} />
                    ))}
                    {loading && <Loading />
                    }
                </main>
            </div>
            <footer>
                <Footer />
            </footer>
        </div>
    );
}
