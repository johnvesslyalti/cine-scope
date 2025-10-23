import NowPlayingMovies from "@/components/NowPlayingMovies";
import Popular from "@/components/Popular";
import TopRatedMovies from "@/components/TopRatedMovies";
import TrendingCarousel from "@/components/TrendingCorousel";
import UpcomingReleases from "@/components/UpComingReleases";
import AIRecommendations from "@/components/AIRecommendations";

export default function Page() {
    return (
        <div className="min-h-screen bg-black">
            <TrendingCarousel />
            {/* <AIRecommendations /> */}
            <Popular />
            <TopRatedMovies />
            <NowPlayingMovies />
            <UpcomingReleases />
        </div>
    )
}