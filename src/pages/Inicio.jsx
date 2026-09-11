import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/firebaseConfig.js';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { MessageCircle } from 'lucide-react';

import '../estilos/Inicio.css'; 
import '../estilos/Horarios.css'; 

export default function Inicio() {
  const [productoDestacado, setProductoDestacado] = useState(null);
  const [cargandoDestacado, setCargandoDestacado] = useState(true);

  // Consultar el producto destacado exclusivo
  useEffect(() => {
    const fetchDestacado = async () => {
      try {
        const q = query(
          collection(db, "productos"), 
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

    fetchDestacado();
  }, []);

  return (
    <div className="inicio-container">
      <section className="banner">
        <h1>Bienvenidos a <span>La Casa de Cata</span></h1>
        <p>Todo lo que tu hogar necesita, con la calidad y confianza de siempre.</p>
      </section>

      {/* SECCIÓN DESTACADO DE LA SEMANA */}
      {!cargandoDestacado && productoDestacado && (() => {
        // Calculamos el 15% de descuento
        const precioOriginal = Number(productoDestacado.precio) || 0;
        const descuento = precioOriginal * 0.15;
        const precioConDescuento = Math.round(precioOriginal - descuento); // Redondeamos para que quede prolijo

        // Función para compartir por WhatsApp con mensaje exclusivo para el destacado y su link directo
        const handleCompartirWhatsApp = () => {
          const urlProducto = `${window.location.origin}/producto/${productoDestacado.id}`;
          const texto = `¡Hola! Me interesa la oferta de la semana en La Casa de Cata: *${productoDestacado.nombre}* a *$${precioConDescuento.toLocaleString('es-AR')}* (Antes *$${precioOriginal.toLocaleString('es-AR')}* - ¡15% OFF!). Lo vi acá: ${urlProducto}`;
          const urlWhatsApp = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
          window.open(urlWhatsApp, '_blank');
        };

        return (
          <section className="seccion-destacado-home">
            <h2 className="titulo-banner-destacado">
              🔥 ¡PRODUCTO DE LA SEMANA - 15% OFF! 🔥
            </h2>
            <div className="tarjeta-destacado-home">
              
              {/* 👉 BADGE VISUAL DE DESCUENTO */}
              <div className="badge-descuento-home">
                🔥 15% OFF
              </div>

              <img 
                src={productoDestacado.imagen || productoDestacado.imagenes?.[0]} 
                alt={productoDestacado.nombre} 
                className="imagen-destacado-home"
              />
              <h3 className="titulo-producto-destacado">{productoDestacado.nombre}</h3>

              <h2 className="titulo-especificaciones">Descripcion</h2>
              
              {/* DESCRIPCIÓN SEPARADA POR PUNTOS */}
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

              {/* 👉 PRECIOS CON EL DESCUENTO APLICADO Y TACHADO */}
              <div className="contenedor-precios-destacado">
                <span className="precio-tachado">${precioOriginal.toLocaleString('es-AR')}</span>
                <span className="precio-producto-destacado">
                  ${precioConDescuento.toLocaleString('es-AR')}
                </span>
              </div>

              {/* CONTENEDOR DE BOTONES (Ver detalle + WhatsApp) */}
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
          </section>
        );
      })()}

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