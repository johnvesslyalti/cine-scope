'use client';

import { useAutoSlider } from "@/hooks/useAutoSlider";
import { useCineStore } from "@/store/cineStore";
import { useEffect } from "react";
import axios from "axios";
import "keen-slider/keen-slider.min.css";

export default function TrendingCarousel() {
  const { trending, setTrending } = useCineStore();
  const { sliderRef } = useAutoSlider();

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/trending/all/day?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        const movies = res.data.results.slice(0, 10);
        setTrending(movies);
      } catch (err) {
        console.error("Failed to fetch trending movies:", err);
      }
    };

    fetchTrendingMovies();
  }, []);

  return (
    <section className="px-6 py-4">
      <h2 className="text-2xl font-semibold mb-4 text-white">Trending Today</h2>
      <div
        ref={sliderRef}
        className="keen-slider h-[400px] relative rounded-xl overflow-hidden"
      >
        {trending.map((movie, index) => (
          <div
            key={movie.id}
            className="keen-slider__slide relative px-2"
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg group">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "/fallback.jpg"
                }
                alt={movie.title || movie.name || "Untitled"}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent px-4 py-4 flex items-end justify-between text-white">
                <h3 className="text-lg font-semibold truncate max-w-[80%]">
                  {movie.title || movie.name || "Untitled"}
                </h3>
                <span className="text-lg font-bold bg-red-600 px-3 py-1 rounded-full shadow-md">
                  {index + 1}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
