import { useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import queries from "../queries";
import AddListenerModal from "./AddListenerModal";

function Listeners() {
  const [showAdd, setShowAdd] = useState(false);
  const { loading, error: allError, data, refetch } = useQuery(
    queries.GET_LISTENERS,
    { fetchPolicy: "cache-and-network" }
  );

  const [tier, setTier] = useState("");
  const [lastNameTerm, setLastNameTerm] = useState("");
  const [filterMode, setFilterMode] = useState("all");

  const [
    runByTier,
    { data: tierData, loading: tierLoading, error: tierError },
  ] = useLazyQuery(queries.GET_LISTENERS_BY_SUBSCRIPTION, {
    fetchPolicy: "network-only",
  });

  const [
    runSearch,
    { data: searchData, loading: searchLoading, error: searchError },
  ] = useLazyQuery(queries.SEARCH_LISTENERS_BY_LAST_NAME, {
    fetchPolicy: "network-only",
  });

  const onFilterByTier = (e) => {
    e.preventDefault();
    if (!tier) return;
    setFilterMode("tier");
    runByTier({ variables: { tier } });
  };

  const onSearchByLastName = (e) => {
    e.preventDefault();
    if (!lastNameTerm.trim()) return;
    setFilterMode("name");
    runSearch({ variables: { searchTerm: lastNameTerm.trim() } });
  };

  const onClear = () => {
    setFilterMode("all");
    setTier("");
    setLastNameTerm("");
  };

  let listListeners = data?.listeners ?? [];
  let listError = allError;
  let listLoading = loading;

  if (filterMode === "tier") {
    listListeners = tierData?.getListenersBySubscription ?? [];
    listError = tierError;
    listLoading = tierLoading;
  } else if (filterMode === "name") {
    listListeners = searchData?.searchListenersByLastName ?? [];
    listError = searchError;
    listLoading = searchLoading;
  }

  return (
    <div>
      <div className="toolbar">
        <h1>Listeners</h1>
        <button className="success" onClick={() => setShowAdd(true)}>
          + Add Listener
        </button>
      </div>

      <div className="card">
        <h3>Filters</h3>
        <form className="filter-bar" onSubmit={onFilterByTier}>
          <div>
            <label>Subscription Tier</label>
            <select value={tier} onChange={(e) => setTier(e.target.value)}>
              <option value="">-- Select --</option>
              <option value="FREE">FREE</option>
              <option value="PREMIUM">PREMIUM</option>
            </select>
          </div>
          <button type="submit" className="primary">Filter by Tier</button>
        </form>
        <form className="filter-bar" onSubmit={onSearchByLastName}>
          <div>
            <label>Search by Last Name (case-insensitive)</label>
            <input
              type="text"
              value={lastNameTerm}
              onChange={(e) => setLastNameTerm(e.target.value)}
              placeholder="e.g. smith"
            />
          </div>
          <button type="submit" className="primary">Search</button>
          <button type="button" onClick={onClear}>Clear Filters</button>
        </form>
      </div>

      {listError && <div className="error">Error: {listError.message}</div>}
      {listLoading && <p>Loading...</p>}
      {!listLoading && listListeners.length === 0 && (
        <p className="muted">No listeners found.</p>
      )}

      <div className="list-grid">
        {listListeners.map((l) => (
          <div className="list-item" key={l._id}>
            <h3>
              <Link to={`/listeners/${l._id}`}>
                {l.first_name} {l.last_name}
              </Link>
            </h3>
            <p>Email: {l.email || "N/A"}</p>
            <p>Subscription: {l.subscription_tier || "N/A"}</p>
            <p># of Favorite Albums: {l.numOfFavoriteAlbums ?? 0}</p>
          </div>
        ))}
      </div>

      {showAdd && (
        <AddListenerModal
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

export default Listeners;
