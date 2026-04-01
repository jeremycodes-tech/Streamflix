import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MovieCard } from '../components/MovieCard';
import { tmdb } from '../lib/tmdb';
import type { Movie } from '../lib/data';

interface SearchProps {
  myList: Movie[];
  toggleMyList: (movie: Movie) => void;
  onPlayClick: (movie: Movie) => void;
  isAuthenticated: boolean;
  onLogout: () => void;
  onLoginClick: () => void;
}

export function Search({ myList, toggleMyList, onPlayClick, isAuthenticated, onLogout, onLoginClick }: SearchProps) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const searchTMDB = async () => {
      setLoading(true);
      try {
        const searchResults = await tmdb.search(query);
        setResults(searchResults);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchTMDB, 500);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const myListIds = new Set(myList.map(m => m.id));

  return (
    <motion.div 
      className="min-h-screen bg-netflix-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header scrolled={true} isAuthenticated={isAuthenticated} onLogout={onLogout} onLoginClick={onLoginClick} />
      
      <main className="pt-24 pb-16 px-4 md:px-12 max-w-[1600px] mx-auto min-h-[80vh]">
        <h1 className="text-2xl md:text-3xl font-semibold mb-8 text-gray-300">
          {query ? `Showing results for "${query}"` : 'Search for titles, people, and genres'}
        </h1>
        
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-netflix-red"></div>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2 className="text-xl md:text-2xl text-gray-400 mb-4">No matching titles found.</h2>
            <p className="text-gray-500 max-w-md">
              Try searching for different keyword, title, or genre.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {results.map((movie) => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                isInMyList={myListIds.has(movie.id)} 
                onToggleMyList={(e, m) => {
                  e.stopPropagation();
                  toggleMyList(m);
                }} 
                onPlay={() => onPlayClick(movie)}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </motion.div>
  );
}
