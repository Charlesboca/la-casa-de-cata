import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase/firebaseConfig.js';
import { doc, getDoc } from 'firebase/firestore';
import ModalImagen from '../components/ModalImagen'
import '../estilos/ItemDetail.css';

export default function ItemDetail() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const getProducto = async () => {
      const docRef = doc(db, "productos", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProducto({ id: docSnap.id, ...docSnap.data() });
      }
    };
    getProducto();
  }, [id]);

  if (!producto) return <p>Cargando producto...</p>;

  // Determinamos la ruta de retorno: si tiene categoría, vuelve a esa categoría; sino, a productos.
  const rutaVolver = producto.categoria 
    ? `/productos/${producto.categoria.toLowerCase()}` 
    : '/productos';

  return (
    <div className="detalle-container">
      
{/* 🔙 BOTÓN DE VOLVER */}
      <div className="volver-container">
        <Link to={rutaVolver} className="btn-volver-categoria">
          ← Volver a {producto.categoria || 'productos'}
        </Link>
      </div>
      
      <img 
        src={producto.imagen} 
        alt={producto.nombre} 
        className="imagen-detalle" 
        onClick={() => setShowModal(true)}
        style={{ cursor: 'pointer' }}
      />
            
      {showModal && (
        <ModalImagen 
          src={producto.imagen} 
          alt={producto.nombre} 
          onClose={() => setShowModal(false)} 
        />
      )}

      <h2 className="titulo-detalle">{producto.nombre}</h2>

      <p className="descripcion">
        {producto.descripcion}
      </p>

      <p className="precio">
        ${Number(producto.precio || 0).toLocaleString('es-AR')}
      </p>

    </div>
  );
}