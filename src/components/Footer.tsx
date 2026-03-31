import { Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black/95 border-t border-gray-800 py-12 md:py-20 px-4 md:px-12 relative z-10 text-gray-400">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="mb-6 hover:underline cursor-pointer inline-block text-lg">Questions? Contact us.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-4 mb-10 text-sm">
           <a href="#" className="hover:underline hover:text-gray-300">FAQ</a>
           <a href="#" className="hover:underline hover:text-gray-300">Help Center</a>
           <a href="#" className="hover:underline hover:text-gray-300">Account</a>
           <a href="#" className="hover:underline hover:text-gray-300">Media Center</a>
           <a href="#" className="hover:underline hover:text-gray-300">Investor Relations</a>
           <a href="#" className="hover:underline hover:text-gray-300">Jobs</a>
           <a href="#" className="hover:underline hover:text-gray-300">Redeem Gift Cards</a>
           <a href="#" className="hover:underline hover:text-gray-300">Buy Gift Cards</a>
           <a href="#" className="hover:underline hover:text-gray-300">Ways to Watch</a>
           <a href="#" className="hover:underline hover:text-gray-300">Terms of Use</a>
           <a href="#" className="hover:underline hover:text-gray-300">Privacy</a>
           <a href="#" className="hover:underline hover:text-gray-300">Cookie Preferences</a>
           <a href="#" className="hover:underline hover:text-gray-300">Corporate Information</a>
           <a href="#" className="hover:underline hover:text-gray-300">Contact Us</a>
           <a href="#" className="hover:underline hover:text-gray-300">Speed Test</a>
           <a href="#" className="hover:underline hover:text-gray-300">Legal Notices</a>
        </div>

        <div className="mb-6">
          <div className="inline-flex items-center gap-2 border border-gray-600 rounded px-4 py-2 hover:border-white transition-colors cursor-pointer bg-black/40">
            <Globe className="w-4 h-4" />
            <select className="bg-transparent text-sm outline-none cursor-pointer text-gray-400 hover:text-white appearance-none pr-4">
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>

        <p className="text-xs">
          YouFlix © 2026. Premium Streaming UI.
        </p>
      </div>
    </footer>
  );
}
