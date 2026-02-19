import { TMDB_API_KEY, TMDB_BASE_URL } from '../config/constants';

/**
 * reliable fetch wrapper for TMDB API
 * @param {string} endpoint 
 * @param {object} params 
 * @returns {Promise<any>}
 */
export const fetchTMDB = async (endpoint, params = {}) => {
    if (!TMDB_API_KEY) {
        console.error("TMDB API Key is missing!");
        return null;
    }

    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', TMDB_API_KEY);
    url.searchParams.append('language', 'en-US');

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    try {
        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Fetch TMDB Error:", error);
        return null;
    }
};
