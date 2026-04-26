import { useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import queries from "../queries";
import AddAlbumModal from "./AddAlbumModal";

function Albums() {
  const [showAdd, setShowAdd] = useState(false);
  const { loading, error: allError, data, refetch } = useQuery(
    queries.GET_ALBUMS,
    { fetchPolicy: "cache-and-network" }
  );

  const [genreTerm, setGenreTerm] = useState("");
  const [promoStart, setPromoStart] = useState("");
  const [promoEnd, setPromoEnd] = useState("");
  const [filterMode, setFilterMode] = useState("all");

  const [
    runByGenre,
    { data: byGenreData, loading: byGenreLoading, error: byGenreError },
  ] = useLazyQuery(queries.GET_ALBUMS_BY_GENRE, {
    fetchPolicy: "network-only",
  });

  const [
    runPromo,
    { data: promoData, loading: promoLoading, error: promoError },
  ] = useLazyQuery(queries.GET_ALBUMS_BY_PROMO_DATE_RANGE, {
    fetchPolicy: "network-only",
  });

  const onFilterByGenre = (e) => {
    e.preventDefault();
    if (!genreTerm.trim()) return;
    setFilterMode("genre");
    runByGenre({ variables: { genre: genreTerm.trim() } });
  };

  const onFilterByPromo = (e) => {
    e.preventDefault();
    const start = promoStart.trim() || "01/01/1900";
    if (!promoEnd.trim()) return;
    setFilterMode("promo");
    runPromo({ variables: { start, end: promoEnd.trim() } });
  };

  const onClearFilters = () => {
    setFilterMode("all");
    setGenreTerm("");
    setPromoStart("");
    setPromoEnd("");
  };

  let listAlbums = data?.albums ?? [];
  let listError = allError;
  let listLoading = loading;

  if (filterMode === "genre") {
    listAlbums = byGenreData?.getAlbumsByGenre ?? [];
    listError = byGenreError;
    listLoading = byGenreLoading;
  } else if (filterMode === "promo") {
    listAlbums = promoData?.getAlbumsByPromoDateRange ?? [];
    listError = promoError;
    listLoading = promoLoading;
  }

  return (
    <div>
      <div className="toolbar">
        <h1>Albums</h1>
        <button className="success" onClick={() => setShowAdd(true)}>
          + Add Album
        </button>
      </div>

      <div className="card">
        <h3>Filters</h3>
        <form className="filter-bar" onSubmit={onFilterByGenre}>
          <div>
            <label>Genre (case-insensitive)</label>
            <input
              type="text"
              value={genreTerm}
              onChange={(e) => setGenreTerm(e.target.value)}
              placeholder="e.g. Pop"
            />
          </div>
          <button type="submit" className="primary">Filter by Genre</button>
        </form>
        <form className="filter-bar" onSubmit={onFilterByPromo}>
          <div>
            <label>Promo Start (MM/DD/YYYY) - blank = 01/01/1900</label>
            <input
              type="text"
              value={promoStart}
              onChange={(e) => setPromoStart(e.target.value)}
              placeholder="01/01/1900"
            />
          </div>
          <div>
            <label>Promo End (MM/DD/YYYY)</label>
            <input
              type="text"
              value={promoEnd}
              onChange={(e) => setPromoEnd(e.target.value)}
              placeholder="12/31/2025"
            />
          </div>
          <button type="submit" className="primary">Filter by Promo Range</button>
          <button type="button" onClick={onClearFilters}>Clear Filters</button>
        </form>
      </div>

      {listError && (
        <div className="error">Error: {listError.message}</div>
      )}
      {listLoading && <p>Loading...</p>}
      {!listLoading && listAlbums.length === 0 && (
        <p className="muted">No albums found.</p>
      )}

      <div className="list-grid">
        {listAlbums.map((al) => (
          <div className="list-item" key={al._id}>
            <h3>
              <Link to={`/albums/${al._id}`}>{al.title}</Link>
            </h3>
            <p>Genre: {al.genre || "N/A"}</p>
            <p>
              Artist:{" "}
              {al.artist ? (
                <Link to={`/artists/${al.artist._id}`}>
                  {al.artist.stage_name}
                </Link>
              ) : (
                <span className="muted">No Artist Assigned</span>
              )}
            </p>
            <p>Tracks: {al.track_count ?? "N/A"}</p>
          </div>
        ))}
      </div>

      {showAdd && (
        <AddAlbumModal
          onClose={() => setShowAdd(false)}
          onAdded={() => {
            setShowAdd(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}

export default Albums;
