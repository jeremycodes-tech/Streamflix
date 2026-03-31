import { useState } from 'react';
import { Search, Bell, Menu, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function Header({ 
  scrolled, 
  isAuthenticated, 
  onLogout,
  onLoginClick
}: { 
  scrolled: boolean;
  isAuthenticated?: boolean;
  onLogout?: () => void;
  onLoginClick?: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim().length > 0) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    } else {
      navigate('/');
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled ? 'scrolled bg-black/60 backdrop-blur-xl border-b border-white/10' : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-12 py-4">
        {/* Left side */}
        <div className="flex items-center gap-6">
          <Link to="/">
            <img 
              src="/streamflix-app-logo.png" 
              alt="Streamflix" 
              className="h-10 md:h-12 w-auto object-contain cursor-pointer transition-all duration-500 hover:scale-110 drop-shadow-[0_0_15px_rgba(229,9,20,0.4)] hover:drop-shadow-[0_0_25px_rgba(229,9,20,0.8)] hover:brightness-110"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm ml-4">
            <Link to="/" className="text-white hover:text-red-500 transition-colors font-semibold">Home</Link>
            <Link to="/tv-shows" className="text-gray-300 hover:text-white transition-colors">TV Shows</Link>
            <Link to="/movies" className="text-gray-300 hover:text-white transition-colors">Movies</Link>
            <Link to="/latest" className="text-gray-300 hover:text-white transition-colors">New & Popular</Link>
            <Link to="/my-list" className="text-gray-300 hover:text-white transition-colors">My List</Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white hover:text-gray-300 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className={`flex items-center transition-all duration-300 ${searchOpen ? 'border border-white bg-black/70 px-2 py-1' : ''}`}>
            <button 
              className="text-white hover:text-gray-300 transition-colors"
              onClick={() => {
                setSearchOpen(!searchOpen);
              }}
            >
              <Search className={`w-5 h-5 ${searchOpen ? 'mr-2' : ''}`} />
            </button>
            {searchOpen && (
              <input 
                type="text"
                autoFocus
                placeholder="Titles, people, genres"
                value={searchQuery}
                onChange={handleSearchChange}
                onBlur={() => {
                  if (!searchQuery) setSearchOpen(false);
                }}
                className="bg-transparent text-white text-sm outline-none w-32 md:w-56"
              />
            )}
          </div>
          <button className="text-white hover:text-gray-300 transition-colors hidden sm:block">
            <Bell className="w-5 h-5" />
          </button>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div 
                className="flex items-center gap-2 cursor-pointer group relative"
                onClick={() => navigate('/profile')}
              >
                <div className="w-8 h-8 rounded bg-netflix-red flex items-center justify-center text-white font-bold text-sm hover:scale-105 transition-transform duration-300">
                  YF
                </div>
                <span className="hidden md:block text-white text-sm group-hover:text-gray-300 transition-colors">My Profile</span>
              </div>
              <button 
                onClick={onLogout}
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:block text-sm">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
               <button 
                 onClick={onLoginClick}
                 className="text-white bg-netflix-red hover:bg-red-700 px-4 py-1.5 rounded text-sm font-semibold transition-colors"
               >
                 Sign In
               </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-netflix-black/95 border-t border-gray-800 shadow-2xl absolute w-full left-0 top-full">
          <nav className="flex flex-col py-2">
            <button 
              className="px-6 py-4 text-left text-white font-medium hover:bg-gray-800 transition-colors"
              onClick={() => handleNavigation('/')}
            >
              Home
            </button>
            <button 
              className="px-6 py-4 text-left text-white font-medium hover:bg-gray-800 transition-colors"
              onClick={() => handleNavigation('/tv-shows')}
            >
              TV Shows
            </button>
            <button 
              className="px-6 py-4 text-left text-white font-medium hover:bg-gray-800 transition-colors"
              onClick={() => handleNavigation('/movies')}
            >
              Movies
            </button>
            <button 
              className="px-6 py-4 text-left text-white font-medium hover:bg-gray-800 transition-colors"
              onClick={() => handleNavigation('/latest')}
            >
              New & Popular
            </button>
            <button 
              className="px-6 py-4 text-left text-white font-medium hover:bg-gray-800 transition-colors"
              onClick={() => handleNavigation('/my-list')}
            >
              My List
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
