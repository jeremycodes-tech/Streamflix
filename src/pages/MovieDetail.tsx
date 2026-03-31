import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { tmdb } from '../lib/tmdb';
import type { Movie } from '../lib/data';
import { Play, Plus, Check, ArrowLeft, ThumbsUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function MovieDetail({
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const isInMyList = movie ? myList.some(m => m.id === movie.id) : false;

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Try searching by ID in TMDB
        // We first need to know if it's a 'movie' or 'tv'
        // For simplicity, we search both or use a hint from the URL/State if we have it
        // Or we can just use the search query if the ID is a string name
        const isTV = location.pathname.includes('/tv/') || id.startsWith('tv-');
        
        // Detailed fetch from TMDB
        const endpoint = isTV ? `/tv/${id.replace('tv-', '')}` : `/movie/${id}`;
        const data = await tmdb.fetchFromTMDB(endpoint, { append_to_response: 'similar,credits' });
        
        // Map to our Movie interface
        const mappedMovie: Movie = {
          id: String(data.id),
          title: data.title || data.name,
          poster: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
          backdrop: `https://image.tmdb.org/t/p/original${data.backdrop_path}`,
          rating: data.vote_average >= 8 ? 'TV-MA' : 'TV-14',
          year: (data.release_date || data.first_air_date || '').split('-')[0],
          duration: data.runtime ? `${data.runtime}m` : `${data.number_of_seasons} Seasons`,
          genres: data.genres.map((g: any) => g.name),
          description: data.overview,
          match: Math.round(data.vote_average * 10),
          type: isTV ? 'tv' : 'movie'
        };

        setMovie(mappedMovie);
        
        if (data.similar && data.similar.results) {
           // map similar results
           const similar = data.similar.results.slice(0, 6).map((item: any) => ({
             id: String(item.id),
             title: item.title || item.name,
             poster: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
             backdrop: `https://image.tmdb.org/t/p/original${item.backdrop_path}`,
             match: Math.round(item.vote_average * 10),
             type: isTV ? 'tv' : 'movie'
           }));
           setSimilarMovies(similar);
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to load movie details", err);
        setLoading(false);
      }
    };
    loadDetails();
  }, [id, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-netflix-red"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-netflix-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Content not found</h2>
          <Button onClick={() => navigate('/')} className="bg-netflix-red">Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-netflix-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header scrolled={true} isAuthenticated={isAuthenticated} onLogout={onLogout} onLoginClick={onLoginClick} />

      <div className="relative min-h-[85vh] w-full flex flex-col justify-end pt-32 pb-12">
        <div className="absolute inset-0">
          <motion.img 
            layoutId={`movie-card-${movie.id}`}
            src={movie.backdrop || movie.poster} 
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-netflix-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/40 to-transparent" />
          <div className="absolute inset-0 bg-netflix-black/20" />
        </div>

        <button 
          onClick={() => window.history.length > 2 ? navigate(-1) : navigate('/')}
          className="fixed top-24 left-4 md:left-12 flex items-center gap-2 text-white hover:text-white transition-transform z-[60] group hover:-translate-x-1"
        >
          <div className="bg-black/60 border border-white/20 p-2 md:p-3 rounded-full backdrop-blur-xl group-hover:bg-white/20 transition-colors shadow-2xl">
            <ArrowLeft className="w-6 h-6" />
          </div>
          <span className="font-semibold text-lg hidden sm:block drop-shadow-lg">Back</span>
        </button>

        <div className="relative z-20 px-4 md:px-12 text-white flex flex-col items-start max-w-4xl mt-auto">
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 uppercase drop-shadow-2xl"
          >
            {movie.title}
          </motion.h1>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 text-base md:text-lg mb-6 drop-shadow-lg"
          >
            <span className="text-green-400 font-bold">{movie.match}% Match</span>
            <span>{movie.year}</span>
            <span className="border border-white/40 px-2 py-0.5 rounded text-sm bg-black/40 backdrop-blur-sm">{movie.rating}</span>
            <span>{movie.duration}</span>
            <span className="flex items-center gap-2 text-white/80 border-l border-white/30 pl-4">
              {movie.genres.join(' • ')}
            </span>
          </motion.div>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl drop-shadow-md mb-8"
          >
            {movie.description}
          </motion.p>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4"
          >
            <Button 
              className="bg-white text-black hover:bg-white/90 px-8 py-6 text-xl font-bold rounded flex items-center gap-3 hover:scale-105 transition-transform shadow-2xl"
              onClick={onPlayClick}
            >
              <Play className="w-6 h-6 fill-black" />
              Play
            </Button>
            <Button 
              variant="outline"
              className="bg-black/40 border-white/20 text-white hover:bg-white/10 px-8 py-6 text-xl font-semibold rounded flex items-center gap-3 backdrop-blur-md hover:scale-105 transition-transform"
              onClick={() => toggleMyList(movie)}
            >
              {isInMyList ? <Check className="w-6 h-6 text-green-400" /> : <Plus className="w-6 h-6" />}
              My List
            </Button>
            <button className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center text-white hover:border-white hover:scale-110 transition-all bg-black/40 backdrop-blur-md">
              <ThumbsUp className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>

      <div className="px-4 md:px-12 py-12 md:py-24 max-w-7xl mx-auto">
        {/* More Like This */}
        <div className="">
          <h3 className="text-2xl font-semibold text-white mb-8 border-b border-white/10 pb-4">More Like This</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {similarMovies.map((similarMovie, idx) => (
              <motion.div 
                key={similarMovie.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="cursor-pointer group relative overflow-hidden rounded-lg bg-gray-900 shadow-xl"
                onClick={() => navigate(`/movie/${similarMovie.id}`)}
              >
                <img 
                  src={similarMovie.backdrop || similarMovie.poster}
                  alt={similarMovie.title}
                  className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-black/20 to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 p-4 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <h4 className="text-white font-semibold text-sm md:text-base drop-shadow-md mb-1">{similarMovie.title}</h4>
                  <div className="text-xs text-green-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md">
                    {similarMovie.match}% Match
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </motion.div>
  );
}
