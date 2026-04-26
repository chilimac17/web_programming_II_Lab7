import { useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import queries from "../queries";
import AddArtistModal from "./AddArtistModal";

function Artists() {
  const [showAdd, setShowAdd] = useState(false);
  const { loading, error: allError, data, refetch } = useQuery(
    queries.GET_ARTISTS,
    { fetchPolicy: "cache-and-network" }
  );

  const [labelTerm, setLabelTerm] = useState("");
  const [signedStart, setSignedStart] = useState("");
  const [signedEnd, setSignedEnd] = useState("");

  const [
    runByLabel,
    { data: byLabelData, loading: byLabelLoading, error: byLabelError },
  ] = useLazyQuery(queries.GET_ARTISTS_BY_LABEL, {
    fetchPolicy: "network-only",
  });

  const [
    runSigned,
    { data: signedData, loading: signedLoading, error: signedError },
  ] = useLazyQuery(queries.GET_ARTISTS_SIGNED_BETWEEN, {
    fetchPolicy: "network-only",
  });

  const [filterMode, setFilterMode] = useState("all");

  const onFilterByLabel = (e) => {
    e.preventDefault();
    if (!labelTerm.trim()) return;
    setFilterMode("label");
    runByLabel({ variables: { label: labelTerm.trim() } });
  };

  const onFilterBySigned = (e) => {
    e.preventDefault();
    const start = signedStart.trim() || "01/01/1900";
    if (!signedEnd.trim()) return;
    setFilterMode("signed");
    runSigned({ variables: { start, end: signedEnd.trim() } });
  };

  const onClearFilters = () => {
    setFilterMode("all");
    setLabelTerm("");
    setSignedStart("");
    setSignedEnd("");
  };

  let listArtists = data?.artists ?? [];
  let listError = allError;
  let listLoading = loading;

  if (filterMode === "label") {
    listArtists = byLabelData?.getArtistsByLabel ?? [];
    listError = byLabelError;
    listLoading = byLabelLoading;
  } else if (filterMode === "signed") {
    listArtists = signedData?.getArtistsSignedBetween ?? [];
    listError = signedError;
    listLoading = signedLoading;
  }

  return (
    <div>
      <div className="toolbar">
        <h1>Artists</h1>
        <button className="success" onClick={() => setShowAdd(true)}>
          + Add Artist
        </button>
      </div>

      <div className="card">
        <h3>Filters</h3>
        <form className="filter-bar" onSubmit={onFilterByLabel}>
          <div>
            <label>Label (case-insensitive)</label>
            <input
              type="text"
              value={labelTerm}
              onChange={(e) => setLabelTerm(e.target.value)}
              placeholder="e.g. Sony"
            />
          </div>
          <button type="submit" className="primary">Filter by Label</button>
        </form>
        <form className="filter-bar" onSubmit={onFilterBySigned}>
          <div>
            <label>Signed Start (MM/DD/YYYY) - blank = 01/01/1900</label>
            <input
              type="text"
              value={signedStart}
              onChange={(e) => setSignedStart(e.target.value)}
              placeholder="01/01/1900"
            />
          </div>
          <div>
            <label>Signed End (MM/DD/YYYY)</label>
            <input
              type="text"
              value={signedEnd}
              onChange={(e) => setSignedEnd(e.target.value)}
              placeholder="12/31/2025"
            />
          </div>
          <button type="submit" className="primary">Filter by Date Signed</button>
          <button type="button" onClick={onClearFilters}>Clear Filters</button>
        </form>
      </div>

      {listError && (
        <div className="error">Error: {listError.message}</div>
      )}
      {listLoading && <p>Loading...</p>}

      {!listLoading && listArtists.length === 0 && (
        <p className="muted">No artists found.</p>
      )}

      <div className="list-grid">
        {listArtists.map((a) => (
          <div className="list-item" key={a._id}>
            <h3>
              <Link to={`/artists/${a._id}`}>{a.stage_name}</Link>
            </h3>
            <p>Genre: {a.genre || "N/A"}</p>
            <p>Label: {a.label || "N/A"}</p>
            <p>Home City: {a.home_city || "N/A"}</p>
            <p>Date Signed: {a.date_signed || "N/A"}</p>
            <p># of Albums: {a.numOfAlbums ?? 0}</p>
          </div>
        ))}
      </div>

      {showAdd && (
        <AddArtistModal
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

export default Artists;
