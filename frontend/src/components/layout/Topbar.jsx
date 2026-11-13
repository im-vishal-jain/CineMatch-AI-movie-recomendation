
import { Search, SlidersHorizontal, Bell, User } from "lucide-react";

export default function Topbar({ searchValue, setSearchValue, onSearch }) {
  return (
    <header className="topbar">

      <div className="topbar-tabs">
        <button className="top-tab active">Movies</button>
        <button className="top-tab">TV Shows</button>
        <button className="top-tab">Anime</button>
      </div>

      <form
        className="search-box"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
      >
        <Search size={21} />

        <input
          type="text"
          placeholder="Search movies..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />

        <button type="submit" title="Search">
          <SlidersHorizontal size={19} />
        </button>
      </form>

      <div className="topbar-profile">

        <button className="notification-btn">
          <Bell size={21} />
          <span></span>
        </button>

        <div className="profile">
          <div className="profile-avatar">
            <User size={20} />
          </div>
          <span>Movie Lover</span>
        </div>

      </div>

    </header>
  );
}
