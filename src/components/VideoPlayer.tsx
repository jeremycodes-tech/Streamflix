import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Movie } from '../lib/data';
import { useState, useEffect } from 'react';
import { tmdb } from '../lib/tmdb';

interface VideoPlayerProps {
  movie: Movie | null;
  onClose: () => void;
}

export function VideoPlayer({ movie: propMovie, onClose }: VideoPlayerProps) {
  const [loading, setLoading] = useState(true);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [tvData, setTvData] = useState<{ seasons: any[] } | null>(null);
  const [movie, setMovie] = useState<Movie | null>(propMovie);

  useEffect(() => {
    if (movie) {
      setLoading(true);
      setSeason(1);
      setEpisode(1);
      
      if (movie.type === 'tv') {
        tmdb.fetchFromTMDB(`/tv/${movie.id}`).then((data: any) => {
          setTvData(data);
        });
      }

      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setTvData(null);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [movie]);

  if (!movie) return null;

  // vidsrc.to embed URL
  const embedUrl = movie.type === 'tv' 
    ? `https://vidsrc.to/embed/tv/${movie.id}/${season}/${episode}` 
    : `https://vidsrc.to/embed/movie/${movie.id}`;

  const currentSeasonData = tvData?.seasons?.find(s => s.season_number === season);
  const episodeCount = currentSeasonData?.episode_count || 20; // fallback

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black"
      >
        {/* Header Controls */}
        <div className="absolute top-0 left-0 right-0 z-[210] p-6 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-6">
            <h2 className="text-white text-xl font-bold font-netflix drop-shadow-md">
              {movie.title}
            </h2>
            
            {movie.type === 'tv' && tvData && (
              <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded border border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm uppercase font-semibold">Season</span>
                  <select 
                    value={season} 
                    onChange={(e) => {
                      setSeason(Number(e.target.value));
                      setEpisode(1);
                      setLoading(true);
                    }}
                    className="bg-transparent text-white font-bold outline-none cursor-pointer"
                  >
                    {tvData.seasons.filter(s => s.season_number > 0).map(s => (
                      <option key={s.id} value={s.season_number} className="bg-netflix-black">
                        {s.season_number}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="w-px h-4 bg-white/20" />
                
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm uppercase font-semibold">Episode</span>
                  <select 
                    value={episode} 
                    onChange={(e) => {
                      setEpisode(Number(e.target.value));
                      setLoading(true);
                    }}
                    className="bg-transparent text-white font-bold outline-none cursor-pointer"
                  >
                    {Array.from({ length: episodeCount }, (_, i) => i + 1).map(ep => (
                      <option key={ep} value={ep} className="bg-netflix-black">
                        {ep}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-[205] bg-black">
            <Loader2 className="w-12 h-12 text-netflix-red animate-spin" />
          </div>
        )}

        {/* Video Iframe */}
        <div className="relative w-full h-full">
          <iframe
            key={`${movie.id}-${season}-${episode}`}
            src={embedUrl}
            className="w-full h-full border-none"
            allowFullScreen
            allow="autoplay; encrypted-media"
            onLoad={() => setLoading(false)}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
