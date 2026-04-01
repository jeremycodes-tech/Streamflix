import { useState } from 'react';
import { Play, Info, Plus, Check, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import type { Movie } from '../lib/data';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function HeroBanner({ 
  featuredMovie,
  onToggleMyList,
  isInMyList,
  onPlayClick,
}: { 
  featuredMovie: Movie;
  onToggleMyList: (movie: Movie) => void;
  isInMyList: boolean;
  onPlayClick?: () => void;
}) {
  const [muted, setMuted] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
      {/* Background Image */}
      <motion.div 
        layoutId={`movie-card-${featuredMovie.id}`}
        className="absolute inset-0 bg-cover bg-no-repeat transition-transform duration-1000 origin-center"
        style={{ 
          backgroundImage: `url(${featuredMovie.backdrop || featuredMovie.poster})`,
          backgroundPosition: featuredMovie.backdrop ? 'center center' : 'center 15%' 
        }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-netflix-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-white/5 via-transparent to-transparent opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="absolute top-20 left-0 right-0 bottom-0 flex flex-col justify-end pb-16 md:pb-24 lg:pb-32 px-4 md:px-12 hero-content z-10">
        <div className="max-w-2xl space-y-4 md:space-y-6 lg:space-y-8">
          {/* Movie Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white text-shadow leading-none tracking-tighter uppercase"
          >
            {featuredMovie.title}
          </motion.h1>

          {/* Meta info */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3 text-sm md:text-base"
          >
            <span className="text-green-400 font-semibold">{featuredMovie.match}% Match</span>
            <span className="text-gray-300">{featuredMovie.year}</span>
            <span className="border border-gray-500 px-1 text-xs">{featuredMovie.rating}</span>
            <span className="text-gray-300">{featuredMovie.duration}</span>
          </motion.div>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/90 text-sm md:text-lg line-clamp-3 max-w-xl"
          >
            {featuredMovie.description}
          </motion.p>

          {/* Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-3 md:gap-4 flex-wrap"
          >
            <Button 
              className="bg-white text-black hover:bg-white/90 px-6 md:px-10 py-5 md:py-7 text-base md:text-xl font-bold rounded flex items-center gap-2 play-btn-glint shadow-xl hover:scale-105 transition-transform"
              onClick={onPlayClick}
            >
              <Play className="w-5 h-5 md:w-7 md:h-7 fill-black text-black" />
              Play Now
            </Button>
            <Button 
              variant="secondary"
              className="bg-gray-500/40 text-white hover:bg-gray-500/60 px-6 md:px-10 py-5 md:py-7 text-base md:text-xl font-bold rounded flex items-center gap-2 backdrop-blur-md border border-white/10 hover:scale-105 transition-transform"
              onClick={() => navigate(`/movie/${featuredMovie.id}`)}
            >
              <Info className="w-5 h-5 md:w-7 md:h-7" />
              More Info
            </Button>
            <button 
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/50 flex items-center justify-center text-white hover:border-white hover:scale-110 transition-all bg-black/20"
              onClick={() => onToggleMyList(featuredMovie)}
            >
              {isInMyList ? <Check className="w-5 h-5 text-green-400" /> : <Plus className="w-5 h-5" />}
            </button>
            <button 
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/50 flex items-center justify-center text-white hover:border-white hover:scale-110 transition-all bg-black/20"
              onClick={() => setMuted(!muted)}
            >
              {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
