export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-10 border-t border-gray-700">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-bold">🎬 Cine Scope</h2>
          <p className="text-sm text-gray-400">Explore the world of cinema</p>
        </div>

        <div className="flex gap-4">
          <a href="#" className="text-gray-400 hover:text-white text-sm transition">About</a>
          <a href="#" className="text-gray-400 hover:text-white text-sm transition">Contact</a>
          <a href="#" className="text-gray-400 hover:text-white text-sm transition">Privacy</a>
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Cine Scope. All rights reserved.
      </div>
    </footer>
  );
}
