import { useState } from "react";
import { useMutation } from "@apollo/client";
import queries from "../queries";

function AddArtistModal({ onClose, onAdded }) {
  const [form, setForm] = useState({
    stage_name: "",
    genre: "",
    label: "",
    management_email: "",
    management_phone: "",
    home_city: "",
    date_signed: "",
  });
  const [errMsg, setErrMsg] = useState("");

  const [addArtist, { loading }] = useMutation(queries.ADD_ARTIST, {
    refetchQueries: [{ query: queries.GET_ARTISTS }],
  });

  const update = (key, val) => setForm({ ...form, [key]: val });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    try {
      await addArtist({ variables: { ...form } });
      onAdded();
    } catch (err) {
      setErrMsg(err.message);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Add Artist</h2>
        {errMsg && <div className="error">{errMsg}</div>}
        <form onSubmit={onSubmit}>
          <div className="form-grid">
            <div className="full">
              <label>Stage Name</label>
              <input
                value={form.stage_name}
                onChange={(e) => update("stage_name", e.target.value)}
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
              <label>Label</label>
              <input
                value={form.label}
                onChange={(e) => update("label", e.target.value)}
                required
              />
            </div>
            <div>
              <label>Management Email</label>
              <input
                type="email"
                value={form.management_email}
                onChange={(e) => update("management_email", e.target.value)}
                required
              />
            </div>
            <div>
              <label>Management Phone (###-###-####)</label>
              <input
                value={form.management_phone}
                onChange={(e) => update("management_phone", e.target.value)}
                placeholder="555-123-4567"
                required
              />
            </div>
            <div>
              <label>Home City</label>
              <input
                value={form.home_city}
                onChange={(e) => update("home_city", e.target.value)}
                required
              />
            </div>
            <div>
              <label>Date Signed (MM/DD/YYYY)</label>
              <input
                value={form.date_signed}
                onChange={(e) => update("date_signed", e.target.value)}
                placeholder="01/15/2020"
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="success" disabled={loading}>
              {loading ? "Adding..." : "Add Artist"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddArtistModal;
