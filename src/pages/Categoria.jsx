import { useState } from 'react';
import { Link } from 'react-router-dom';
import { categoriasFijas } from '../data/categoriasData.js';
import '../estilos/Categoria.css';

export default function Categoria() {
  const [categorias] = useState(categoriasFijas);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // O podés sacar el behavior si querés que suba de golpe sin animación
  };

  return (
    <section className="categorias-seccion">
      <h2 className="categorias-titulo">Explora nuestras categorías</h2>
      
      <div className="grid-categorias">
        {categorias.map((cat) => (
          <Link 
            to={`/productos/${cat.nombre.toLowerCase()}`}
            key={cat.id} 
            className="tarjeta"
            style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
            onClick={handleScrollTop}
          >
            <div className="icono">{cat.nombre ? cat.nombre[0] : 'C'}</div> 
            <h3>{cat.nombre || 'Sin nombre'}</h3>
            <p>{cat.descripcion || 'Sin descripción'}</p>
            
            <img 
              src={cat.imagen} 
              alt={cat.nombre || 'Categoría'} 
              className="imagen-categoria" 
              loading="lazy"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}