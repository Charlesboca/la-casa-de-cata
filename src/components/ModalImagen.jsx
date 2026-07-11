// components/ModalImagen.jsx
import '../estilos/Modal.css';

export default function ModalImagen({ src, alt, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>X</button>
        <img src={src} alt={alt} />
      </div>
    </div>
  );
}