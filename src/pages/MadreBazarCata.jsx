import { useContext } from "react";
import { Link } from "react-router-dom";
import { ProductosContext } from "../context/ProductosContext";
import SkeletonProducto from "../components/SkeletonProducto.jsx";
import '../estilos/MadreBazarCata.css'; // 👉 Importamos el CSS dedicado

export default function MadreBazarCata() {
  const { productos, cargando } = useContext(ProductosContext);

  // Filtramos únicamente los productos donde madre === true
  const productosBazar = productos.filter((p) => p.madre === true);

  return (
    <section>

  <div className="contenedor-volver-madre">
        <Link to="/" className="btn-volver-madre">
          ← Volver al Inicio
        </Link>
      </div>

      {/* Banner exclusivo Día de la Madre */}
      <div className="banner-madre-cata">
        <h1>🏠 Especial Día de la Madre</h1>
        <p>Regalos únicos y detalles especiales pensados para mamá.</p>
      </div>

      {cargando ? (
        <div className="grid-productos-madre">
          <SkeletonProducto />
          <SkeletonProducto />
          <SkeletonProducto />
        </div>
      ) : (
        <div className="grid-productos-madre">
          {productosBazar.length > 0 ? (
            productosBazar.map(prod => {
              const esDestacado = Boolean(prod.destacado);
              const precioOriginal = Number(prod.precio || 0);
              const precioFinal = esDestacado ? Math.round(precioOriginal * 0.85) : precioOriginal;

              return (
               
                <Link 
                    to={`/producto/${prod.id}`} 
                    state={{ producto: prod, origen: 'madre' }} // 👉 Le indicamos que venimos de la sección madre
                    key={prod.id} 
                    className="tarjeta-producto-link"
                >
                  <div className="tarjeta-producto-madre" style={{ position: 'relative' }}>
                    
                    {esDestacado && (
                      <div className="badge-oferta-card" style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: '#d81b60',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        zIndex: 2
                      }}>
                        🔥 15% OFF
                      </div>
                    )}

                    <img
                      src={
                        prod.imagen && prod.imagen.includes('cloudinary.com')
                          ? prod.imagen.replace('/upload/', '/upload/w_250,c_fill,f_auto,q_auto/')
                          : (prod.imagen || 'https://via.placeholder.com/150')
                      }
                      alt={prod.nombre}
                      className="producto-img-madre"
                      loading="lazy"
                    />
                    <div className="tarjeta-producto-info-madre">
                      <h3>{prod.nombre}</h3>

                      {esDestacado ? (
                        <div className="contenedor-precios-card" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ textDecoration: 'line-through', color: '#888', fontSize: '0.9rem' }}>
                            ${precioOriginal.toLocaleString('es-AR')}
                          </span>
                          <span style={{ fontWeight: 'bold', color: '#d81b60', fontSize: '1.1rem' }}>
                            ${precioFinal.toLocaleString('es-AR')}
                          </span>
                        </div>
                      ) : (
                        <p className="precio-madre">
                          ${precioOriginal.toLocaleString('es-AR')}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="sin-productos-madre">
              No hay productos cargados en esta sección especial todavía.
            </p>
          )}
        </div>
      )}
    </section>
  );
}