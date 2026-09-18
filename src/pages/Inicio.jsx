import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/firebaseConfig.js';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { MessageCircle } from 'lucide-react';
import { ProductosContext } from '../context/ProductosContext'; // 1. Importamos el Contexto global

// 🚀 IMPORTAMOS NUESTRO HELPER REUTILIZABLE
import { optimizarImagen } from '../helpers/cloudinary';

import '../estilos/Inicio.css'; 
import '../estilos/Horarios.css'; 

export default function Inicio() {
  
  // ==========================================
  // CONFIGURACIÓN DE COLECCIÓN ACTIVA
  // ==========================================
  const COLECCION_ACTIVA = "productos"; // Podés cambiar a "productos_test" si lo usás para pruebas

  // 2. Nos conectamos al Contexto global para aprovechar los productos ya descargados
  const { productos: productosGlobales } = useContext(ProductosContext);

  // 3. BÚSQUEDA HÍBRIDA EN MEMORIA: Buscamos si ya hay un destacado en el Contexto
  const productoEnMemoria = productosGlobales.find(p => p.destacado === true);

  const [productoDestacado, setProductoDestacado] = useState(productoEnMemoria || null);
  const [cargandoDestacado, setCargandoDestacado] = useState(!productoEnMemoria && productosGlobales.length === 0);

  // Sincronizar por si el Contexto termina de cargar un poquito después
  useEffect(() => {
    if (productoEnMemoria) {
      setProductoDestacado(productoEnMemoria);
      setCargandoDestacado(false);
      return;
    }

    // PLAN DE EMERGENCIA: Si el contexto global está vacío, consultamos a Firebase directamente
    const fetchDestacado = async () => {
      try {
        setCargandoDestacado(true);
        const q = query(
          collection(db, COLECCION_ACTIVA), 
          where("destacado", "==", true), 
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0];
          setProductoDestacado({ id: docData.id, ...docData.data() });
        } else {
          setProductoDestacado(null);
        }
      } catch (error) {
        console.error("Error al cargar el producto destacado:", error);
      } finally {
        setCargandoDestacado(false);
      }
    };

    if (productosGlobales.length > 0) {
      setCargandoDestacado(false);
    } else {
      fetchDestacado();
    }
  }, [productosGlobales, productoEnMemoria, COLECCION_ACTIVA]);

  return (
    <div className="inicio-container">
      <section className="banner">
        <h1>Bienvenidos a <span>La Casa de Cata</span></h1>
        <p>Todo lo que tu hogar necesita, con la calidad y confianza de siempre.</p>
      </section>

      {/* SECCIÓN DESTACADO DE LA SEMANA */}
      <section className="seccion-destacado-home">
        <h2 className="titulo-banner-destacado">
          🔥 ¡PRODUCTO DE LA SEMANA - 15% OFF! 🔥
        </h2>

        {cargandoDestacado || !productoDestacado ? (
          /* SKELETON / CONTENEDOR DE CARGA FIJO PARA EVITAR SALTOS */
          <div className="tarjeta-destacado-home" style={{ minHeight: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#888' }}>Cargando oferta de la semana...</p>
          </div>
        ) : (
          (() => {
            const precioOriginal = Number(productoDestacado.precio) || 0;
            const descuento = precioOriginal * 0.15;
            const precioConDescuento = Math.round(precioOriginal - descuento);

            const handleCompartirWhatsApp = () => {
              const urlProducto = `${window.location.origin}/producto/${productoDestacado.id}`;
              const texto = `¡Hola! Me interesa la oferta de la semana en La Casa de Cata: *${productoDestacado.nombre}* a *$${precioConDescuento.toLocaleString('es-AR')}* (Antes *$${precioOriginal.toLocaleString('es-AR')}* - ¡15% OFF!). Lo vi acá: ${urlProducto}`;
              const urlWhatsApp = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
              window.open(urlWhatsApp, '_blank');
            };

            return (
              <div className="tarjeta-destacado-home">
                <div className="badge-descuento-home">
                  🔥 15% OFF
                </div>

                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <img 
                      src={optimizarImagen(productoDestacado.imagen || productoDestacado.imagenes?.[0], 400)} 
                      alt={productoDestacado.nombre} 
                      className="imagen-destacado-home"
                      width="400"
                      height="300"
                      loading="eager"
                      fetchPriority="high"
                  />
                </div>

                <h3 className="titulo-producto-destacado">{productoDestacado.nombre}</h3>

                <h2 className="titulo-especificaciones">Descripcion</h2>
                  
                <div className="descripcion-producto-destacado">
                  {productoDestacado.descripcion ? (
                    productoDestacado.descripcion
                      .split('.')
                      .filter(linea => linea.trim() !== '')
                      .map((linea, index) => (
                        <p key={index} style={{ marginBottom: '8px' }}>
                          • {linea.trim()}.
                        </p>
                      ))
                  ) : null}
                </div>

                <div className="contenedor-precios-destacado">
                  <span className="precio-tachado">${precioOriginal.toLocaleString('es-AR')}</span>
                  <span className="precio-producto-destacado">
                    ${precioConDescuento.toLocaleString('es-AR')}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '15px', flexWrap: 'wrap' }}>
                  <Link to={`/producto/${productoDestacado.id}`} className="btn-ver-tienda-destacado" style={{ flex: 1, textAlign: 'center' }}>
                    Ver producto →
                  </Link>

                  <button 
                    onClick={handleCompartirWhatsApp} 
                    className="btn-whatsapp-oferta"
                  >
                    <MessageCircle size={20} strokeWidth={2.5} />
                    Compartir por WhatsApp
                  </button>
                </div>
              </div>
            );
          })()
        )}
      </section>

      <section className="servicios-container">
        <h2 className="titulo-seccion">Nuestros Servicios</h2>
        <div className="grid-servicios">
          <div className="tarjeta-servicio">
            <span className="icono">🖨️</span>
            <h3>Fotocopias e Impresiones</h3>
            <p>Blanco y negro o color, alta calidad para tus trabajos escolares o laborales.</p>
          </div>
          
          <div className="tarjeta-servicio">
            <span className="icono">📋</span>
            <h3>Gestión de Trámites</h3>
            <p>Tramitamos tus antecedentes, constancias de CUIL, ANSES y más trámites online.</p>
          </div>

          {/* Tarjeta de Acceso a Productos */}
          <Link to="/productos" className="tarjeta-servicio tarjeta-especial">
            <span className="icono">🛍️</span>
            <h3>Ver Productos</h3>
            <p>Explorá todo nuestro catálogo de bazar y novedades que tenemos para vos.</p>
            <span className="ver-mas">Ir a la tienda →</span>
          </Link>
        </div>
      </section>

      {/* Nueva Sección de Horarios */}
      <section className="seccion-horarios">
        <h2 className="horarios-titulo">Horarios de Atención</h2>
        <div className="horarios-grid">
          <div className="horario-card">
            <h3>Lunes a Viernes</h3>
            <p className="hora">09:00 - 12:00</p>
            <p className="hora">17:00 - 20:00</p>
          </div>
          <div className="horario-card">
            <h3>Sábados</h3>
            <p className="hora">09:00 - 12:00</p>
            <p className="hora">17:00 - 18:30</p>
          </div>
          <div className="horario-card">
            <h3>Domingos</h3>
            <p className="estado">Cerrado</p>
          </div>
        </div>
      </section>
    </div>
  );
}