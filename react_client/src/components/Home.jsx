import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="card">
      <h1>Lab 7</h1>
      <p>
        Lab 7 is a small GraphQL, Apollo, React playground for managing artists,
        albums, and listeners. The User will have the ability to create, read, update, and delete artists, albums, and listeners, as well as manage the relationships between them. 

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