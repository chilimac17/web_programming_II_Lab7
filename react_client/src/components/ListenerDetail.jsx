import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import queries from "../queries";
import EditListenerModal from "./EditListenerModal";
import DeleteListenerModal from "./DeleteListenerModal";

function ListenerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const { loading, error, data, refetch } = useQuery(
    queries.GET_LISTENER_BY_ID,
    {
      variables: { _id: id },
      fetchPolicy: "cache-and-network",
    }
  );

  const { data: albumsData } = useQuery(queries.GET_ALBUMS, {
    fetchPolicy: "cache-and-network",
  });

  const refetchAfter = [
    { query: queries.GET_LISTENER_BY_ID, variables: { _id: id } },
    { query: queries.GET_LISTENERS },
  ];

  const [favoriteAlbum, { loading: favLoading }] = useMutation(
    queries.FAVORITE_ALBUM,
    { refetchQueries: refetchAfter }
  );
  const [unfavoriteAlbum, { loading: unfavLoading }] = useMutation(
    queries.UNFAVORITE_ALBUM,
    { refetchQueries: refetchAfter }
  );

  const [favAlbumId, setFavAlbumId] = useState("");
  const [actionMsg, setActionMsg] = useState("");
  const [actionErr, setActionErr] = useState("");

  if (loading) return <p>Loading listener...</p>;
  if (error) return <div className="error">Error: {error.message}</div>;
  const listener = data?.getListenerById;
  if (!listener) return <p>Listener not found.</p>;

  const onFavorite = async (e) => {
    e.preventDefault();
    setActionErr("");
    setActionMsg("");
    if (!favAlbumId) {
      setActionErr("Please select an album to favorite.");
      return;
    }
    try {
      await favoriteAlbum({
        variables: { listenerId: listener._id, albumId: favAlbumId },
      });
      setActionMsg("Album added to favorites.");
      setFavAlbumId("");
    } catch (err) {
      setActionErr(err.message);
    }
  };

  const onUnfavorite = async (albumId) => {
    setActionErr("");
    setActionMsg("");
    try {
      await unfavoriteAlbum({
        variables: { listenerId: listener._id, albumId },
      });
      setActionMsg("Album removed from favorites.");
    } catch (err) {
      setActionErr(err.message);
    }
  };

  const favoritedIds = new Set(
    (listener.favorite_albums ?? []).map((a) => a._id)
  );
  const unfavoritedAlbums = (albumsData?.albums ?? []).filter(
    (a) => !favoritedIds.has(a._id)
  );

  return (
    <div>
      <div className="toolbar">
        <h1>
          {listener.first_name} {listener.last_name}
        </h1>
        <div className="actions">
          <button className="primary" onClick={() => setShowEdit(true)}>
            Edit Listener
          </button>
          <button className="danger" onClick={() => setShowDelete(true)}>
            Delete Listener
          </button>
        </div>
      </div>

      <div className="card">
        <dl className="detail-grid">
          <dt>Email</dt>
          <dd>{listener.email || "N/A"}</dd>
          <dt>Date of Birth</dt>
          <dd>{listener.date_of_birth || "N/A"}</dd>
          <dt>Subscription</dt>
          <dd>{listener.subscription_tier || "N/A"}</dd>
          <dt># of Favorite Albums</dt>
          <dd>{listener.numOfFavoriteAlbums ?? 0}</dd>
        </dl>
      </div>

      <div className="card">
        <h2>Favorite Albums</h2>
        {actionErr && <div className="error">{actionErr}</div>}
        {actionMsg && <div className="success-msg">{actionMsg}</div>}
        {(!listener.favorite_albums || listener.favorite_albums.length === 0) && (
          <p className="muted">No Favorite Albums</p>
        )}
        {listener.favorite_albums && listener.favorite_albums.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Genre</th>
                <th>Artist</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {listener.favorite_albums.map((al) => (
                <tr key={al._id}>
                  <td>{al.title}</td>
                  <td>{al.genre}</td>
                  <td>
                    {al.artist ? (
                      al.artist.stage_name
                    ) : (
                      <span className="muted">No Artist Assigned</span>
                    )}
                  </td>
                  <td>
                    <Link to={`/albums/${al._id}`}>View</Link>
                  </td>
                  <td>
                    <button
                      className="danger"
                      onClick={() => onUnfavorite(al._id)}
                      disabled={unfavLoading}
                    >
                      Unfavorite
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h3 style={{ marginTop: "1.25rem" }}>Add Favorite</h3>
        <form className="filter-bar" onSubmit={onFavorite}>
          <div>
            <label>Pick an album to favorite</label>
            <select
              value={favAlbumId}
              onChange={(e) => setFavAlbumId(e.target.value)}
            >
              <option value="">-- Select Album --</option>
              {unfavoritedAlbums.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.title}
                  {a.artist ? ` — ${a.artist.stage_name}` : ""}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="success" disabled={favLoading}>
            {favLoading ? "Adding..." : "Favorite"}
          </button>
        </form>
      </div>

      {showEdit && (
        <EditListenerModal
          listener={listener}
          onClose={() => setShowEdit(false)}
          onSaved={() => {
            setShowEdit(false);
            refetch();
          }}
        />
      )}
      {showDelete && (
        <DeleteListenerModal
          listener={listener}
          onClose={() => setShowDelete(false)}
          onDeleted={() => {
            setShowDelete(false);
            navigate("/listeners");
          }}
        />
      )}
    </div>
  );
}

export default ListenerDetail;
