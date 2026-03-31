import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { HeroBanner } from '../components/HeroBanner';
import { MovieRow } from '../components/MovieRow';
import { Footer } from '../components/Footer';
import { tmdb } from '../lib/tmdb';
import type { Movie } from '../lib/data';
import { motion } from 'framer-motion';

interface Category {
  id: string;
  title: string;
  movies: Movie[];
}

interface BrowseCategoryProps {
  pageTitle: string;
  type: 'movie' | 'tv' | 'popular';
  myList: Movie[];
  toggleMyList: (movie: Movie) => void;
  onPlayClick: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
  onLoginClick: () => void;
}

export function BrowseCategory({
  pageTitle,
  type,
  myList,
  toggleMyList,
  onPlayClick,
  isAuthenticated,
  onLogout,
  onLoginClick,
}: BrowseCategoryProps) {
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  const myListIds = new Set(myList.map(m => m.id));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (type === 'movie') {
          const [popular, topRated, action, scifi] = await Promise.all([
            tmdb.getMoviesByCategory('popular'),
            tmdb.getMoviesByCategory('top_rated'),
            tmdb.getMoviesByGenre(28),
            tmdb.getMoviesByGenre(878)
          ]);
          setFeaturedMovie(popular[0]);
          setCategories([
            { id: 'popular', title: 'Popular Movies', movies: popular },
            { id: 'top_rated', title: 'Top Rated', movies: topRated },
            { id: 'action', title: 'Action Hits', movies: action },
            { id: 'scifi', title: 'Sci-Fi & Fantasy', movies: scifi }
          ]);
        } else if (type === 'tv') {
          const [popular, topRated, crime, animation] = await Promise.all([
            tmdb.getTVByCategory('popular'),
            tmdb.getTVByCategory('top_rated'),
            tmdb.getTVByGenre(80),
            tmdb.getTVByGenre(16)
          ]);
          setFeaturedMovie(popular[0]);
          setCategories([
            { id: 'popular', title: 'Popular Series', movies: popular },
            { id: 'top_rated', title: 'Critically Acclaimed', movies: topRated },
            { id: 'crime', title: 'Crime & Investigation', movies: crime },
            { id: 'animation', title: 'Animated Universe', movies: animation }
          ]);
        } else {
          // New & Popular
          const [trending, nowPlaying, airing] = await Promise.all([
            tmdb.getTrending(),
            tmdb.getMoviesByCategory('now_playing'),
            tmdb.getTVByCategory('on_the_air')
          ]);
          setFeaturedMovie(trending[0]);
          setCategories([
            { id: 'trending', title: 'Global Trending Today', movies: trending },
            { id: 'now_playing', title: 'Recently Released Movies', movies: nowPlaying },
            { id: 'airing', title: 'Latest TV Episodes', movies: airing }
          ]);
        }
      } catch (err) {
        console.error("BrowseCategory fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [type]);

  const handleToggleMyList = (e: React.MouseEvent, movie: Movie) => {
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
      <Header
        scrolled={scrolled}
        isAuthenticated={isAuthenticated}
        onLogout={onLogout}
        onLoginClick={onLoginClick}
      />

      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-netflix-red"></div>
        </div>
      ) : (
        <main>
          {featuredMovie && (
            <HeroBanner
              featuredMovie={featuredMovie}
              onToggleMyList={toggleMyList}
              isInMyList={myListIds.has(featuredMovie.id)}
              onPlayClick={onPlayClick}
            />
          )}

          <div className="relative z-10 -mt-20 md:-mt-32">
            <div className="px-4 md:px-12 mb-4">
              <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                {pageTitle}
              </h1>
              <div className="mt-1 w-16 h-1 bg-netflix-red rounded-full" />
            </div>

            <div className="space-y-2 md:space-y-4 pb-12">
              {categories.map(category => (
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
      )}

      <Footer />
    </motion.div>
  );
}
