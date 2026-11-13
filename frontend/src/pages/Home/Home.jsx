
import { motion } from "framer-motion";
import {
  Play,
  Plus,
  Star,
  ChevronRight,
  TrendingUp,
  Sparkles
} from "lucide-react";

const movies = [
  {
    title: "Inception",
    year: "2010",
    rating: "8.8",
    genre: "Sci-Fi",
    image: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg"
  },
  {
    title: "Interstellar",
    year: "2014",
    rating: "8.7",
    genre: "Adventure",
    image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
  },
  {
    title: "The Dark Knight",
    year: "2008",
    rating: "9.0",
    genre: "Action",
    image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
  },
  {
    title: "Avatar",
    year: "2009",
    rating: "7.9",
    genre: "Fantasy",
    image: "https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg"
  },
  {
    title: "The Avengers",
    year: "2012",
    rating: "8.0",
    genre: "Action",
    image: "https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg"
  }
];

function MovieCard({ movie, index }) {
  return (
    <motion.div
      className="home-movie-card"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      <div className="movie-poster">
        <img
          src={movie.image}
          alt={movie.title}
          loading="lazy"
        />

        <div className="poster-overlay">
          <button className="poster-play">
            <Play size={19} fill="currentColor" />
          </button>
        </div>

        <span className="poster-rating">
          <Star size={12} fill="currentColor" />
          {movie.rating}
        </span>
      </div>

      <div className="home-movie-info">
        <h3>{movie.title}</h3>
        <p>{movie.year} · {movie.genre}</p>

        <button className="add-watchlist">
          <Plus size={15} />
          Watchlist
        </button>
      </div>
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="home-dashboard">

      {/* HERO BANNER */}

      <motion.section
        className="hero-banner"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
      >
        <img
          className="hero-image"
          src="https://image.tmdb.org/t/p/w1280/8bcoRX3hQRHufLPSDREdvr3YMXx.jpg"
          alt="Featured movie"
        />

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <span className="featured-label">
            <Sparkles size={15} />
            FEATURED MOVIE
          </span>

          <h1>Interstellar</h1>

          <div className="hero-meta">
            <span>2014</span>
            <span>•</span>
            <span>2h 49m</span>
            <span>•</span>
            <span>Adventure / Sci-Fi</span>
            <span className="hero-rating">
              <Star size={14} fill="currentColor" />
              8.7
            </span>
          </div>

          <p>
            A journey beyond the stars, where humanity's
            survival depends on an extraordinary mission
            through space and time.
          </p>

          <div className="hero-actions">
            <button className="watch-now">
              <Play size={18} fill="currentColor" />
              Watch Now
            </button>

            <button className="hero-watchlist">
              <Plus size={19} />
              Watchlist
            </button>
          </div>

        </div>

        <div className="hero-indicators">
          <span className="indicator active"></span>
          <span className="indicator"></span>
          <span className="indicator"></span>
        </div>

      </motion.section>

      {/* POPULAR MOVIES */}

      <section className="movie-section">

        <div className="home-section-heading">
          <div>
            <h2>Popular on CineMatch</h2>
            <p>Movies everyone is watching</p>
          </div>

          <button className="see-more">
            See More <ChevronRight size={17} />
          </button>
        </div>

        <div className="home-movie-grid">
          {movies.map((movie, index) => (
            <MovieCard
              key={movie.title}
              movie={movie}
              index={index}
            />
          ))}
        </div>

      </section>

      {/* TRENDING */}

      <section className="trending-section">

        <div className="home-section-heading">
          <div>
            <h2>
              <TrendingUp size={22} />
              Trending Now
            </h2>
            <p>Discover what's trending today</p>
          </div>
        </div>

        <div className="trending-banner">
          <div>
            <span>YOUR NEXT FAVORITE MOVIE</span>
            <h2>Find Your Next Obsession.</h2>
            <p>
              Explore movies and get personalized
              AI-powered recommendations.
            </p>
          </div>
        </div>

      </section>

    </div>
  );
}
