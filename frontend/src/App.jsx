
import { useState } from "react";

import MainLayout from "./components/layout/MainLayout";

import Home from "./pages/Home/Home";
import Discover from "./pages/Discover/Discover";
import Genres from "./pages/Genres/Genres";
import TopRated from "./pages/TopRated/TopRated";
import MovieDetails from "./pages/MovieDetails/MovieDetails";
import Watchlist from "./pages/Watchlist/Watchlist";

function App() {
  const [activePage, setActivePage] = useState("Home");

  const [searchValue, setSearchValue] = useState("");
  const [discoverQuery, setDiscoverQuery] = useState("");

  const [selectedMovie, setSelectedMovie] = useState(null);

  // Global search handler
  const handleSearch = () => {
    const query = searchValue.trim();

    if (!query) return;

    setDiscoverQuery(query);
    setActivePage("Discover");
  };

  // Open movie details
  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setActivePage("MovieDetails");
  };

  // Back to Discover
  const handleBackToDiscover = () => {
    setActivePage("Discover");
  };

  // Genre selection
  const handleGenreSelect = (genre) => {
    setDiscoverQuery(genre.name);
    setActivePage("Discover");
  };

  // Render active page
  const renderPage = () => {
    switch (activePage) {
      case "Home":
        return <Home />;

      case "Discover":
        return (
          <Discover
            initialQuery={discoverQuery}
            onMovieSelect={handleMovieSelect}
          />
        );

      case "Genres":
        return (
          <Genres
            onGenreSelect={handleGenreSelect}
          />
        );

      case "TopRated":
        return (
          <TopRated
            onMovieSelect={handleMovieSelect}
          />
        );

      case "MovieDetails":
        return (
          <MovieDetails
            movie={selectedMovie}
            onBack={handleBackToDiscover}
            onMovieSelect={handleMovieSelect}
          />
        );

      case "Watchlist":
        return (
          <Watchlist
            onMovieSelect={handleMovieSelect}
          />
        );

      default:
        return <Home />;
    }
  };

  return (
    <MainLayout
      activePage={activePage}
      setActivePage={setActivePage}
      searchValue={searchValue}
      setSearchValue={setSearchValue}
      onSearch={handleSearch}
    >
      {renderPage()}
    </MainLayout>
  );
}

export default App;
