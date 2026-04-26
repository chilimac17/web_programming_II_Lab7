import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import queries from "../queries";

function AddAlbumModal({ onClose, onAdded }) {
  const { data: artistsData } = useQuery(queries.GET_ARTISTS, {
    fetchPolicy: "cache-and-network",
  });

  const [form, setForm] = useState({
    title: "",
    genre: "",
    track_count: "",
    artist: "",
    release_date: "",
    promo_start: "",
    promo_end: "",
  });
  const [errMsg, setErrMsg] = useState("");

  const [addAlbum, { loading }] = useMutation(queries.ADD_ALBUM, {
    refetchQueries: [{ query: queries.GET_ALBUMS }],
  });

  const update = (key, val) => setForm({ ...form, [key]: val });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    const trackCountNum = parseInt(form.track_count, 10);
    if (Number.isNaN(trackCountNum)) {
      setErrMsg("Track count must be a number.");
      return;
    }
    try {
      await addAlbum({
        variables: {
          title: form.title,
          genre: form.genre,
          track_count: trackCountNum,
          artist: form.artist,
          release_date: form.release_date,
          promo_start: form.promo_start,
          promo_end: form.promo_end,
        },
      });
      onAdded();
    } catch (err) {
      setErrMsg(err.message);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Add Album</h2>
        {errMsg && <div className="error">{errMsg}</div>}
        <form onSubmit={onSubmit}>
          <div className="form-grid">
            <div className="full">
              <label>Title</label>
              <input
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                required
              />
            </div>
            <div>
              <label>Genre</label>
              <input
                value={form.genre}
                onChange={(e) => update("genre", e.target.value)}
                required
              />
            </div>
            <div>
              <label>Track Count (1-200)</label>
              <input
                type="number"
                min="1"
                max="200"
                value={form.track_count}
                onChange={(e) => update("track_count", e.target.value)}
                required
              />
            </div>
            <div className="full">
              <label>Artist</label>
              <select
                value={form.artist}
                onChange={(e) => update("artist", e.target.value)}
                required
              >
                <option value="">-- Select Artist --</option>
                {(artistsData?.artists ?? []).map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.stage_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Release Date (MM/DD/YYYY)</label>
              <input
                value={form.release_date}
                onChange={(e) => update("release_date", e.target.value)}
                placeholder="01/15/2020"
                required
              />
            </div>
            <div>
              <label>Promo Start (MM/DD/YYYY)</label>
              <input
                value={form.promo_start}
                onChange={(e) => update("promo_start", e.target.value)}
                placeholder="01/15/2020"
                required
              />
            </div>
            <div>
              <label>Promo End (MM/DD/YYYY)</label>
              <input
                value={form.promo_end}
                onChange={(e) => update("promo_end", e.target.value)}
                placeholder="02/15/2020"
                required
              />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="success" disabled={loading}>
              {loading ? "Adding..." : "Add Album"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddAlbumModal;
