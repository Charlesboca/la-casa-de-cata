import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/firebaseConfig.js'; 
import { collection, getDocs, query } from 'firebase/firestore';
import '../estilos/Categoria.css';

export default function Categoria() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true); // 👈 1. Agregamos estado de carga
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "categorias"));
        const querySnapshot = await getDocs(q);
        
        const listaCategorias = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setCategorias(listaCategorias);
      } catch (error) {
        console.error("Error al obtener categorías: ", error);
      } finally {
        setLoading(false); // 👈 Apagamos el loading cuando responde Firestore
      }
    };
    fetchData();
  }, []);

  return (
    <section className="categorias-seccion">
      <h2 className="categorias-titulo">Explora nuestras categorías</h2>
      
      {loading ? (
        <p style={{ textAlign: 'center', color: '#ccc' }}>Cargando categorías...</p>
      ) : (
        <div className="grid-categorias">
          {categorias.map((cat) => (
            <div 
              key={cat.id} 
              className="tarjeta"
              onClick={() => navigate(`/productos/${cat.nombre.toLowerCase()}`)}
              style={{ cursor: 'pointer' }} 
            >
              <div className="icono">{cat.nombre ? cat.nombre[0] : 'C'}</div> 
              <h3>{cat.nombre || 'Sin nombre'}</h3>
              <p>{cat.descripcion || 'Sin descripción'}</p>
              
              {/* 🖼️ Imagen optimizada con Cloudinary */}
              <img 
                src={
                  cat.imagen && cat.imagen.includes('cloudinary.com')
                    ? cat.imagen.replace('/upload/', '/upload/w_250,c_fill,f_auto,q_auto/')
                    : (cat.imagen || 'https://via.placeholder.com/150')
                } 
                alt={cat.nombre || 'Categoría'} 
                className="imagen-categoria" 
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}