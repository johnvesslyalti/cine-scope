import NowPlayingMovies from "@/components/NowPlayingMovies";
import TopRatedMovies from "@/components/TopRatedMovies";
import TrendingCarousel from "@/components/TrendingCorousel";
import UpcomingReleases from "@/components/UpComingReleases";

export default function Page() {
    return (
        <div className="min-h-screen">
            <TrendingCarousel />
            <TopRatedMovies />
            <NowPlayingMovies />
            <UpcomingReleases />
        </div>
    )
}