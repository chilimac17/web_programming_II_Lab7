import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import queries from "../queries";
import EditAlbumModal from "./EditAlbumModal";
import DeleteAlbumModal from "./DeleteAlbumModal";

function AlbumDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const { loading, error, data, refetch } = useQuery(queries.GET_ALBUM_BY_ID, {
    variables: { _id: id },
    fetchPolicy: "cache-and-network",
  });

  const {
    data: listenersData,
    refetch: refetchListeners,
  } = useQuery(queries.GET_LISTENERS_BY_ALBUM_ID, {
    variables: { albumId: id },
    fetchPolicy: "cache-and-network",
  });

  const { data: artistsData } = useQuery(queries.GET_ARTISTS, {
    fetchPolicy: "cache-and-network",
  });

  const [updateAlbumArtist, { loading: updatingArtist }] = useMutation(
    queries.UPDATE_ALBUM_ARTIST,
    {
      refetchQueries: [
        { query: queries.GET_ALBUM_BY_ID, variables: { _id: id } },
        { query: queries.GET_ALBUMS },
      ],
    }
  );

  const [selectedArtistId, setSelectedArtistId] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");

  if (loading) return <p>Loading album...</p>;
  if (error) return <div className="error">Error: {error.message}</div>;

  const album = data?.getAlbumById;
  if (!album) return <p>Album not found.</p>;

  const onUpdateArtist = async (e) => {
    e.preventDefault();
    setUpdateError("");
    setUpdateSuccess("");
    if (!selectedArtistId) {
      setUpdateError("Please select an artist.");
      return;
    }
    try {
      await updateAlbumArtist({
        variables: { albumId: album._id, artistId: selectedArtistId },
      });
      setUpdateSuccess("Artist updated.");
      setSelectedArtistId("");
    } catch (err) {
      setUpdateError(err.message);
    }
  };

  return (
    <div>
      <div className="toolbar">
        <h1>{album.title}</h1>
        <div className="actions">
          <button className="primary" onClick={() => setShowEdit(true)}>
            Edit Album
          </button>
          <button className="danger" onClick={() => setShowDelete(true)}>
            Delete Album
          </button>
        </div>
      </div>

      <div className="card">
        <dl className="detail-grid">
          <dt>Genre</dt>
          <dd>{album.genre || "N/A"}</dd>
          <dt>Track Count</dt>
          <dd>{album.track_count ?? "N/A"}</dd>
          <dt>Release Date</dt>
          <dd>{album.release_date || "N/A"}</dd>
          <dt>Promo Start</dt>
          <dd>{album.promo_start || "N/A"}</dd>
          <dt>Promo End</dt>
          <dd>{album.promo_end || "N/A"}</dd>
          <dt>Artist</dt>
          <dd>
            {album.artist ? (
              <Link to={`/artists/${album.artist._id}`}>
                {album.artist.stage_name}
                {album.artist.label ? ` (${album.artist.label})` : ""}
              </Link>
            ) : (
              <span className="muted">No Artist Assigned</span>
            )}
          </dd>
          <dt># of Listeners Who Favorited</dt>
          <dd>{album.numOfListenersWhoFavorited ?? 0}</dd>
        </dl>
      </div>

      <div className="card">
        <h2>Update Artist</h2>
        {updateError && <div className="error">{updateError}</div>}
        {updateSuccess && <div className="success-msg">{updateSuccess}</div>}
        <form className="filter-bar" onSubmit={onUpdateArtist}>
          <div>
            <label>Reassign to Artist</label>
            <select
              value={selectedArtistId}
              onChange={(e) => setSelectedArtistId(e.target.value)}
            >
              <option value="">-- Select Artist --</option>
              {(artistsData?.artists ?? []).map((a) => (
                <option key={a._id} value={a._id}>
                  {a.stage_name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="primary" disabled={updatingArtist}>
            {updatingArtist ? "Updating..." : "Update Artist"}
          </button>
        </form>
      </div>

      <div className="card">
        <h2>Listeners Who Favorited This Album</h2>
        {(() => {
          const fans =
            listenersData?.getListenersByAlbumId ??
            album.listenersWhoFavorited ??
            [];
          if (fans.length === 0) {
            return (
              <p className="muted">No Listeners Have Favorited This Album</p>
            );
          }
          return (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Subscription</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {fans.map((l) => (
                  <tr key={l._id}>
                    <td>
                      <Link to={`/listeners/${l._id}`}>{l.first_name} {l.last_name}</Link>
                    </td>
                    <td>{l.subscription_tier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          );
        })()}
      </div>

      {showEdit && (
        <EditAlbumModal
          album={album}
          onClose={() => setShowEdit(false)}
          onSaved={() => {
            setShowEdit(false);
            refetch();
            refetchListeners();
          }}
        />
      )}
      {showDelete && (
        <DeleteAlbumModal
          album={album}
          onClose={() => setShowDelete(false)}
          onDeleted={() => {
            setShowDelete(false);
            navigate("/albums");
          }}
        />
      )}
    </div>
  );
}

export default AlbumDetail;
