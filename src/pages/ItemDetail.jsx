import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { db } from '../firebase/firebaseConfig.js';
import { doc, getDoc } from 'firebase/firestore';
import ModalImagen from '../components/ModalImagen';
import { Smartphone, Loader2, MessageCircle } from 'lucide-react'; // Sumé MessageCircle por si querés usarlo
import '../estilos/ItemDetail.css';

export default function ItemDetail() {
  const { id } = useParams();
  const location = useLocation();
  
  const [producto, setProducto] = useState(location.state?.producto || null);
  const [cargando, setCargando] = useState(!location.state?.producto);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Si ya tenemos el producto por el state del router, no consultamos a Firebase
    if (location.state?.producto) {
      setCargando(false);
      return;
    }

    const getProducto = async () => {
      try {
        setCargando(true);
        const docRef = doc(db, "productos", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProducto({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error al buscar el producto:", error);
      } finally {
        setCargando(false);
      }
    };

    getProducto();
  }, [id, location.state]);

  // Pantalla de carga visual y limpia usando clases de CSS
  if (cargando) {
    return (
      <div className="detalle-cargando-container">
        <Loader2 className="spinner-carga" size={40} />
        <p>Cargando detalles del producto...</p>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="detalle-no-encontrado">
        <h2>No se encontró el producto</h2>
        <p>Es posible que haya sido eliminado o el enlace sea incorrecto.</p>
        <Link to="/productos" className="btn-volver-categoria">
          ← Ir a la tienda
        </Link>
      </div>
    );
  }

  const rutaVolver = producto.categoria 
    ? `/productos/${producto.categoria.toLowerCase()}` 
    : '/productos';

  const esDestacado = Boolean(producto.destacado);
  const precioOriginal = Number(producto.precio || 0);
  const precioFinal = esDestacado ? Math.round(precioOriginal * 0.85) : precioOriginal;

  const handleCompartirWhatsApp = () => {
    let texto = "";

    if (esDestacado) {
      // Mensaje igual al del home si es destacado
      texto = `¡Hola! Me interesa la oferta de la semana en La Casa de Cata: *${producto.nombre}* a *$${precioFinal.toLocaleString('es-AR')}* (Antes *$${precioOriginal.toLocaleString('es-AR')}* - ¡15% OFF!). Lo vi acá: ${window.location.href}`;
    } else {
      // Mensaje normal para el resto de los productos
      texto = `¡Hola! Me interesa este producto de La Casa de Cata: *${producto.nombre}* a *$${precioOriginal.toLocaleString('es-AR')}*. Lo vi acá: ${window.location.href}`;
    }

    const urlWhatsApp = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
    window.open(urlWhatsApp, '_blank');
  };

  return (
    <div className="detalle-container">

      <div className="volver-container">
        <Link to={rutaVolver} className="btn-volver-categoria">
          ← Volver a {producto.categoria || 'productos'}
        </Link>
      </div>

      <div className="detalle-card">
        
        {esDestacado && (
          <div className="badge-oferta-detalle">
            🔥 15% OFF
          </div>
        )}

        <img 
          src={
            producto.imagen && producto.imagen.includes('cloudinary.com')
              ? producto.imagen.replace('/upload/', '/upload/w_600,c_scale,f_auto,q_auto/')
              : (producto.imagen || 'https://via.placeholder.com/300')
          } 
          alt={producto.nombre} 
          className="imagen-detalle clickable" 
          onClick={() => setShowModal(true)}
        />
        {showModal && (
          <ModalImagen 
            src={producto.imagen} 
            alt={producto.nombre} 
            onClose={() => setShowModal(false)} 
          />
        )}

        <h2 className="titulo-detalle">{producto.nombre}</h2>

        <h2 className="titulo-especificaciones">Descripcion</h2>

        <div className="descripcion-container">
          {producto.descripcion && producto.descripcion
            .split('.')
            .filter(parrafo => parrafo.trim() !== '')
            .map((parrafo, index) => (
              <p key={index} className="descripcion-linea">
                • {parrafo.trim()}.
              </p>
            ))
          }
        </div>

        {esDestacado ? (
          <div className="contenedor-precios-detalle">
            <span className="precio-tachado-detalle">
              ${precioOriginal.toLocaleString('es-AR')}
            </span>
            <span className="precio precio-oferta-detalle">
              ${precioFinal.toLocaleString('es-AR')}
            </span>
          </div>
        ) : (
          <p className="precio">
            ${precioOriginal.toLocaleString('es-AR')}
          </p>
        )}
        
        {/* Cambié el ícono y la clase para que se vea igual que en el Home si te gustó ese diseño */}
        <button onClick={handleCompartirWhatsApp} className={esDestacado ? "btn-whatsapp-oferta" : "btn-whatsapp"}>
          {esDestacado ? <MessageCircle size={22} strokeWidth={2.5} /> : <Smartphone size={22} strokeWidth={2.5} />}
          {esDestacado ? "Compartir Oferta por WhatsApp" : "Compartir por WhatsApp"}
        </button>
      </div>

    </div>
  );
}