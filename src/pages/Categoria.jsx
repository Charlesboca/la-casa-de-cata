import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoriasFijas } from '../data/categoriasData.js';
import '../estilos/Categoria.css';

export default function Categoria() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <> 
      <section className="categorias-seccion">
        <h2 className="categorias-titulo">Explora nuestras categorías</h2>
        
        <div className="grid-categorias">
          {categoriasFijas.map((cat) => (
            <Link 
              to={`/productos/${cat.nombre.toLowerCase()}`}
              key={cat.id} 
              className="tarjeta"
            >
              {/* 🖼️ Imagen protagonista arriba */}
              <div className="contenedor-imagen-cat">
                <img 
                  src={cat.imagen} 
                  alt={cat.nombre || 'Categoría'} 
                  className="imagen-categoria" 
                  loading="lazy"
                />
              </div>

              {/* 🏷️ Título claro abajo */}
              <div className="info-tarjeta-cat">
                <h3>{cat.nombre || 'Sin nombre'}</h3>
                <span className="ver-mas-cat">Ver productos →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="contenedor-btn-volver">
        <button className="btn-volver-inicio">
          <Link 
            to="/" 
            className="link-volver-inicio"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            ← Volver al inicio
          </Link>
        </button>
      </div>
    </>
  );
}