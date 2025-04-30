import React from "react";
import "./Modal.css";

const ListingModal = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <img src={item.image || "https://via.placeholder.com/300x200"} alt={item.title} />
        <h2>{item.title}</h2>
        <p>{item.description}</p>
        <p><strong>Condition:</strong> {item.condition}</p>
        <p><strong>Price:</strong> ${item.price}</p>
        <p><strong>Created At:</strong> {new Date(item.created_at).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default ListingModal;
