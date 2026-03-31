import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { HeroBanner } from '../components/HeroBanner';
import { MovieRow } from '../components/MovieRow';
import { Footer } from '../components/Footer';
import { tmdb } from '../lib/tmdb';
import type { Movie } from '../lib/data';
import { motion, AnimatePresence } from 'framer-motion';

// Initial Netflix-style Entrance Animation
function EntranceAnimation({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 bg-black z-[100] flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="netflix-intro-animation">
        <motion.img 
          src="/streamflix-logo.png" 
          alt="Streamflix" 
          className="w-80 h-80 md:w-[700px] md:h-[700px] object-contain drop-shadow-[0_0_60px_rgba(229,9,20,0.5)] scale-logo-animation"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

export function Home({ 
  myList, 
  toggleMyList,
  onPlayClick,
  isAuthenticated,
  onLogout,
  onLoginClick
}: { 
  myList: Movie[];
  toggleMyList: (movie: Movie) => void;
  onPlayClick: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
  onLoginClick: () => void;
}) {
  const [showIntro, setShowIntro] = useState(() => {
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    return !hasSeenIntro;
  });
  
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState<{ id: string; title: string; movies: Movie[] }[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!showIntro) {
      sessionStorage.setItem('hasSeenIntro', 'true');
    }
  }, [showIntro]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [trending, topRated, action, horror] = await Promise.all([
          tmdb.getTrending(),
          tmdb.getMoviesByCategory('top_rated'),
          tmdb.getMoviesByGenre(28),
          tmdb.getMoviesByGenre(27)
        ]);

        setFeaturedMovie(trending[0]);
        setCategories([
          { id: 'trending', title: 'Trending Now', movies: trending },
          { id: 'top_rated', title: 'Critically Acclaimed', movies: topRated },
          { id: 'action', title: 'Action & Adventure', movies: action },
          { id: 'horror', title: 'Horror Favourites', movies: horror },
        ]);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch TMDB data", err);
      }
    };
    loadData();
  }, []);

  const myListIds = new Set(myList.map(m => m.id));

  const allCategories = [
    ...(myList.length > 0 ? [{ id: 'mylist', title: 'My List', movies: myList }] : []),
    ...categories
  ];

  const handleToggleMyListFromCard = (e: React.MouseEvent, movie: Movie) => {
    e.stopPropagation();
    toggleMyList(movie);
  };

  return (
    <motion.div 
      className="min-h-screen bg-netflix-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence>
        {showIntro && <EntranceAnimation onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      {!showIntro && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Header 
            scrolled={scrolled} 
            isAuthenticated={isAuthenticated} 
            onLogout={onLogout} 
            onLoginClick={onLoginClick}
          />
          
          <main>
            {featuredMovie && (
              <HeroBanner 
                featuredMovie={featuredMovie}
                onToggleMyList={toggleMyList}
                isInMyList={myListIds.has(featuredMovie.id)}
                onPlayClick={onPlayClick}
              />
            )}
            
            <div className="relative z-10 -mt-20 md:-mt-32 space-y-2 md:space-y-4 pb-12">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-netflix-red"></div>
                </div>
              ) : (
                allCategories.map((category) => (
                  <MovieRow 
                    key={category.id}
                    title={category.title}
                    movies={category.movies}
                    onToggleMyList={handleToggleMyListFromCard}
                    myListIds={myListIds}
                    onPlayClick={onPlayClick}
                  />
                ))
              )}
            </div>
          </main>

          <Footer />
        </motion.div>
      )}
    </motion.div>
  );
}
