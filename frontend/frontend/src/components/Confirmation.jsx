import React from 'react';


export default function ConfirmationModal({ text, onConfirm, onCancel }) {
  return (
    <div className="confirmation-backdrop">
      <div className="confirmation-modal">
        <p>{text}</p>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button className="btn btn-danger btn-sm" onClick={onCancel}>Annulla</button>
          <button className="btn btn-success btn-sm" onClick={onConfirm}>Conferma</button>
        </div>
      </div>
    </div>
  );
}
