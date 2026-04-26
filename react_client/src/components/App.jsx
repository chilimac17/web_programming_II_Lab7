import { Routes, Route, Link, NavLink } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import Artists from "./Artists";
import ArtistDetail from "./ArtistDetail";
import Albums from "./Albums";
import AlbumDetail from "./AlbumDetail";
import Listeners from "./Listeners";
import ListenerDetail from "./ListenerDetail";

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="brand">
          Chillemi-Lab7
        </Link>
        <nav className="app-nav">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/artists">Artists</NavLink>
          <NavLink to="/albums">Albums</NavLink>
          <NavLink to="/listeners">Listeners</NavLink>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/artists/:id" element={<ArtistDetail />} />
          <Route path="/albums" element={<Albums />} />
          <Route path="/albums/:id" element={<AlbumDetail />} />
          <Route path="/listeners" element={<Listeners />} />
          <Route path="/listeners/:id" element={<ListenerDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

function NotFound() {
  return (
    <div className="card">
      <h2>404 - Page Not Found</h2>
      <p>The page you requested does not exist.</p>
    </div>
  );
}

export default App;
