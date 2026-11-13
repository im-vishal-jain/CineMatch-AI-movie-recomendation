
import {
  House,
  Compass,
  Trophy,
  Film,
  Clock,
  Star,
  Download,
  Heart,
  CheckCircle,
  Settings,
  LogOut,
  Clapperboard
} from "lucide-react";

const menuItems = [
  { name: "Home", icon: House },
  { name: "Discover", icon: Compass },
  { name: "Top Rated", icon: Trophy },
  { name: "Genres", icon: Film }
];

const libraryItems = [
  { name: "Recent", icon: Clock },
  { name: "Top Rated", icon: Star },
  { name: "Downloaded", icon: Download },
  { name: "Watchlist", icon: Heart },
  { name: "Completed", icon: CheckCircle }
];

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar">

      <div className="brand">
        <Clapperboard size={30} />
        <div>
          CINEMATCH
          <span>AI MOVIES</span>
        </div>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-label">MENU</p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className={`sidebar-link ${
                activePage === item.name ? "active" : ""
              }`}
              onClick={() => setActivePage(item.name)}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>

      <div className="sidebar-section">
        <p className="sidebar-label">LIBRARY</p>

        {libraryItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className={`sidebar-link ${
                activePage === item.name ? "active" : ""
              }`}
              onClick={() => setActivePage(item.name)}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>

      <div className="sidebar-section sidebar-bottom">
        <p className="sidebar-label">GENERAL</p>

        <button className="sidebar-link">
          <Settings size={20} />
          <span>Settings</span>
        </button>

        <button className="sidebar-link">
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>

      <div className="sidebar-footer">
        <span className="online-dot"></span>
        CineMatch AI v1.0
      </div>

    </aside>
  );
}
