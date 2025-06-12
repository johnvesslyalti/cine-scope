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

  if (!trending || trending.length === 0) {
    return (
      <div className="absolute top-20 left-5 rounded h-5 w-5 border-2 animate-spin border-white"></div>
    );
  }

  return (
    <div
      ref={sliderRef}
      className="keen-slider h-[400px] relative rounded-xl overflow-hidden p-5"
    >
      {trending.map((movie, index) => (
        <div key={movie.id} className="keen-slider__slide relative">
          <div className="relative w-full h-full">
            {/* Movie Image */}
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "/fallback.jpg"
              }
              alt={movie.title || movie.name || "Untitled"}
              className="w-full h-full object-contain rounded-xl"
            />

            {/* Overlay with Movie Title and Number */}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent px-5 py-6 flex items-end justify-between text-white">
              <div className="text-xl font-semibold truncate max-w-[85%]">
                {movie.title || movie.name || "Untitled"}
              </div>
              <div className="text-2xl font-bold bg-red-600 px-3 py-1 rounded-full">
                {index + 1}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
