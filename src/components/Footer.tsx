import { FaInstagram, FaTwitter, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative bg-zinc-950 text-gray-400 pt-14 pb-8 mt-24">
      {/* Subtle top gradient line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            🎬 Cine Scope
          </h2>
          <p className="text-sm leading-relaxed text-zinc-400">
            Discover, rate, and explore movies & shows. Your cinematic world, one click away.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {["Home", "Movies", "TV Shows", "Top Rated"].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-cyan-400 transition-colors duration-200">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
          <ul className="space-y-2 text-sm">
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-cyan-400 transition-colors duration-200">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-cyan-400 transition-colors text-xl">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-cyan-400 transition-colors text-xl">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-cyan-400 transition-colors text-xl">
              <FaGithub />
            </a>
          </div>
        </div>
      </div>

      {/* Divider & Copyright */}
      <div className="border-t border-zinc-800 mt-12 pt-6 text-center text-xs text-zinc-500">
        &copy; {new Date().getFullYear()}{" "}
        <span className="font-semibold text-white">Cine Scope</span>. All rights reserved.
      </div>
    </footer>
  );
}
