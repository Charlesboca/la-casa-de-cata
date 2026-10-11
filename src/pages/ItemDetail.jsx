import { useEffect, useState, useContext } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { db } from '../firebase/firebaseConfig.js';
import { doc, getDoc } from 'firebase/firestore';
import ModalImagen from '../components/ModalImagen';
import { Smartphone, Loader2, MessageCircle } from 'lucide-react';
import '../estilos/ItemDetail.css';
import { ProductosContext } from '../context/ProductosContext';

export default function ItemDetail() {

  const COLECCION_ACTIVA = "productos";

  const { id } = useParams();
  const location = useLocation();

  const { productos: productosGlobales } = useContext(ProductosContext);

  const productoEnMemoria = location.state?.producto || productosGlobales.find(p => p.id === id);

  const [producto, setProducto] = useState(productoEnMemoria || null);
  const [cargando, setCargando] = useState(!productoEnMemoria);
  const [showModal, setShowModal] = useState(false);
  
  const [imagenActiva, setImagenActiva] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (productoEnMemoria) {
      setProducto(productoEnMemoria);
      setCargando(false);
      return;
    }

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
  }, [id, productoEnMemoria]);

  useEffect(() => {
    if (producto) {
      const lista = producto.imagenes?.length > 0 ? producto.imagenes : [producto.imagen];
      setImagenActiva(lista[0] || '');
    }
  }, [producto]);

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

  // 🌸 DETECTAMOS SI VINO DE LA SECCIÓN DE MAMÁ O DE CATEGORÍA NORMAL
  const vieneDeMadre = location.state?.origen === 'madre';

  const rutaVolver = vieneDeMadre 
    ? '/dia-madre-cata' 
    : (producto.categoria ? `/productos/${producto.categoria.toLowerCase()}` : '/productos');

  const textoVolver = vieneDeMadre 
    ? 'Volver a Especial Día de la Madre' 
    : `Volver a ${producto.categoria || 'productos'}`;

  const esDestacado = Boolean(producto.destacado);
  const precioOriginal = Number(producto.precio || 0);
  const precioFinal = esDestacado ? Math.round(precioOriginal * 0.85) : precioOriginal;

  const listaImagenes = producto.imagenes?.length > 0 ? producto.imagenes : (producto.imagen ? [producto.imagen] : []);

  // 🚀 OPTIMIZACIÓN DE IMAGEN PRINCIPAL (600px max)
  const imagenParaMostrar = imagenActiva && imagenActiva.includes('cloudinary.com')
    ? imagenActiva.replace('/upload/', '/upload/w_600,c_scale,f_auto,q_auto/')
    : (imagenActiva || 'https://via.placeholder.com/300');

  // 🚀 OPTIMIZACIÓN DE IMAGEN DEL MODAL (1000px max + compresión ligera)
  const imagenParaModal = imagenActiva && imagenActiva.includes('cloudinary.com')
    ? imagenActiva.replace('/upload/', '/upload/w_1000,c_limit,f_auto,q_auto/')
    : imagenActiva;

const handleCompartirWhatsApp = () => {
    let texto = "";

    // 🌸 SI EL PRODUCTO ES DEL DÍA DE LA MADRE O VIENE DE ESA SECCIÓN
    if (vieneDeMadre || producto.madre) {
      const precio = esDestacado ? precioFinal : precioOriginal;
      texto = `¡Hola! Mirá este regalo especial para el Día de la Madre en La Casa de Cata: *${producto.nombre}* a *$${precio.toLocaleString('es-AR')}*. Miraló acá: ${window.location.href} y el resto en https://lacasadecata.com.ar/dia-madre-cata`;
    } 
    // 🔥 SI ES UNA OFERTA DESTACADA NORMAL
    else if (esDestacado) {
      texto = `¡Hola! Mirá la oferta de la semana en La Casa de Cata: *${producto.nombre}* a *$${precioFinal.toLocaleString('es-AR')}* (Antes *$${precioOriginal.toLocaleString('es-AR')}* ¡15% OFF!). Lo vi acá: ${window.location.href}`;
    } 
    // 🛍️ PRODUCTO REGULAR DEL CATÁLOGO
    else {
      texto = `¡Hola! Mirá este producto de La Casa de Cata: *${producto.nombre}* a *$${precioOriginal.toLocaleString('es-AR')}*. Lo vi acá: ${window.location.href}`;
    }

    const urlWhatsApp = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
    window.open(urlWhatsApp, '_blank');
  };
  
  return (
    <div className="detalle-container">

      <div className="volver-container">
        <Link to={rutaVolver} className="btn-volver-categoria">
          ← {textoVolver}
        </Link>
      </div>

      <div className="detalle-card">
        
        {esDestacado && (
          <div className="badge-oferta-detalle">
            🔥 15% OFF
          </div>
        )}

        {/* CONTENEDOR DE GALERÍA (MINIATURAS + FOTO PRINCIPAL) */}
        <div className="galeria-detalle-wrapper">
          
          {/* LISTA DE MINIATURAS */}
          {listaImagenes.length > 1 && (
            <div className="miniaturas-container">
              {listaImagenes.map((img, index) => (
                <img
                  key={index}
                  src={img.includes('cloudinary.com') ? img.replace('/upload/', '/upload/w_100,c_scale,f_auto,q_auto/') : img}
                  alt={`${producto.nombre} miniatura ${index + 1}`}
                  onClick={() => setImagenActiva(img)}
                  className={imagenActiva === img ? 'miniatura-img activa' : 'miniatura-img'}
                />
              ))}
            </div>
          )}

          {/* FOTO PRINCIPAL */}
          <div className="imagen-principal-container">
            <img 
              src={imagenParaMostrar} 
              alt={producto.nombre} 
              className="imagen-detalle clickable" 
              onClick={() => setShowModal(true)}
            />
          </div>
        </div>

        {showModal && (
          <ModalImagen 
            src={imagenParaModal} 
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