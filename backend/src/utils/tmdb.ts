import axios from 'axios';
import NodeCache from 'node-cache';
import logger from './logger';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

// Initialize cache: check period of 600s (10 mins)
const tmdbCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

export const fetchFromTMDB = async (endpoint: string, params: any = {}) => {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error('TMDB_API_KEY is not defined in environment variables');
  }

  // Create a unique cache key based on endpoint and stringified params
  const cacheKey = `tmdb_${endpoint}_${JSON.stringify(params)}`;
  const cachedData = tmdbCache.get(cacheKey);

  if (cachedData) {
    logger.info(`[TMDB Cache] Hit: ${endpoint}`);
    return cachedData;
  }

  try {
    const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
      params: {
        api_key: apiKey,
        ...params,
      },
    });

    const data = response.data;

    // Determine TTL based on the endpoint
    let ttl = 86400; // Default: 24 hours (details)
    if (endpoint.includes('/search/')) {
      ttl = 3600; // 1 hour for searches
    } else if (endpoint.includes('/trending/')) {
      ttl = 21600; // 6 hours for trending
    }

    tmdbCache.set(cacheKey, data, ttl);
    return data;
  } catch (error: any) {
    logger.error(`TMDB API Error (${endpoint}):`, { error: error.response?.data || error.message });
    throw new Error(error.response?.data?.status_message || 'Failed to fetch from TMDB');
  }
};

export const mapTMDBToContent = (item: any, type: 'movie' | 'tv') => {
  const genres = item.genres ? item.genres.map((g: any) => g.name).join(', ') : '';
  
  let duration = 0;
  if (type === 'movie') {
    duration = item.runtime || 0;
  } else if (item.episode_run_time && item.episode_run_time.length > 0) {
    duration = item.episode_run_time[0];
  }

  const casts = item.credits?.cast ? item.credits.cast.slice(0, 10).map((c: any) => ({
    name: c.name,
    role: c.character,
    image: c.profile_path ? `${IMAGE_BASE_URL}${c.profile_path}` : ''
  })) : [];

  return {
    tmdbId: item.id,
    title: item.title || item.name,
    description: item.overview,
    type: type === 'movie' ? 'movie' : 'series',
    posterUrl: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : '',
    backdropUrl: item.backdrop_path ? `${IMAGE_BASE_URL}${item.backdrop_path}` : '',
    rating: item.vote_average || 0,
    releaseYear: item.release_date ? new Date(item.release_date).getFullYear() : (item.first_air_date ? new Date(item.first_air_date).getFullYear() : null),
    genre: genres,
    duration: duration,
    casts: JSON.stringify(casts)
  };
};

const TMDB_GENRE_MAP: Record<string, number> = {
  'action': 28,
  'adventure': 12,
  'animation': 16,
  'comedy': 35,
  'crime': 80,
  'documentary': 99,
  'drama': 18,
  'family': 10751,
  'fantasy': 14,
  'history': 36,
  'horror': 27,
  'music': 10402,
  'mystery': 9648,
  'romance': 10749,
  'sci-fi': 878,
  'thriller': 53,
  'war': 10752,
  'western': 37,
  'superhero': 28,
  'sci fi': 878,
  'science fiction': 878,
};

const TMDB_TV_GENRE_MAP: Record<string, number> = {
  ...TMDB_GENRE_MAP,
  'action & adventure': 10759,
  'sci-fi & fantasy': 10765,
  'war & politics': 10768,
  'reality': 10764,
  'soap': 10766,
  'talk': 10767,
  'kids': 10762,
};

export const discoverTMDBByGenre = async (genreName: string, type: 'movie' | 'tv' = 'movie') => {
  const map = type === 'movie' ? TMDB_GENRE_MAP : TMDB_TV_GENRE_MAP;
  const genreId = map[genreName.toLowerCase()];

  if (!genreId) {
    return { results: [] };
  }

  const endpoint = `/discover/${type}`;
  return await fetchFromTMDB(endpoint, {
    with_genres: genreId,
    sort_by: 'popularity.desc',
    include_adult: false,
  });
};
