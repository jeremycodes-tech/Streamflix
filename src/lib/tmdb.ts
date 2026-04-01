const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  overview: string;
  genre_ids: number[];
  media_type?: 'movie' | 'tv';
}

const GENRE_MAP: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
  10759: 'Action & Adventure', 10765: 'Sci-Fi & Fantasy', 10766: 'Soap',
  10767: 'Talk', 10768: 'War & Politics'
};

function mapTMDBToMovie(item: TMDBMovie, type?: 'movie' | 'tv'): any {
  return {
    id: String(item.id),
    title: item.title || item.name || 'Untitled',
    poster: `${IMAGE_BASE_URL}/w500${item.poster_path}`,
    backdrop: `${IMAGE_BASE_URL}/original${item.backdrop_path}`,
    rating: item.vote_average >= 8 ? 'TV-MA' : 'TV-14', // Fallback rating
    year: (item.release_date || item.first_air_date || '').split('-')[0],
    duration: type === 'tv' ? 'Series' : '2h 10m', // Fallback duration
    genres: item.genre_ids.map(id => GENRE_MAP[id]).filter(Boolean).slice(0, 3),
    description: item.overview,
    match: Math.round(item.vote_average * 10),
    type: type || item.media_type || 'movie',
    isNew: new Date(item.release_date || item.first_air_date || '').getFullYear() >= 2024
  };
}

export async function fetchFromTMDB(endpoint: string, params: Record<string, string> = {}) {
  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    language: 'en-US',
    ...params
  });

  const response = await fetch(`${BASE_URL}${endpoint}?${queryParams}`);
  if (!response.ok) throw new Error(`TMDB API Error: ${response.statusText}`);
  return response.json();
}

export const tmdb = {
  getTrending: async () => {
    const data = await fetchFromTMDB('/trending/all/day');
    return data.results.map((item: TMDBMovie) => mapTMDBToMovie(item));
  },
  getMoviesByCategory: async (category: string) => {
    const endpoints: Record<string, string> = {
      popular: '/movie/popular',
      top_rated: '/movie/top_rated',
      upcoming: '/movie/upcoming',
      now_playing: '/movie/now_playing'
    };
    const data = await fetchFromTMDB(endpoints[category] || '/movie/popular');
    return data.results.map((item: TMDBMovie) => mapTMDBToMovie(item, 'movie'));
  },
  getTVByCategory: async (category: string) => {
    const endpoints: Record<string, string> = {
      popular: '/tv/popular',
      top_rated: '/tv/top_rated',
      on_the_air: '/tv/on_the_air'
    };
    const data = await fetchFromTMDB(endpoints[category] || '/tv/popular');
    return data.results.map((item: TMDBMovie) => mapTMDBToMovie(item, 'tv'));
  },
  getMoviesByGenre: async (genreId: number) => {
    const data = await fetchFromTMDB('/discover/movie', { with_genres: String(genreId) });
    return data.results.map((item: TMDBMovie) => mapTMDBToMovie(item, 'movie'));
  },
  getTVByGenre: async (genreId: number) => {
    const data = await fetchFromTMDB('/discover/tv', { with_genres: String(genreId) });
    return data.results.map((item: TMDBMovie) => mapTMDBToMovie(item, 'tv'));
  },
  getAnime: async () => {
    const data = await fetchFromTMDB('/discover/tv', { 
      with_genres: '16', 
      with_original_language: 'ja',
      sort_by: 'popularity.desc'
    });
    return data.results.map((item: TMDBMovie) => mapTMDBToMovie(item, 'tv'));
  },
  search: async (query: string) => {
    const data = await fetchFromTMDB('/search/multi', { query });
    return data.results
      .filter((item: any) => item.media_type !== 'person')
      .map((item: TMDBMovie) => mapTMDBToMovie(item));
  },
  fetchFromTMDB
};
