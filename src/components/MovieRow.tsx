import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MovieCard } from './MovieCard';
import type { Movie } from '../lib/data';
import { motion } from 'framer-motion';

export function MovieRow({ 
  title, 
  movies, 
  onToggleMyList,
  myListIds,
  onPlayClick
}: { 
  title: string; 
  movies: Movie[]; 
  onToggleMyList: (e: React.MouseEvent, movie: Movie) => void;
  myListIds: Set<string>;
  onPlayClick?: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showButtons, setShowButtons] = useState({ left: false, right: false });
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowButtons({
        left: scrollLeft > 10,
        right: scrollLeft + clientWidth < scrollWidth - 10
      });
    }
  };

  useEffect(() => {
    setTimeout(checkScroll, 100);
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [movies]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -800 : 800;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isHovered) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scroll('left');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        scroll('right');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHovered]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsHovered(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  if (movies.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="movie-row relative py-4 md:py-6 group select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <h2 className="text-white text-lg md:text-xl lg:text-2xl font-semibold mb-3 md:mb-4 px-4 md:px-12">
        {title}
      </h2>
      
      <div className="relative">
        {/* Left Scroll Button */}
        {showButtons.left && (
          <button 
            className="scroll-btn left-0 md:left-0 z-10 absolute flex items-center justify-center top-0 bottom-0 my-auto"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
        )}

        {/* Movies Container */}
        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex gap-2 md:gap-4 overflow-x-auto hide-scrollbar px-4 md:px-12 py-4 -my-4 ${isDragging ? 'cursor-grabbing scroll-auto' : 'cursor-grab scroll-smooth'}`}
        >
          {movies.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onToggleMyList={onToggleMyList}
              isInMyList={myListIds.has(movie.id)}
              onPlay={onPlayClick}
            />
          ))}
        </div>

        {/* Right Scroll Button */}
        {showButtons.right && (
          <button 
            className="scroll-btn right-0 md:right-0 z-10 absolute flex items-center justify-center top-0 bottom-0 my-auto"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
