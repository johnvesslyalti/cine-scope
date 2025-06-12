export default function Footer() {
    return (
        <footer className="bg-zinc-900 text-gray-300 py-10 mt-20">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <h2 className="text-lg font-semibold mb-4">Cine Scope</h2>
                    <p className="text-sm">
                        Your ultimate movie discovery platform. Explore, rate, and review.
                    </p>
                </div>

                <div>
                    <h3 className="text-md font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:underline">Home</a></li>
                        <li><a href="#" className="hover:underline">Movies</a></li>
                        <li><a href="#" className="hover:underline">TV Shows</a></li>
                        <li><a href="#" className="hover:underline">Top Rated</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-md font-semibold mb-4">Legal</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                        <li><a href="#" className="hover:underline">Terms of Service</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-md font-semibold mb-4">Connect</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:underline">Instagram</a></li>
                        <li><a href="#" className="hover:underline">Twitter</a></li>
                        <li><a href="#" className="hover:underline">GitHub</a></li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-zinc-700 mt-10 pt-6 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Cine Scope. All rights reserved.
            </div>
        </footer>
    );
}
