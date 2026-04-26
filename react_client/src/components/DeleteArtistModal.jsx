import { useState } from "react";
import { useMutation } from "@apollo/client";
import queries from "../queries";

function DeleteArtistModal({ artist, onClose, onDeleted }) {
  const [errMsg, setErrMsg] = useState("");
  const [removeArtist, { loading }] = useMutation(queries.DELETE_ARTIST, {
    refetchQueries: [
      { query: queries.GET_ARTISTS },
      { query: queries.GET_ALBUMS },
    ],
  });

  const onConfirm = async () => {
    setErrMsg("");
    try {
      await removeArtist({ variables: { _id: artist._id } });
      onDeleted();
    } catch (err) {
      setErrMsg(err.message);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Delete Artist</h2>
        {errMsg && <div className="error">{errMsg}</div>}
        <p>
          Are you sure you want to delete <strong>{artist.stage_name}</strong>?
          Their albums will remain but show "No Artist Assigned".
        </p>
        <div className="modal-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteArtistModal;
