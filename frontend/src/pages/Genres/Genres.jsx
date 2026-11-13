
import { useState } from "react";
import {
  Clapperboard,
  Heart,
  Laugh,
  Ghost,
  Rocket,
  Shield,
  Drama,
  WandSparkles,
  Search,
  ArrowRight,
} from "lucide-react";
import "./Genres.css";

const genres = [
  { id: 28, name: "Action", description: "High energy, thrilling adventures", icon: Shield, color: "#ef4444" },
  { id: 35, name: "Comedy", description: "Movies that make you laugh", icon: Laugh, color: "#f59e0b" },
  { id: 18, name: "Drama", description: "Powerful stories and emotions", icon: Drama, color: "#a78bfa" },
  { id: 27, name: "Horror", description: "Dark stories and scary moments", icon: Ghost, color: "#8b5cf6" },
  { id: 10749, name: "Romance", description: "Love stories and relationships", icon: Heart, color: "#ec4899" },
  { id: 878, name: "Sci-Fi", description: "Explore worlds beyond imagination", icon: Rocket, color: "#06b6d4" },
  { id: 53, name: "Thriller", description: "Suspense and unexpected twists", icon: Search, color: "#f97316" },
  { id: 14, name: "Fantasy", description: "Magic, myths and fantasy worlds", icon: WandSparkles, color: "#10b981" },
  { id: 12, name: "Adventure", description: "Discover extraordinary journeys", icon: Clapperboard, color: "#0ea5e9" },
];

function Genres({ onGenreSelect }) {
  const [search, setSearch] = useState("");

  const filteredGenres = genres.filter((genre) =>
    genre.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="genres-page">
      <section className="genres-hero">
        <div className="genres-hero-content">
          <span className="genres-eyebrow">EXPLORE YOUR TASTE</span>
          <h1>
            Discover Movies by <span>Genre</span>
          </h1>
          <p>
            Explore movies based on your mood, interests and favorite genres.
            Find your next favorite movie with CineMatch AI.
          </p>

          <div className="genres-search">
            <Search size={19} />
            <input
              type="text"
              placeholder="Search your favorite genre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="genres-section">
        <div className="genres-section-heading">
          <div>
            <span className="genres-eyebrow">BROWSE COLLECTION</span>
            <h2>Explore All Genres</h2>
          </div>
          <span className="genres-count">
            {filteredGenres.length} Genres
          </span>
        </div>

        <div className="genres-grid">
          {filteredGenres.map((genre) => {
            const Icon = genre.icon;

            return (
              <button
                className="genre-card"
                key={genre.id}
                onClick={() => onGenreSelect?.(genre)}
                style={{ "--genre-color": genre.color }}
              >
                <div className="genre-icon">
                  <Icon size={27} />
                </div>

                <div className="genre-info">
                  <h3>{genre.name}</h3>
                  <p>{genre.description}</p>
                </div>

                <ArrowRight className="genre-arrow" size={20} />
              </button>
            );
          })}
        </div>

        {filteredGenres.length === 0 && (
          <div className="genres-empty">
            <Search size={30} />
            <h3>No genres found</h3>
            <p>Try searching with another genre name.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Genres;
