import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { db } from '../firebase/firebaseConfig.js';
import { doc, getDoc } from 'firebase/firestore';
import ModalImagen from '../components/ModalImagen';
import { Smartphone } from 'lucide-react';
import '../estilos/ItemDetail.css';

export default function ItemDetail() {
  const { id } = useParams();
  const location = useLocation();
  
  const [producto, setProducto] = useState(location.state?.producto || null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (producto) return;
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

  const handleCompartirWhatsApp = () => {
    const texto = `¡Hola! Me interesa este producto de La Casa de Cata: *${producto.nombre}* a $${Number(producto.precio || 0).toLocaleString('es-AR')}. Lo vi acá: ${window.location.href}`;
    const urlWhatsApp = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
    window.open(urlWhatsApp, '_blank');
  };

  return (
    <div className="detalle-container">

      {/* Botón de volver centrado */}
      <div className="volver-container">
        <Link to={rutaVolver} className="btn-volver-categoria">
          ← Volver a {producto.categoria || 'productos'}
        </Link>
      </div>

      {/* Card principal */}
      <div className="detalle-card">
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

        <div className="descripcion-container">
          {producto.descripcion && producto.descripcion
            .split('.')
            .filter(parrafo => parrafo.trim() !== '')
            .map((parrafo, index) => (
              <p key={index} className="descripcion-linea">
                {parrafo.trim()}.
              </p>
            ))
          }
        </div>

        <p className="precio">
          ${Number(producto.precio || 0).toLocaleString('es-AR')}
        </p>
        
        <button onClick={handleCompartirWhatsApp} className="btn-whatsapp">
          <Smartphone size={22} strokeWidth={2.5} />
          Compartir por WhatsApp
        </button>
      </div>

    </div>
  );
}