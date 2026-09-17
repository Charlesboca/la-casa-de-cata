import { useEffect, useState, useContext } from 'react'; // 1. Añadimos useContext
import { useParams, useLocation, Link } from 'react-router-dom';
import { db } from '../firebase/firebaseConfig.js';
import { doc, getDoc } from 'firebase/firestore';
import ModalImagen from '../components/ModalImagen';
import { Smartphone, Loader2, MessageCircle } from 'lucide-react';
import '../estilos/ItemDetail.css';
import { ProductosContext } from '../context/ProductosContext'; // 2. Importamos el Contexto global

export default function ItemDetail() {

  // ==========================================
  // CONFIGURACIÓN DE COLECCIÓN ("productos_test" o "productos")
  // ==========================================
  const COLECCION_ACTIVA = "productos";

  const { id } = useParams();
  const location = useLocation();

  // 3. Nos conectamos al "Wi-Fi" global para traer la lista completa de productos
  const { productos: productosGlobales } = useContext(ProductosContext);

  // 4. BÚSQUEDA INTELIGENTE INICIAL (Estrategia Híbrida):
  // Buscamos el producto en este orden de prioridad:
  // 1ro: Si viene viajando en el state (clic directo desde una tarjeta).
  // 2do: Si ya está descargado en el array global del Contexto.
  // 3ro: Si no está en ninguno de los dos, arrancamos en null (cliente nuevo con link directo).
  const productoEnMemoria = location.state?.producto || productosGlobales.find(p => p.id === id);

  const [producto, setProducto] = useState(productoEnMemoria || null);
  const [cargando, setCargando] = useState(!productoEnMemoria);
  const [showModal, setShowModal] = useState(false);
  
  // Estado para manejar la imagen seleccionada en la galería multimagen
  const [imagenActiva, setImagenActiva] = useState("");

  // 5. EFECTO DE CARGA Y RESCATE A FIREBASE
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Si ya lo encontramos en memoria (state o Contexto), apagamos la carga y cortamos acá
    if (productoEnMemoria) {
      setProducto(productoEnMemoria);
      setCargando(false);
      return;
    }

    // PLAN DE EMERGENCIA (Cliente nuevo que entra por link directo):
    // Como el Contexto global todavía no tiene datos, vamos a Firebase a buscar este producto puntual.
    const getProductoDirecto = async () => {
      try {
        setCargando(true);
        const docRef = doc(db, COLECCION_ACTIVA, id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProducto({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error al buscar el producto directamente en Firebase:", error);
      } finally {
        setCargando(false);
      }
    };

    getProductoDirecto();
  }, [id, productoEnMemoria]); // Se ejecuta si cambia el ID o si el producto aparece en memoria

  // Sincronizar la imagen activa cuando el producto se termina de cargar
  useEffect(() => {
    if (producto) {
      const lista = producto.imagenes?.length > 0 ? producto.imagenes : [producto.imagen];
      setImagenActiva(lista[0] || '');
    }
  }, [producto]);

  // Pantalla de carga mientras resuelve si está en memoria o en Firebase
  if (cargando) {
    return (
      <div className="detalle-cargando-container">
        <Loader2 className="spinner-carga" size={40} />
        <p>Cargando detalles del producto...</p>
      </div>
    );
  }

  // Pantalla por si el producto no existe ni en memoria ni en Firebase
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

  // Lista segura de imágenes (soporta array 'imagenes' o string viejo 'imagen')
  const listaImagenes = producto.imagenes?.length > 0 ? producto.imagenes : (producto.imagen ? [producto.imagen] : []);

  // Imagen optimizada para Cloudinary basada en la que esté activa
  const imagenParaMostrar = imagenActiva && imagenActiva.includes('cloudinary.com')
    ? imagenActiva.replace('/upload/', '/upload/w_600,c_scale,f_auto,q_auto/')
    : (imagenActiva || 'https://via.placeholder.com/300');

  const handleCompartirWhatsApp = () => {
    let texto = "";

    if (esDestacado) {
      texto = `¡Hola! Me interesa la oferta de la semana en La Casa de Cata: *${producto.nombre}* a *$${precioFinal.toLocaleString('es-AR')}* (Antes *$${precioOriginal.toLocaleString('es-AR')}* - ¡15% OFF!). Lo vi acá: ${window.location.href}`;
    } else {
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

        {/* CONTENEDOR DE GALERÍA (MINIATURAS + FOTO PRINCIPAL) */}
        <div className="galeria-detalle-wrapper" style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', width: '100%', marginBottom: '15px' }}>
          
          {/* LISTA DE MINIATURAS (Solo si hay más de 1 foto) */}
          {listaImagenes.length > 1 && (
            <div className="miniaturas-container" style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '350px', overflowY: 'auto' }}>
              {listaImagenes.map((img, index) => (
                <img
                  key={index}
                  src={img.includes('cloudinary.com') ? img.replace('/upload/', '/upload/w_100,c_scale,f_auto,q_auto/') : img}
                  alt={`${producto.nombre} - miniatura ${index + 1}`}
                  onClick={() => setImagenActiva(img)}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    border: imagenActiva === img ? '2px solid #e63946' : '2px solid transparent',
                    opacity: imagenActiva === img ? 1 : 0.7,
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>
          )}

          {/* FOTO PRINCIPAL */}
          <div style={{ flex: 1, position: 'relative' }}>
            <img 
              src={imagenParaMostrar} 
              alt={producto.nombre} 
              className="imagen-detalle clickable" 
              onClick={() => setShowModal(true)}
              style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', cursor: 'pointer' }}
            />
          </div>
        </div>

        {showModal && (
          <ModalImagen 
            src={imagenActiva} 
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
        
        <button onClick={handleCompartirWhatsApp} className={esDestacado ? "btn-whatsapp-oferta" : "btn-whatsapp"}>
          {esDestacado ? <MessageCircle size={22} strokeWidth={2.5} /> : <Smartphone size={22} strokeWidth={2.5} />}
          {esDestacado ? "Compartir Oferta por WhatsApp" : "Compartir por WhatsApp"}
        </button>
      </div>

    </div>
  );
}