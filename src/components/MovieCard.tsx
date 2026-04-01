import React from 'react';
import { Play, Plus, ThumbsUp, Check } from 'lucide-react';
import type { Movie } from '../lib/data';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function MovieCard({ 
  movie, 
  onToggleMyList,
  isInMyList,
  onPlay
}: { 
  movie: Movie; 
  onToggleMyList: (e: React.MouseEvent, movie: Movie) => void;
  isInMyList: boolean;
  onPlay?: (movie: Movie) => void;
}) {
  const navigate = useNavigate();

  const lastTap = React.useRef<number>(0);

  const handleCardClick = () => {
    // Detect if the device is a touch screen
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) {
      const now = Date.now();
      if (now - lastTap.current < 300) {
        // Double tap
        navigate(`/movie/${movie.id}`);
      }
      lastTap.current = now;
    } else {
      navigate(`/movie/${movie.id}`);
    }
  };

  return (
    <motion.div 
      className="movie-card relative flex-shrink-0 w-[140px] md:w-[200px] lg:w-[240px] cursor-pointer rounded-md overflow-hidden group"
      onClick={handleCardClick}
      layoutId={`movie-card-${movie.id}`}
      whileHover={{ scale: 1.05, zIndex: 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <img 
        src={movie.poster} 
        alt={movie.title}
        className="w-full aspect-[2/3] object-cover rounded-md"
      />
      
      {/* Hover Overlay */}
      <div className="absolute inset-0 hover-overlay opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out flex flex-col justify-end p-3 rounded-md">
        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">{movie.title}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-200 mb-2">
          <span className="text-lime-400 font-semibold">{movie.match}%</span>
          <span>{movie.duration}</span>
          <span className="border border-gray-400 px-1">{movie.rating}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-white/90 hover:scale-110 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              onPlay && onPlay(movie);
            }}
          >
            <Play className="w-4 h-4 fill-black text-black" />
          </button>
          <button 
            className="w-9 h-9 rounded-full border border-gray-400 flex items-center justify-center text-white hover:border-white hover-icon-pulse"
            onClick={(e) => {
              e.stopPropagation();
              onToggleMyList(e, movie);
            }}
          >
            {isInMyList ? <Check className="w-4 h-4 text-green-400" /> : <Plus className="w-4 h-4" />}
          </button>
          <button 
            className="w-9 h-9 rounded-full border border-gray-400 flex items-center justify-center text-white hover:border-white hover-icon-pulse"
            onClick={(e) => e.stopPropagation()}
          >
            <ThumbsUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
