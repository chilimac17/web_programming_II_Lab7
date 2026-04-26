import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="card">
      <h1>Lab 7</h1>
      <p>
        A small GraphQL + Apollo + React playground for managing artists,
        albums, and listeners.
      </p>
      <div className="actions">
        <Link to="/artists">
          <button className="primary">Browse Artists</button>
        </Link>
        <Link to="/albums">
          <button className="primary">Browse Albums</button>
        </Link>
        <Link to="/listeners">
          <button className="primary">Browse Listeners</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;