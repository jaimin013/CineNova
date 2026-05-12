import axios from 'axios';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

export const fetchFromTMDB = async (endpoint: string, params: any = {}) => {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error('TMDB_API_KEY is not defined in environment variables');
  }

  try {
    const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
      params: {
        api_key: apiKey,
        ...params,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(`TMDB API Error (${endpoint}):`, error.response?.data || error.message);
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
