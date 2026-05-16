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
      cache.set(identifier, response.data)
      return response.data
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
      const results = response.data.Search
      cache.set(identifier, results)
      return results
    }
    return []
  } catch (error) {
    logger.error(`Error searching OMDB for ${query}:`, { error });
    return []
  }
}
