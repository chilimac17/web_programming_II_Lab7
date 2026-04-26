import { useState } from "react";
import { useMutation } from "@apollo/client";
import queries from "../queries";

function AddListenerModal({ onClose, onAdded }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    date_of_birth: "",
    subscription_tier: "FREE",
  });
  const [errMsg, setErrMsg] = useState("");

  const [addListener, { loading }] = useMutation(queries.ADD_LISTENER, {
    refetchQueries: [{ query: queries.GET_LISTENERS }],
  });

  const update = (key, val) => setForm({ ...form, [key]: val });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    try {
      await addListener({ variables: { ...form } });
      onAdded();
    } catch (err) {
      setErrMsg(err.message);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Add Listener</h2>
        {errMsg && <div className="error">{errMsg}</div>}
        <form onSubmit={onSubmit}>
          <div className="form-grid">
            <div>
              <label>First Name</label>
              <input
                value={form.first_name}
                onChange={(e) => update("first_name", e.target.value)}
                required
              />
            </div>
            <div>
              <label>Last Name</label>
              <input
                value={form.last_name}
                onChange={(e) => update("last_name", e.target.value)}
                required
              />
            </div>
            <div className="full">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
              />
            </div>
            <div>
              <label>Date of Birth (MM/DD/YYYY)</label>
              <input
                value={form.date_of_birth}
                onChange={(e) => update("date_of_birth", e.target.value)}
                placeholder="01/15/1995"
                required
              />
            </div>
            <div>
              <label>Subscription Tier</label>
              <select
                value={form.subscription_tier}
                onChange={(e) => update("subscription_tier", e.target.value)}
              >
                <option value="FREE">FREE</option>
                <option value="PREMIUM">PREMIUM</option>
              </select>
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="success" disabled={loading}>
              {loading ? "Adding..." : "Add Listener"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddListenerModal;
