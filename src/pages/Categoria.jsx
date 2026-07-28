import { useState } from 'react';
import { Link } from 'react-router-dom';
import { categoriasFijas } from '../data/categoriasData.js'; // 👈 Importamos los datos locales
import '../estilos/Categoria.css';

export default function Categoria() {
  // Ya no necesitamos useEffect ni Firestore, pasamos los datos fijos directo
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
          >
            <div className="icono">{cat.nombre ? cat.nombre[0] : 'C'}</div> 
            <h3>{cat.nombre || 'Sin nombre'}</h3>
            <p>{cat.descripcion || 'Sin descripción'}</p>
            
            {/* 🖼️ Imagen local en formato WebP cargando al instante */}
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