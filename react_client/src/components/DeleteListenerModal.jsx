import { useState } from "react";
import { useMutation } from "@apollo/client";
import queries from "../queries";

function DeleteListenerModal({ listener, onClose, onDeleted }) {
  const [errMsg, setErrMsg] = useState("");
  const [removeListener, { loading }] = useMutation(queries.DELETE_LISTENER, {
    refetchQueries: [{ query: queries.GET_LISTENERS }],
  });

  const onConfirm = async () => {
    setErrMsg("");
    try {
      await removeListener({ variables: { _id: listener._id } });
      onDeleted();
    } catch (err) {
      setErrMsg(err.message);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Delete Listener</h2>
        {errMsg && <div className="error">{errMsg}</div>}
        <p>
          Are you sure you want to delete{" "}
          <strong>
            {listener.first_name} {listener.last_name}
          </strong>
          ?
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

export default DeleteListenerModal;
