
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  Calendar,
  Clock,
  Clapperboard,
  Play,
  Bookmark,
  Globe,
  Film
} from "lucide-react";

import "./MovieDetails.css";

const IMAGE_BASE = "https://image.tmdb.org/t/p/";

export default function MovieDetails({
  movie,
  onBack,
  onMovieSelect
}) {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("cinematch_watchlist") || "[]"
      );
      setWatchlist(saved);
    } catch {
      setWatchlist([]);
    }
  }, []);

  if (!movie) {
    return (
      <div className="movie-details-empty">
        <Film size={45} />
        <h2>No Movie Selected</h2>
        <p>Please select a movie from Discover.</p>
        <button onClick={onBack}>Back to Discover</button>
      </div>
    );
  }

  const poster = movie.poster_url ||
    (movie.poster_path
      ? `${IMAGE_BASE}w500${movie.poster_path}`
      : null);

  const backdrop = movie.backdrop_url ||
    (movie.backdrop_path
      ? `${IMAGE_BASE}w1280${movie.backdrop_path}`
      : poster);

  const genres = Array.isArray(movie.genres)
    ? movie.genres.map((g) =>
        typeof g === "object" ? g.name : g
      )
    : typeof movie.genres === "string"
      ? movie.genres.split(/[,|]/).map((g) => g.trim())
      : [];

  const isSaved = watchlist.some(
    (item) => item.id === movie.id
  );

  const toggleWatchlist = () => {
    const updated = isSaved
      ? watchlist.filter((item) => item.id !== movie.id)
      : [...watchlist, movie];

    setWatchlist(updated);

    localStorage.setItem(
      "cinematch_watchlist",
      JSON.stringify(updated)
    );
  };

  return (
    <motion.div
      className="movie-details-page"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* HERO BACKDROP */}
      <div
        className="movie-details-hero"
        style={{
          backgroundImage: backdrop
            ? `linear-gradient(90deg, #101018 10%, rgba(16,16,24,.85) 55%, rgba(16,16,24,.3)), url("${backdrop}")`
            : "linear-gradient(135deg, #171725, #29213d)"
        }}
      >
        <button
          className="movie-back-btn"
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          Back to Discover
        </button>

        <div className="movie-details-hero-content">

          <div className="movie-details-poster">
            {poster ? (
              <img src={poster} alt={movie.title} />
            ) : (
              <div className="movie-no-poster">
                <Clapperboard size={40} />
                Poster unavailable
              </div>
            )}
          </div>

          <div className="movie-details-information">

            <span className="movie-details-eyebrow">
              <Clapperboard size={15} />
              CINEMATCH AI MOVIE PROFILE
            </span>

            <h1>{movie.title}</h1>

            <div className="movie-details-meta">
              <span>
                <Star size={17} fill="currentColor" />
                {Number(movie.rating || 0).toFixed(1)}
              </span>

              <span>
                <Calendar size={16} />
                {movie.release_date?.slice(0, 4) || "N/A"}
              </span>

              <span>
                <Globe size={16} />
                {movie.original_language?.toUpperCase() || "N/A"}
              </span>
            </div>

            <div className="movie-details-genres">
              {genres.map((genre, index) => (
                <span key={`${genre}-${index}`}>
                  {genre}
                </span>
              ))}
            </div>

            <div className="movie-details-actions">
              <button
                className="movie-watchlist-action"
                onClick={toggleWatchlist}
              >
                <Bookmark
                  size={18}
                  fill={isSaved ? "currentColor" : "none"}
                />
                {isSaved ? "Remove from Watchlist" : "Add to Watchlist"}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* OVERVIEW */}
      <section className="movie-overview-section">
        <div className="movie-section-heading">
          <span>ABOUT THE MOVIE</span>
          <h2>Movie Overview</h2>
        </div>

        <p>
          {movie.overview ||
            "No overview is currently available for this movie."}
        </p>
      </section>

      {/* MOVIE INFORMATION */}
      <section className="movie-extra-information">
        <div className="movie-section-heading">
          <span>MOVIE INFORMATION</span>
          <h2>Details</h2>
        </div>

        <div className="movie-information-grid">

          <div className="movie-information-card">
            <Star size={20} />
            <span>Rating</span>
            <strong>
              {Number(movie.rating || 0).toFixed(1)} / 10
            </strong>
          </div>

          <div className="movie-information-card">
            <Calendar size={20} />
            <span>Release Date</span>
            <strong>{movie.release_date || "N/A"}</strong>
          </div>

          <div className="movie-information-card">
            <Clapperboard size={20} />
            <span>Director</span>
            <strong>{movie.director || "N/A"}</strong>
          </div>

          <div className="movie-information-card">
            <Film size={20} />
            <span>Movie ID</span>
            <strong>{movie.tmdb_id || movie.id || "N/A"}</strong>
          </div>

        </div>
      </section>

      {/* ML SCORE */}
      <section className="movie-ml-section">
        <div className="movie-section-heading">
          <span>ARTIFICIAL INTELLIGENCE</span>
          <h2>Recommendation Match</h2>
        </div>

        <div className="movie-ml-card">
          <div>
            <Clapperboard size={24} />
            <span>ML Similarity Score</span>
          </div>

          <strong>
            {(Number(movie.similarity || 0) * 100).toFixed(1)}%
          </strong>
        </div>
      </section>

    </motion.div>
  );
}
