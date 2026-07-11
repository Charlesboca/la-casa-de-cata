// src/components/SkeletonProducto.jsx
import '../estilos/Skeleton.css';

export default function SkeletonProducto() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-img"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-price"></div>
    </div>
  );
}