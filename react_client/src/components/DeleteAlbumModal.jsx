import { useState } from "react";
import { useMutation } from "@apollo/client";
import queries from "../queries";

function DeleteAlbumModal({ album, onClose, onDeleted }) {
  const [errMsg, setErrMsg] = useState("");
  const [removeAlbum, { loading }] = useMutation(queries.DELETE_ALBUM, {
    refetchQueries: [
      { query: queries.GET_ALBUMS },
      { query: queries.GET_LISTENERS },
    ],
  });

  const onConfirm = async () => {
    setErrMsg("");
    try {
      await removeAlbum({ variables: { _id: album._id } });
      onDeleted();
    } catch (err) {
      setErrMsg(err.message);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Delete Album</h2>
        {errMsg && <div className="error">{errMsg}</div>}
        <p>
          Are you sure you want to delete <strong>{album.title}</strong>? This
          will remove it from any listeners' favorites.
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

export default DeleteAlbumModal;
