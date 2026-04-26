import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import EditArtistModal from "./EditArtistModal";
import DeleteArtistModal from "./DeleteArtistModal";

function ArtistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const { loading, error, data, refetch } = useQuery(queries.GET_ARTIST_BY_ID, {
    variables: { _id: id },
    fetchPolicy: "cache-and-network",
  });

  const {
    data: albumsByArtistData,
    refetch: refetchAlbumsByArtist,
  } = useQuery(queries.GET_ALBUMS_BY_ARTIST_ID, {
    variables: { artistId: id },
    fetchPolicy: "cache-and-network",
  });

  if (loading) return <p>Loading artist...</p>;
  if (error) return <div className="error">Error: {error.message}</div>;

  const artist = data?.getArtistById;
  if (!artist) return <p>Artist not found.</p>;

  const artistAlbums =
    albumsByArtistData?.getAlbumsByArtistId ?? artist.albums ?? [];

  return (
    <div>
      <div className="toolbar">
        <h1>{artist.stage_name}</h1>
        <div className="actions">
          <button className="primary" onClick={() => setShowEdit(true)}>
            Edit Artist
          </button>
          <button className="danger" onClick={() => setShowDelete(true)}>
            Delete Artist
          </button>
        </div>
      </div>

      <div className="card">
        <dl className="detail-grid">
          <dt>Genre</dt>
          <dd>{artist.genre || "N/A"}</dd>
          <dt>Label</dt>
          <dd>{artist.label || "N/A"}</dd>
          <dt>Management Email</dt>
          <dd>{artist.management_email || "N/A"}</dd>
          <dt>Management Phone</dt>
          <dd>{artist.management_phone || "N/A"}</dd>
          <dt>Home City</dt>
          <dd>{artist.home_city || "N/A"}</dd>
          <dt>Date Signed</dt>
          <dd>{artist.date_signed || "N/A"}</dd>
          <dt># of Albums</dt>
          <dd>{artist.numOfAlbums ?? 0}</dd>
        </dl>
      </div>

      <div className="card">
        <h2>Albums by {artist.stage_name}</h2>
        {artistAlbums.length === 0 && (
          <p className="muted">No albums for this artist yet.</p>
        )}
        {artistAlbums.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Genre</th>
                <th>Tracks</th>
                <th>Release</th>
                <th>Promo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {artistAlbums.map((al) => (
                <tr key={al._id}>
                  <td><Link to={`/albums/${al._id}`}>{al.title}</Link></td>
                  <td>{al.genre}</td>
                  <td>{al.track_count}</td>
                  <td>{al.release_date}</td>
                  <td>
                    {al.promo_start} → {al.promo_end}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showEdit && (
        <EditArtistModal
          artist={artist}
          onClose={() => setShowEdit(false)}
          onSaved={() => {
            setShowEdit(false);
            refetch();
            refetchAlbumsByArtist();
          }}
        />
      )}
      {showDelete && (
        <DeleteArtistModal
          artist={artist}
          onClose={() => setShowDelete(false)}
          onDeleted={() => {
            setShowDelete(false);
            navigate("/artists");
          }}
        />
      )}
    </div>
  );
}

export default ArtistDetail;
