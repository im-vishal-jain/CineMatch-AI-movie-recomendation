
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { motion } from "framer-motion";

export default function MainLayout({
  children,
  activePage,
  setActivePage,
  searchValue,
  setSearchValue,
  onSearch
}) {
  return (
    <div className="app-layout">

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="main-content">

        <Topbar
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onSearch={onSearch}
        />

        <motion.div
          className="page-content"
          key={activePage}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {children}
        </motion.div>

      </main>

    </div>
  );
}
