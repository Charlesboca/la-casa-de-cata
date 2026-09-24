import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ProductosContext } from '../context/ProductosContext';
import '../estilos/ResultadosBusquedaGlobal.css';

export default function ResultadosBusquedaGlobal() {
  const { productos, terminoBusqueda, setTerminoBusqueda } = useContext(ProductosContext);

  // Si el usuario no escribió nada, no mostramos nada flotando
  if (!terminoBusqueda || terminoBusqueda.trim() === '') {
    return null;
  }

  // Filtramos en TODO el catálogo global de productos por nombre
  const resultados = productos.filter(prod => 
    prod.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  return (
    <div className="buscador-overlay-backdrop">
      <div className="buscador-overlay-panel">
        <div className="buscador-panel-header">
          <h3>Resultados para: "{terminoBusqueda}"</h3>
          <button 
            className="btn-cerrar-overlay" 
            onClick={() => setTerminoBusqueda('')}
          >
            ✕ Cerrar
          </button>
        </div>

        <div className="buscador-panel-grid">
          {resultados.length > 0 ? (
            resultados.map(prod => {
              const esDestacado = Boolean(prod.destacado);
              const precioOriginal = Number(prod.precio || 0);
              const precioFinal = esDestacado ? Math.round(precioOriginal * 0.85) : precioOriginal;

              return (
                <Link 
                  to={`/producto/${prod.id}`} 
                  state={{ producto: prod }} 
                  key={prod.id} 
                  className="tarjeta-resultado-link"
                  onClick={() => setTerminoBusqueda('')} // Limpia la búsqueda al hacer clic para ir al producto
                >
                  <div className="tarjeta-resultado">
                    <img
                      src={
                        prod.imagen && prod.imagen.includes('cloudinary.com')
                          ? prod.imagen.replace('/upload/', '/upload/w_150,c_fill,f_auto,q_auto/')
                          : (prod.imagen || 'https://via.placeholder.com/150')
                      }
                      alt={prod.nombre}
                      className="resultado-img"
                    />
                    <div className="resultado-info">
                      <h4>{prod.nombre}</h4>
                      <span className="resultado-cat">Categoría: {prod.categoria}</span>
                      
                      {esDestacado ? (
                        <div className="resultado-precios" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <span style={{ textDecoration: 'line-through', color: '#888', fontSize: '0.8rem' }}>
                            ${precioOriginal.toLocaleString('es-AR')}
                          </span>
                          <span style={{ fontWeight: 'bold', color: '#e63946', fontSize: '0.9rem' }}>
                            ${precioFinal.toLocaleString('es-AR')}
                          </span>
                        </div>
                      ) : (
                        <p className="resultado-precio" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                          ${precioOriginal.toLocaleString('es-AR')}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="sin-resultados-global">No se encontraron productos con ese nombre en toda la tienda.</p>
          )}
        </div>
      </div>
    </div>
  );
}