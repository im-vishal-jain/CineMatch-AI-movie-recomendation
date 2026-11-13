
import { useEffect, useState } from "react";
import {
  Bookmark,
  Search,
  Star,
  Trash2,
  Film,
  Clapperboard,
} from "lucide-react";
import "./Watchlist.css";

const STORAGE_KEY = "cinematch_watchlist";

function parseGenres(value) {
  if (Array.isArray(value)) {
    return value.map((genre) =>
      typeof genre === "object" ? genre.name : genre
    ).filter(Boolean);
  }

  if (!value) return [];

  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed.map((genre) =>
        typeof genre === "object" ? genre.name : genre
      ).filter(Boolean);
    }
  } catch {
    return String(value)
      .split(",")
      .map((genre) => genre.trim())
      .filter(Boolean);
  }

  return [];
}

function Watchlist({ onMovieSelect }) {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  // Load saved movies from localStorage
  const loadWatchlist = () => {
    try {
      const savedMovies = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      setMovies(Array.isArray(savedMovies) ? savedMovies : []);
    } catch (error) {
      console.error("Watchlist loading error:", error);
      setMovies([]);
    }
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  // Remove movie from watchlist
  const removeMovie = (movieId) => {
    const updatedMovies = movies.filter(
      (movie) => String(movie.id) !== String(movieId)
    );

    setMovies(updatedMovies);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMovies));
  };

  // Search filtering
  const filteredMovies = movies.filter((movie) =>
    (movie.title || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <main className="watchlist-page">
      <section className="watchlist-hero">
        <div className="watchlist-hero-content">
          <span className="watchlist-eyebrow">
            <Bookmark size={15} />
            YOUR PERSONAL COLLECTION
          </span>

          <h1>
            My <span>Watchlist</span>
          </h1>

          <p>
            All your favorite movies, saved in one place.
            Keep track of what you want to watch next.
          </p>

          <div className="watchlist-stat">
            <Bookmark size={19} />
            <div>
              <strong>{movies.length}</strong>
              <span>Saved Movies</span>
            </div>
          </div>
        </div>
      </section>

      <section className="watchlist-content">
        <div className="watchlist-heading">
          <div>
            <span className="watchlist-eyebrow">
              YOUR COLLECTION
            </span>
            <h2>Saved Movies</h2>
          </div>

          <div className="watchlist-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search saved movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredMovies.length > 0 ? (
          <div className="watchlist-grid">
            {filteredMovies.map((movie, index) => {
              const poster =
                movie.poster_url ||
                movie.poster_path ||
                movie.poster;

              const genres = parseGenres(movie.genres);

              const rating = Number(
                movie.vote_average ?? movie.rating ?? 0
              );

              return (
                <article
                  className="watchlist-card"
                  key={movie.id ?? `${movie.title}-${index}`}
                >
                  <button
                    className="watchlist-movie-open"
                    onClick={() => onMovieSelect?.(movie)}
                    aria-label={`View ${movie.title}`}
                  >
                    <div className="watchlist-poster">
                      {poster ? (
                        <img
                          src={poster}
                          alt={movie.title || "Movie poster"}
                          loading="lazy"
                        />
                      ) : (
                        <div className="watchlist-no-poster">
                          <Film size={35} />
                          <span>No Poster</span>
                        </div>
                      )}

                      <span className="watchlist-rating">
                        <Star size={13} fill="currentColor" />
                        {rating.toFixed(1)}
                      </span>
                    </div>

                    <div className="watchlist-movie-info">
                      <h3>{movie.title || "Untitled Movie"}</h3>

                      <div className="watchlist-genres">
                        {genres.slice(0, 3).map((genre, genreIndex) => (
                          <span key={`${genre}-${genreIndex}`}>
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>

                  <button
                    className="watchlist-remove"
                    onClick={() => removeMovie(movie.id)}
                    title="Remove from watchlist"
                    aria-label={`Remove ${movie.title} from watchlist`}
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="watchlist-empty">
            <div className="watchlist-empty-icon">
              {searchQuery ? (
                <Search size={35} />
              ) : (
                <Clapperboard size={35} />
              )}
            </div>

            <h3>
              {searchQuery
                ? "No matching movies"
                : "Your watchlist is empty"}
            </h3>

            <p>
              {searchQuery
                ? "Try searching with another movie title."
                : "Explore movies and add your favorites to your watchlist."}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Watchlist;
