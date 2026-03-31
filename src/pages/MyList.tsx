import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MovieCard } from '../components/MovieCard';
import type { Movie } from '../lib/data';

interface MyListProps {
  myList: Movie[];
  toggleMyList: (movie: Movie) => void;
  onPlayClick: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
  onLoginClick: () => void;
}

export function MyList({ myList, toggleMyList, onPlayClick, isAuthenticated, onLogout, onLoginClick }: MyListProps) {
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
        <h1 className="text-3xl md:text-4xl font-semibold mb-8">My List</h1>
        
        {myList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2 className="text-xl md:text-2xl text-gray-400 mb-4">Your list is empty.</h2>
            <p className="text-gray-500 max-w-md">
              Add shows and movies to your list so you can easily find them later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {myList.map((movie) => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                isInMyList={true} 
                onToggleMyList={(e, m) => {
                  e.stopPropagation();
                  toggleMyList(m);
                }} 
                onPlay={onPlayClick}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </motion.div>
  );
}
