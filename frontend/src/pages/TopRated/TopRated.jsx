
import { useEffect, useState } from "react";
import { Star, Trophy, RefreshCw, Film } from "lucide-react";
import { getTopRatedMovies } from "../../services/api";
import "./TopRated.css";

function parseGenres(value) {
  if (Array.isArray(value)) {
    return value.map((genre) =>
      typeof genre === "object" ? genre.name : genre
    );
  }

  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map((genre) =>
        typeof genre === "object" ? genre.name : genre
      );
    }
  } catch {
    return String(value)
      .split(",")
      .map((genre) => genre.trim())
      .filter(Boolean);
  }

  return [];
}

function TopRated({ onMovieSelect }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTopRatedMovies = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getTopRatedMovies(50);

      const movieList = Array.isArray(response)
        ? response
        : response?.movies || response?.results || [];

      setMovies(movieList);
    } catch (err) {
      console.error("Top Rated API Error:", err);
      setError(
        err.response?.data?.detail ||
        "Unable to load top rated movies. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopRatedMovies();
  }, []);

  return (
    <main className="top-rated-page">
      <section className="top-rated-hero">
        <div className="top-rated-hero-content">
          <span className="top-rated-eyebrow">
            <Trophy size={15} /> CINEMATCH COLLECTION
          </span>

          <h1>
            Top Rated <span>Movies</span>
          </h1>

          <p>
            Explore the highest-rated movies from our collection.
            Discover stories loved by movie fans.
          </p>

          <div className="top-rated-stats">
            <div>
              <strong>{movies.length}</strong>
              <span>Movies Loaded</span>
            </div>
            <div>
              <strong>4.0+</strong>
              <span>Rating Focus</span>
            </div>
          </div>
        </div>
      </section>

      <section className="top-rated-content">
        <div className="top-rated-heading">
          <div>
            <span className="top-rated-eyebrow">BEST OF CINEMA</span>
            <h2>Audience Favorites</h2>
          </div>

          <button
            className="top-rated-refresh"
            onClick={fetchTopRatedMovies}
            disabled={loading}
            title="Refresh movies"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {loading && (
          <div className="top-rated-state">
            <div className="top-rated-spinner" />
            <p>Loading top rated movies...</p>
          </div>
        )}

        {!loading && error && (
          <div className="top-rated-state">
            <Film size={35} />
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button onClick={fetchTopRatedMovies}>Try Again</button>
          </div>
        )}

        {!loading && !error && movies.length === 0 && (
          <div className="top-rated-state">
            <Film size={35} />
            <h3>No movies found</h3>
            <p>There are no top-rated movies available right now.</p>
          </div>
        )}

        {!loading && !error && movies.length > 0 && (
          <div className="top-rated-grid">
            {movies.map((movie, index) => {
              const genres = parseGenres(movie.genres);
              const poster =
                movie.poster_url ||
                movie.poster_path ||
                movie.poster;

              return (
                <button
                  className="top-rated-card"
                  key={movie.id ?? `${movie.title}-${index}`}
                  onClick={() => onMovieSelect?.(movie)}
                >
                  <div className="top-rated-poster">
                    {poster ? (
                      <img
                        src={poster}
                        alt={movie.title}
                        loading="lazy"
                      />
                    ) : (
                      <div className="top-rated-no-poster">
                        <Film size={35} />
                        <span>No Poster</span>
                      </div>
                    )}

                    <span className="top-rated-rank">
                      #{index + 1}
                    </span>

                    <span className="top-rated-rating">
                      <Star size={14} fill="currentColor" />
                      {Number(movie.vote_average ?? movie.rating ?? 0).toFixed(1)}
                    </span>
                  </div>

                  <div className="top-rated-card-info">
                    <h3>{movie.title}</h3>

                    <div className="top-rated-genres">
                      {genres.slice(0, 3).map((genre, genreIndex) => (
                        <span key={`${genre}-${genreIndex}`}>
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default TopRated;
