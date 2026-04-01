import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Movie } from '../lib/data';
import { useState, useEffect } from 'react';

interface VideoPlayerProps {
  movie: Movie | null;
  onClose: () => void;
}

export function VideoPlayer({ movie, onClose }: VideoPlayerProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (movie) {
      setLoading(true);
      // Disable scrolling when player is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [movie]);

  if (!movie) return null;

  // vidsrc.to embed URL
  const embedUrl = movie.type === 'tv' 
    ? `https://vidsrc.to/embed/tv/${movie.id}/1/1` 
    : `https://vidsrc.to/embed/movie/${movie.id}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-[210] p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-[205] bg-black">
            <Loader2 className="w-12 h-12 text-netflix-red animate-spin" />
          </div>
        )}

        {/* Video Iframe */}
        <div className="relative w-full h-full pt-16 md:pt-0">
          <iframe
            src={embedUrl}
            className="w-full h-full border-none"
            allowFullScreen
            allow="autoplay; encrypted-media"
            onLoad={() => setLoading(false)}
          />
        </div>

        {/* Instructions/Overlay */}
        <div className="absolute bottom-4 left-4 text-xs text-gray-500 pointer-events-none opacity-50">
          Playing: {movie.title} ({movie.year})
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
