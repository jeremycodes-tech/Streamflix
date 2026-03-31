import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { HeroBanner } from '../components/HeroBanner';
import { MovieRow } from '../components/MovieRow';
import { Footer } from '../components/Footer';
import type { Movie } from '../lib/data';
import { motion } from 'framer-motion';

interface Category {
  id: string;
  title: string;
  movies: Movie[];
}

interface BrowseCategoryProps {
  pageTitle: string;
  categories: Category[];
  featuredMovie: Movie;
  myList: Movie[];
  toggleMyList: (movie: Movie) => void;
  onPlayClick: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
  onLoginClick: () => void;
}

export function BrowseCategory({
  pageTitle,
  categories,
  featuredMovie,
  myList,
  toggleMyList,
  onPlayClick,
  isAuthenticated,
  onLogout,
  onLoginClick,
}: BrowseCategoryProps) {
  const [scrolled, setScrolled] = useState(false);
  const myListIds = new Set(myList.map(m => m.id));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleMyList = (e: React.MouseEvent, movie: Movie) => {
    e.stopPropagation();
    toggleMyList(movie);
  };

  // Filter out empty categories
  const filledCategories = categories.filter(c => c.movies.length > 0);

  return (
    <motion.div
      className="min-h-screen bg-netflix-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header
        scrolled={scrolled}
        isAuthenticated={isAuthenticated}
        onLogout={onLogout}
        onLoginClick={onLoginClick}
      />

      <main>
        <HeroBanner
          featuredMovie={featuredMovie}
          onToggleMyList={toggleMyList}
          isInMyList={myListIds.has(featuredMovie.id)}
          onPlayClick={onPlayClick}
        />

        {/* Category label overlay */}
        <div className="relative z-10 -mt-20 md:-mt-32">
          <div className="px-4 md:px-12 mb-4">
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              {pageTitle}
            </h1>
            <div className="mt-1 w-16 h-1 bg-netflix-red rounded-full" />
          </div>

          <div className="space-y-2 md:space-y-4 pb-12">
            {filledCategories.map(category => (
              <MovieRow
                key={category.id}
                title={category.title}
                movies={category.movies}
                onToggleMyList={handleToggleMyList}
                myListIds={myListIds}
                onPlayClick={onPlayClick}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
}
