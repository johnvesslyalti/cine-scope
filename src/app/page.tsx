import NowPlayingMovies from "@/components/NowPlayingMovies";
import Popular from "@/components/Popular";
import TopRatedMovies from "@/components/TopRatedMovies";
import TrendingCarousel from "@/components/TrendingCorousel";
import UpcomingReleases from "@/components/UpComingReleases";

export default function Page() {
    return (
        <div className="min-h-screen">
            <TrendingCarousel />
            <Popular />
            <TopRatedMovies />
            <NowPlayingMovies />
            <UpcomingReleases />
        </div>
    )
}