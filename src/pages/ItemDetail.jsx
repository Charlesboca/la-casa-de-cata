import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/firebaseConfig.js';
import { doc, getDoc } from 'firebase/firestore';
import ModalImagen from '../components/ModalImagen'
import '../estilos/ItemDetail.css';

export default function ItemDetail() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [showModal, setShowModal] = useState(false); // Estado para controlar el modal

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

  return (
    <div className="detalle-container">
      {/* AQUÍ AGREGAMOS LA CLASE QUE FALTABA */}
      <img 
        src={producto.imagen} 
        alt={producto.nombre} 
        className="imagen-detalle" 
        onClick={() => setShowModal(true)} // ¡Clic para abrir!
            style={{ cursor: 'pointer' }}
            />
            
            {showModal && (
            <ModalImagen 
                src={producto.imagen} 
                alt={producto.nombre} 
                onClose={() => setShowModal(false)} 
            />
            )}
  <p className="descripcion">
  {producto.descripcion}
</p>

<p className="precio">
  ${producto.precio}
</p>

    </div>
  );
}