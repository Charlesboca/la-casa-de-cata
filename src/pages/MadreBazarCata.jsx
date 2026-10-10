import { useContext } from "react";
import { Link } from "react-router-dom";
import { ProductosContext } from "../context/ProductosContext";
import SkeletonProducto from "../components/SkeletonProducto.jsx";
import '../estilos/ProductosPorCategoria.css'; // Reutilizamos los mismos estilos de grilla y tarjetas

export default function MadreBazarCata() {
  const { productos, cargando } = useContext(ProductosContext);

  // Filtramos únicamente los productos donde madre === true
  const productosBazar = productos.filter((p) => p.madre === true);

  return (
    <section style={{ padding: "20px", minHeight: "80vh" }}>
      {/* Banner o diseño exclusivo para este apartado */}
      <div style={{ textAlign: "center", marginBottom: "30px", background: "#333", padding: "20px", borderRadius: "8px" }}>
        <h1 style={{ color: "#ff4757" }}>🏠 Dia de la madre</h1>
        <p style={{ color: "#ccc" }}>Elegi tu presente o tu regalo en este dia tan especial.</p>
      </div>

      {cargando ? (
        <div className="grid-productos">
          <SkeletonProducto />
          <SkeletonProducto />
          <SkeletonProducto />
        </div>
      ) : (
        <div className="grid-productos">
          {productosBazar.length > 0 ? (
            productosBazar.map(prod => {
              const esDestacado = Boolean(prod.destacado);
              const precioOriginal = Number(prod.precio || 0);
              const precioFinal = esDestacado ? Math.round(precioOriginal * 0.85) : precioOriginal;
              return (
                <Link 
                  to={`/producto/${prod.id}`} 
                  state={{ producto: prod }} 
                  key={prod.id} 
                  className="tarjeta-producto-link"
                >
                  <div className="tarjeta-producto" style={{ position: 'relative' }}>
                    
                    {esDestacado && (
                      <div className="badge-oferta-card" style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: '#e63946',
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
                      className="producto-img"
                      loading="lazy"
                    />
                    <div className="tarjeta-producto-info">
                      <h3>{prod.nombre}</h3>

                      {esDestacado ? (
                        <div className="contenedor-precios-card" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ textDecoration: 'line-through', color: '#888', fontSize: '0.9rem' }}>
                            ${precioOriginal.toLocaleString('es-AR')}
                          </span>
                          <span style={{ fontWeight: 'bold', color: '#e63946', fontSize: '1.1rem' }}>
                            ${precioFinal.toLocaleString('es-AR')}
                          </span>
                        </div>
                      ) : (
                        <p className="precio">
                          ${precioOriginal.toLocaleString('es-AR')}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="sin-productos" style={{ color: "#aaa", textAlign: "center", gridColumn: "1 / -1" }}>
              No hay productos cargados en esta sección todavía.
            </p>
          )}
        </div>
      )}
    </section>
  );
}