import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { db } from '../firebase/firebaseConfig.js';
import { doc, getDoc } from 'firebase/firestore';
import ModalImagen from '../components/ModalImagen'
import '../estilos/ItemDetail.css';

export default function ItemDetail() {
  const { id } = useParams();
  const location = useLocation();
  
  // ⚡ Intentamos leer el producto si viene viajando desde el listado
  const [producto, setProducto] = useState(location.state?.producto || null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Si ya lo tenemos por el state, no necesitamos consultar Firestore
    if (producto) return;

    // Si alguien entró directo por link/URL, vamos a buscarlo a Firebase
    const getProducto = async () => {
      try {
        const docRef = doc(db, "productos", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProducto({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error al buscar el producto:", error);
      }
    };
    
    getProducto();
  }, [id, producto]);

  if (!producto) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Cargando producto...</p>;

  const rutaVolver = producto.categoria 
    ? `/productos/${producto.categoria.toLowerCase()}` 
    : '/productos';

  return (
    <div className="detalle-container">
      
      <div className="volver-container">
        <Link to={rutaVolver} className="btn-volver-categoria">
          ← Volver a {producto.categoria || 'productos'}
        </Link>
      </div>
      
      <img 
        src={
          producto.imagen && producto.imagen.includes('cloudinary.com')
            ? producto.imagen.replace('/upload/', '/upload/w_600,c_scale,f_auto,q_auto/')
            : (producto.imagen || 'https://via.placeholder.com/300')
        } 
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