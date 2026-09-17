import { useEffect, useState, useContext } from 'react'; // 1. Añadimos useContext
import { useParams, Link } from 'react-router-dom';
// ❌ Borramos los imports de Firebase porque ya no se consultan acá
import SkeletonProducto from '../components/SkeletonProducto.jsx';
import '../estilos/ProductosPorCategoria.css';
import { ProductosContext } from '../context/ProductosContext'; // 2. Importamos el Contexto global

export default function ProductosPorCategoria() {
  // Capturamos la categoría actual desde la URL (ej: "bazar")
  const { catName } = useParams();

  // 3. Nos conectamos al Contexto global para extraer el catálogo completo y el estado de carga
  const { productos: productosGlobales, cargando } = useContext(ProductosContext);

  // Estado local exclusivo para la barra de búsqueda interna
  const [busqueda, setBusqueda] = useState(''); 

  // Efecto solo para scrollear arriba de todo al cambiar de categoría (ya no busca en Firebase)
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setBusqueda(''); // Limpiamos la búsqueda al cambiar de categoría
  }, [catName]);

  // 4. FILTRADO EN MEMORIA (Paso clave):
  // Primero filtramos los productos globales que coincidan con la categoría de la URL (catName).
  // Después, sobre esos mismos, filtramos los que coincidan con lo que el usuario tipea en el buscador.
  const productosFiltrados = productosGlobales.filter(prod => {
    const coincideCategoria = prod.categoria === catName;
    const coincideBusqueda = prod.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  return (
    <section>
      <div className="contenedor-volver">
        <Link to="/productos" className="btn-volver">
          ← Volver a categorías
        </Link>
      </div>

      <h2 className="titulo-categoria">
         {catName}
      </h2>

      {/* 🔍 Input de búsqueda (se muestra cuando termina de cargar el Provider) */}
      {!cargando && productosGlobales.length > 0 && (
        <div className="contenedor-buscador">
          <input 
            type="text" 
            placeholder={`Buscar en ${catName}...`} 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input-buscador"
          />
        </div>
      )}

      {/* 5. Usamos el estado de carga 'cargando' que viene directamente del Contexto */}
      {cargando ? (
        <div className="grid-productos">
            <SkeletonProducto />
            <SkeletonProducto />
            <SkeletonProducto />
        </div>
      ) : (
        <div className="grid-productos">
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map(prod => {
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
            <p className="sin-productos">No se encontraron productos con ese nombre en esta categoría.</p>
          )}
        </div>
      )}
    </section>
  );
}