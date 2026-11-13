
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Star,
  Sparkles,
  LoaderCircle,
  Clapperboard,
  Film,
  X,
  ArrowRight
} from "lucide-react";

import { getRecommendations } from "../../services/api";


const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export default function Discover({
  initialQuery = "",
  onMovieSelect
}) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);

  // ==========================================
  // INITIAL SEARCH
  // ==========================================

  useEffect(() => {
    setQuery(initialQuery);

    if (initialQuery.trim()) {
      recommend(initialQuery);
    }
  }, [initialQuery]);

  // ==========================================
  // RECOMMEND MOVIES
  // ==========================================

  const recommend = async (movieTitle) => {
    if (!movieTitle || !movieTitle.trim()) return;

    setLoading(true);
    setError("");
    setMovies([]);
    setSelectedMovie("");
    setVisibleCount(20);

    try {
      // Fetch all relevant recommendations
      const data = await getRecommendations(
        movieTitle.trim()
      );

      setSelectedMovie(data.searched_movie || movieTitle);
      setMovies(data.recommendations || []);

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to fetch recommendations. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SEARCH SUBMIT
  // ==========================================

  const handleSubmit = (e) => {
    e.preventDefault();
    recommend(query);
  };

  // ==========================================
  // CLEAR SEARCH
  // ==========================================

  const clearSearch = () => {
    setQuery("");
    setMovies([]);
    setSelectedMovie("");
    setError("");
    setVisibleCount(20);
  };

  // ==========================================
  // POSTER URL
  // ==========================================

  const getPosterUrl = (movie) => {
    if (movie?.poster_url) {
      return movie.poster_url;
    }

    if (!movie?.poster_path) {
      return null;
    }

    if (movie.poster_path.startsWith("http")) {
      return movie.poster_path;
    }

    return `${TMDB_IMAGE_BASE}${movie.poster_path}`;
  };

  // ==========================================
  // PARSE GENRES
  // ==========================================

  const getGenres = (genres) => {
    if (!genres) return [];

    if (Array.isArray(genres)) {
      return genres
        .map((genre) =>
          typeof genre === "object"
            ? genre?.name
            : genre
        )
        .filter(Boolean);
    }

    if (typeof genres === "string") {
      try {
        const parsed = JSON.parse(genres);

        if (Array.isArray(parsed)) {
          return parsed
            .map((genre) =>
              typeof genre === "object"
                ? genre?.name
                : genre
            )
            .filter(Boolean);
        }
      } catch {
        // Try Python-style list or comma-separated genres
      }

      try {
        const parsed = genres.replace(/'/g, '"');
        const result = JSON.parse(parsed);

        if (Array.isArray(result)) {
          return result
            .map((genre) =>
              typeof genre === "object"
                ? genre?.name
                : genre
            )
            .filter(Boolean);
        }
      } catch {
        return genres
          .replace(/[\[\]']/g, "")
          .split(/[,|]/)
          .map((genre) => genre.trim())
          .filter(Boolean);
      }
    }

    return [];
  };

  // ==========================================
  // MOVIE DETAILS NAVIGATION
  // ==========================================

  const handleMovieClick = (movie) => {
    if (onMovieSelect) {
      onMovieSelect(movie);
    }
  };

  const handleCardKeyDown = (e, movie) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleMovieClick(movie);
    }
  };

  // ==========================================
  // LOAD MORE
  // ==========================================

  const handleLoadMore = () => {
    setVisibleCount((previous) =>
      previous + 20
    );
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="discover-page">

      {/* HEADER */}

      <div className="discover-heading">

        <div>
          <span className="discover-eyebrow">
            <Sparkles size={15} />
            CINEMATCH AI ORIGINAL
          </span>

          <h1>Explore Movies</h1>

          <p>
            Discover your next favourite movie with
            intelligent ML recommendations.
          </p>
        </div>

        <div className="discover-header-icon">
          <Clapperboard size={35} />
        </div>

      </div>

      {/* SEARCH */}

      <form
        className="discover-search"
        onSubmit={handleSubmit}
      >
        <Search size={22} />

        <input
          type="text"
          placeholder="Search any movie... e.g. Spider-Man"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {query && (
          <button
            type="button"
            className="clear-search"
            onClick={clearSearch}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}

        <button
          type="submit"
          className="discover-search-btn"
          disabled={loading || !query.trim()}
        >
          {loading ? "Searching..." : "Discover"}
        </button>

      </form>

      <div className="discover-hint">
        Popular searches: Avatar · Inception · Batman · Titanic
      </div>

      {/* LOADING */}

      <AnimatePresence>
        {loading && (
          <motion.div
            className="discover-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoaderCircle
              size={38}
              className="loading-icon"
            />

            <h3>
              Finding your next favourite movie
            </h3>

            <p>
              Our machine learning engine is analyzing
              movie similarities...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ERROR */}

      {error && !loading && (
        <motion.div
          className="discover-error"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Film size={24} />

          <div>
            <h3>Movie not found</h3>
            <p>{error}</p>
          </div>
        </motion.div>
      )}

      {/* RESULTS */}

      {!loading && movies.length > 0 && (
        <motion.section
          className="recommendation-results"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >

          {/* RESULTS HEADER */}

          <div className="results-heading">

            <div>
              <span className="results-label">
                YOUR PERSONALIZED RECOMMENDATIONS
              </span>

              <h2>
                Because you searched for{" "}
                <span>{selectedMovie}</span>
              </h2>

              <p>
                Discover movies selected by your CineMatch
                ML recommendation engine.
              </p>
            </div>

            <div className="results-count">
              {movies.length} Movies
            </div>

          </div>

          {/* MOVIE GRID */}

          <div className="recommendation-grid">

            {movies
              .slice(0, visibleCount)
              .map((movie, index) => {

                const poster = getPosterUrl(movie);
                const genres = getGenres(movie.genres);

                return (
                  <motion.article
                    key={movie.id || index}
                    className="recommendation-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: (index % 20) * 0.04
                    }}
                    whileHover={{ y: -5 }}
                    onClick={() => handleMovieClick(movie)}
                    onKeyDown={(e) =>
                      handleCardKeyDown(e, movie)
                    }
                    role="button"
                    tabIndex={0}
                    aria-label={`View details for ${movie.title}`}
                  >

                    {/* POSTER */}

                    <div className="cm-poster">

                      {poster ? (
                        <img
                          className="cm-poster-image"
                          src={poster}
                          alt={movie.title}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="cm-poster-placeholder">
                          <Clapperboard size={42} />
                          <span>Poster unavailable</span>
                        </div>
                      )}

                    </div>

                    {/* MOVIE INFORMATION */}

                    <div className="cm-movie-info">

                      <h3
                        className="cm-movie-title"
                        title={movie.title}
                      >
                        {movie.title}
                      </h3>

                      {/* RATING */}

                      <div className="cm-rating">

                        <Star
                          size={15}
                          fill="currentColor"
                        />

                        <span>
                          {Number(
                            movie.rating || 0
                          ).toFixed(1)}
                        </span>

                      </div>

                      {/* GENRES */}

                      <div className="cm-genres">

                        {genres.length > 0 ? (
                          genres
                            .slice(0, 3)
                            .map((genre, genreIndex) => (
                              <span
                                className="cm-genre-tag"
                                key={`${genre}-${genreIndex}`}
                              >
                                {genre}
                              </span>
                            ))
                        ) : (
                          <span className="cm-genre-unavailable">
                            Genre unavailable
                          </span>
                        )}

                      </div>

                    </div>

                  </motion.article>
                );
              })}

          </div>

          {/* LOAD MORE */}

          {visibleCount < movies.length && (
            <div className="load-more-container">

              <p>
                Showing {Math.min(visibleCount, movies.length)}
                {" "}of {movies.length} movies
              </p>

              <button
                type="button"
                className="load-more-btn"
                onClick={handleLoadMore}
              >
                Load More Movies
                <ArrowRight size={17} />
              </button>

            </div>
          )}

          {visibleCount >= movies.length && (
            <p className="all-movies-loaded">
              You've explored all {movies.length} recommendations.
            </p>
          )}

        </motion.section>
      )}

      {/* EMPTY STATE */}

      {!loading && !error && movies.length === 0 && (
        <motion.div
          className="discover-empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >

          <div className="empty-icon">
            <Clapperboard size={40} />
          </div>

          <h3>Millions of stories. One search.</h3>

          <p>
            Enter a movie title and let CineMatch AI
            discover movies you might love.
          </p>

        </motion.div>
      )}

    </div>
  );
}
