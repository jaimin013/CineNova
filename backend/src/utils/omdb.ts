import axios from 'axios'
import logger from './logger'

const OMDB_API_KEY = process.env.OMDB_API_KEY
const BASE_URL = 'http://www.omdbapi.com/'

// Simple in-memory cache
const cache = new Map<string, any>()

export const fetchOMDBData = async (title: string, type: 'movie' | 'series' = 'movie') => {
  if (!OMDB_API_KEY) {
    logger.error('OMDB_API_KEY is not defined in environment variables');
    return null
  }

  const identifier = `${title}-${type}`.toLowerCase()
  if (cache.has(identifier)) {
    logger.info(`[OMDB Cache] Hit: ${identifier}`);
    return cache.get(identifier)
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        t: title,
        type: type === 'series' ? 'series' : 'movie',
        apikey: OMDB_API_KEY,
      },
    })

    if (response.data.Response === 'True') {
      const mappedData = mapOMDBDetailToContent(response.data)
      cache.set(identifier, mappedData)
      return mappedData
    }
    return null
  } catch (error) {
    logger.error(`Error fetching OMDB data for ${identifier}:`, { error });
    return null
  }
}

export const searchOMDB = async (query: string, type: 'movie' | 'series' = 'movie') => {
  if (!OMDB_API_KEY) {
    logger.error('OMDB_API_KEY is not defined in environment variables');
    return []
  }

  const identifier = `search-${query}-${type}`.toLowerCase()
  if (cache.has(identifier)) {
    logger.info(`[OMDB Cache] Search Hit: ${query}`);
    return cache.get(identifier)
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        s: query,
        type: type === 'series' ? 'series' : 'movie',
        apikey: OMDB_API_KEY,
      },
    })

    if (response.data.Response === 'True') {
      const results = response.data.Search.map(mapOMDBSearchToContent)
      cache.set(identifier, results)
      return results
    }
    return []
  } catch (error) {
    logger.error(`Error searching OMDB for ${query}:`, { error });
    return []
  }
}

export const mapOMDBSearchToContent = (item: any) => {
  return {
    tmdbId: item.imdbID,
    title: item.Title,
    type: item.Type === 'series' ? 'series' : 'movie',
    posterUrl: item.Poster && item.Poster !== 'N/A' ? item.Poster : '',
    releaseYear: item.Year ? parseInt(item.Year) : null,
    rating: 0,
    description: '',
  }
}

export const mapOMDBDetailToContent = (item: any) => {
  const duration = item.Runtime && item.Runtime !== 'N/A' ? parseInt(item.Runtime.replace(/[^0-9]/g, '')) : 0
  const casts = item.Actors && item.Actors !== 'N/A' ? item.Actors.split(',').map((c: string) => ({
    name: c.trim(),
    role: '',
    image: ''
  })) : []

  return {
    tmdbId: item.imdbID,
    title: item.Title,
    description: item.Plot && item.Plot !== 'N/A' ? item.Plot : '',
    type: item.Type === 'series' ? 'series' : 'movie',
    posterUrl: item.Poster && item.Poster !== 'N/A' ? item.Poster : '',
    backdropUrl: item.Poster && item.Poster !== 'N/A' ? item.Poster : '', // OMDB doesn't have backdrops, use poster
    rating: item.imdbRating && item.imdbRating !== 'N/A' ? parseFloat(item.imdbRating) : 0,
    releaseYear: item.Year && item.Year !== 'N/A' ? parseInt(item.Year.substring(0, 4)) : null,
    genre: item.Genre && item.Genre !== 'N/A' ? item.Genre : '',
    duration: duration || 0,
    casts: JSON.stringify(casts)
  }
}
