import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { HeroBanner } from '../components/HeroBanner';
import { MovieRow } from '../components/MovieRow';
import { Footer } from '../components/Footer';
import { movies, initialCategories } from '../lib/data';
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
        <img 
          src="/streamflix-logo.png" 
          alt="Streamflix" 
          className="w-48 h-48 md:w-72 md:h-72 object-contain"
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
    // Only show intro once per session
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    return !hasSeenIntro;
  });
  
  const [scrolled, setScrolled] = useState(false);

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

  const myListIds = new Set(myList.map(m => m.id));

  const allCategories = [
    ...(myList.length > 0 ? [{ id: 'mylist', title: 'My List', movies: myList }] : []),
    ...initialCategories
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
            <HeroBanner 
              featuredMovie={movies[16]} // Stranger Things
              onToggleMyList={toggleMyList}
              isInMyList={myListIds.has('17')}
              onPlayClick={onPlayClick}
            />
            
            {/* Movie Rows */}
            <div className="relative z-10 -mt-20 md:-mt-32 space-y-2 md:space-y-4 pb-12">
              {allCategories.map((category) => (
                <MovieRow 
                  key={category.id}
                  title={category.title}
                  movies={category.movies}
                  onToggleMyList={handleToggleMyListFromCard}
                  myListIds={myListIds}
                  onPlayClick={onPlayClick}
                />
              ))}
            </div>
          </main>

          <Footer />
        </motion.div>
      )}
    </motion.div>
  );
}
