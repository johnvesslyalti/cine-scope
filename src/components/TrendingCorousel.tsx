'use client';

import { useAutoSlider } from "@/hooks/useAutoSlider";
import { useCineStore } from "@/store/cineStore";
import { useEffect } from "react";
import axios from "axios";
import "keen-slider/keen-slider.min.css";
import { TMDB_API } from "@/lib/tmdb";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function TrendingCarousel() {
  const { trending, setTrending } = useCineStore();
  const { sliderRef, sliderInstanceRef } = useAutoSlider({
    slides: { perView: 1, spacing: 15 },
  }, trending.length);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const res = await axios.get(TMDB_API.trending);
        const movies = res.data.results.slice(0, 10);
        setTrending(movies);
      } catch (err) {
        console.error("Failed to fetch trending movies:", err);
      }
    };
    fetchTrendingMovies();
  }, [setTrending]);

  const prevSlide = () => sliderInstanceRef.current?.prev();
  const nextSlide = () => sliderInstanceRef.current?.next();

  // Don't render the slider if there are no trending movies
  if (trending.length === 0) {
    return (
      <section className="relative px-4 md:px-10 py-8 md:py-14 bg-gradient-to-b from-black/90 to-black">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            🎞️ Trending Today
          </h2>
        </div>
        <div className="h-[420px] rounded-xl overflow-hidden bg-zinc-900 flex items-center justify-center">
          <p className="text-white/60">Loading trending movies...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative px-4 md:px-10 py-8 md:py-14 bg-gradient-to-b from-black/90 to-black">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          🎞️ Trending Today
        </h2>

        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <ChevronLeft className="text-white" size={20} />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <ChevronRight className="text-white" size={20} />
          </button>
        </div>
      </div>

      <div ref={sliderRef} className="keen-slider h-[420px] rounded-xl overflow-hidden">
        {trending.map((movie, index) => {
          const backgroundImg = movie.backdrop_path
            ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
            : "/fallback-bg.jpg";

          const posterImg = movie.poster_path
            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
            : "/fallback.jpg";

          return (
            <motion.div
              key={movie.id}
              className="keen-slider__slide relative group"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Background */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${backgroundImg})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* Foreground content */}
              <div className="relative z-10 flex items-end h-full p-6 gap-6 max-w-6xl mx-auto">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative w-32 md:w-40 h-[190px] md:h-[240px] rounded-xl overflow-hidden shadow-xl shadow-black/50"
                >
                  <Link href={`/movie/${movie.id}`}>
                    <Image
                      src={posterImg}
                      alt={movie.title || movie.name || "Untitled"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 128px, 160px"
                      priority={index === 0}
                    />
                  </Link>
                </motion.div>

                <div className="text-white max-w-lg">
                  <h3 className="text-2xl md:text-3xl font-bold leading-tight drop-shadow-md">
                    {movie.title || movie.name || "Untitled"}
                  </h3>
                  <p className="mt-3 text-sm md:text-base text-white/80 line-clamp-3">
                    {movie.overview || "No description available."}
                  </p>
                  <span className="mt-4 inline-block bg-red-600 px-4 py-1 text-sm font-semibold rounded-full shadow-lg">
                    #{index + 1} Trending
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
