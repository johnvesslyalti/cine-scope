export default function Watchlist() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white px-6 py-12">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 border-b border-zinc-700 pb-2">
                    Your Watchlist
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Replace below with actual mapped movies */}
                    {[...Array(4)].map((_, idx) => (
                        <div
                            key={idx}
                            className="bg-zinc-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                        >
                            <div className="aspect-[2/3] bg-zinc-800 flex items-center justify-center text-gray-500">
                                Poster
                            </div>
                            <div className="p-4">
                                <h2 className="text-lg font-semibold">Movie Title</h2>
                                <p className="text-sm text-gray-400 mt-1">Year | Genre</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
