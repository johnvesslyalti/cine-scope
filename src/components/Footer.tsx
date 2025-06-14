export default function Footer() {
    return (
        <footer className="bg-zinc-950 text-gray-400 pt-12 pb-8 mt-24">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                {/* Brand Description */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-4">🎬 Cine Scope</h2>
                    <p className="text-sm leading-relaxed text-zinc-400">
                        Your ultimate movie discovery platform. Explore trending titles, rate your favorites, and stay in the loop.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Movies</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">TV Shows</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Top Rated</a></li>
                    </ul>
                </div>

                {/* Legal */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                    </ul>
                </div>

                {/* Connect */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                    </ul>
                </div>
            </div>

            {/* Divider and Copyright */}
            <div className="border-t border-zinc-800 mt-12 pt-6 text-center text-xs text-zinc-500">
                &copy; {new Date().getFullYear()} <span className="font-semibold text-white">Cine Scope</span>. All rights reserved.
            </div>
        </footer>
    );
}
