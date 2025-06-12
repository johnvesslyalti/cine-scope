import TopRatedMovies from "@/components/TopRatedMovies";
import TrendingCarousel from "@/components/TrendingCorousel";

export default function Page() {
    return (
        <div className="min-h-screen">
            <TrendingCarousel />
            <TopRatedMovies />
        </div>
    )
}