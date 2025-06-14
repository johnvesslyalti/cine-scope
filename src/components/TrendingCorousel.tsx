'use client';

import { useAutoSlider } from "@/hooks/useAutoSlider";
import { useCineStore } from "@/store/cineStore";
import { useEffect, useState } from "react";
import axios from "axios";
import "keen-slider/keen-slider.min.css";
import { TMDB_API } from "@/lib/tmdb";

export default function TrendingCarousel() {
  const { trending, setTrending } = useCineStore();
  const { sliderRef } = useAutoSlider();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        setLoading(true);
        const res = await axios.get(TMDB_API.trending);
        const movies = res.data.results.slice(0, 10);
        setTrending(movies);
      } catch (err) {
        console.error("Failed to fetch trending movies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, [setTrending]);

  return (
    <section className="px-6 py-6 md:py-10">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
        🎞️ Trending Today
      </h2>

      <div ref={sliderRef} className="keen-slider h-[400px] rounded-xl overflow-hidden">
        {trending.map((movie, index) => {
          const backgroundImg = movie.poster_path
            ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
            : "/fallback-bg.jpg";

          const posterImg = movie.poster_path
            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
            : "/fallback.jpg";

          return (
            <div key={movie.id} className="keen-slider__slide relative">
              {/* Background image with overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${backgroundImg})`,
                  filter: "brightness(0.5)",
                }}
              />
              <div className="absolute inset-0 bg-black/60" />

              {/* Foreground content */}
              <div className="relative z-10 flex items-end h-full p-6 gap-6">
                <img
                  src={posterImg}
                  alt={movie.title || movie.name}
                  className="w-32 md:w-40 rounded-xl shadow-xl object-cover"
                  loading="lazy"
                />
                <div className="text-white">
                  <h3 className="text-xl md:text-2xl font-bold">
                    {movie.title || movie.name || "Untitled"}
                  </h3>
                  <p className="mt-2 text-sm md:text-base text-white/80 max-w-lg line-clamp-3">
                    {movie.overview || "No description available."}
                  </p>
                  <span className="mt-3 inline-block bg-red-600 px-3 py-1 text-sm font-semibold rounded-full shadow">
                    #{index + 1}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
