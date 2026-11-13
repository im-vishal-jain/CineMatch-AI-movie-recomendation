
import axios from "axios";

// ==========================================
// API CONFIGURATION
// ==========================================

const API_BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
});

// ==========================================
// API ERROR HANDLER
// ==========================================

const handleApiError = (error) => {
  if (error.response) {
    console.error(
      "API Error:",
      error.response.status,
      error.response.data
    );
  } else if (error.request) {
    console.error(
      "Backend is not responding. Check FastAPI server."
    );
  } else {
    console.error("Request Error:", error.message);
  }

  throw error;
};

// ==========================================
// GET MOVIE RECOMMENDATIONS
// ==========================================

export const getRecommendations = async (
  title,
  limit = null
) => {
  try {
    const response = await api.get("/movies/recommend", {
      params: {
        title,
        ...(limit !== null ? { limit } : {})
      }
    });

    return response.data;

  } catch (error) {
    return handleApiError(error);
  }
};

// ==========================================
// GET POPULAR MOVIES
// ==========================================

export const getPopularMovies = async (limit = 10) => {
  try {
    const response = await api.get("/movies/popular", {
      params: { limit }
    });

    return response.data;

  } catch (error) {
    return handleApiError(error);
  }
};

// ==========================================
// GET TOP RATED MOVIES
// ==========================================

export const getTopRatedMovies = async (limit = 10) => {
  try {
    const response = await api.get("/movies/top-rated", {
      params: { limit }
    });

    return response.data;

  } catch (error) {
    return handleApiError(error);
  }
};

// ==========================================
// SEARCH MOVIES
// ==========================================

export const searchMovies = async (query) => {
  try {
    const response = await api.get("/movies/search", {
      params: { query }
    });

    return response.data;

  } catch (error) {
    return handleApiError(error);
  }
};

// ==========================================
// GET MOVIE DETAILS BY ID
// ==========================================

export const getMovieDetails = async (movieId) => {
  try {
    const response = await api.get(`/movies/${movieId}`);

    return response.data;

  } catch (error) {
    return handleApiError(error);
  }
};

// ==========================================
// BACKEND HEALTH CHECK
// ==========================================

export const checkBackendHealth = async () => {
  try {
    const response = await axios.get(
      "http://127.0.0.1:8000/health",
      { timeout: 10000 }
    );

    return response.data;

  } catch (error) {
    return handleApiError(error);
  }
};

// ==========================================
// DEFAULT API EXPORT
// ==========================================

export default api;
