import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para navegar
import { db } from '../firebase/firebaseConfig.js'; 
import { collection, getDocs, query } from 'firebase/firestore';
import '../estilos/Productos.css';


export default function Producto() {
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate(); // 1. Inicializamos el hook de navegación

  useEffect(() => {
    const fetchData = async () => {
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
      }
    };
    fetchData();
  }, []);

  return (
    <section className="categorias-seccion">
      <h2 className="categorias-titulo">Explora nuestras categorías</h2>
      
      <div className="grid-categorias">
        {categorias.map((cat) => (
          <div 
            key={cat.id} 
            className="tarjeta"
            // 2. Agregamos el evento click para navegar
            onClick={() => navigate(`/productos/${cat.nombre.toLowerCase()}`)}
            style={{ cursor: 'pointer' }} 
          >
            <div className="icono">{cat.nombre ? cat.nombre[0] : 'C'}</div> 
            <h3>{cat.nombre || 'Sin nombre'}</h3>
            <p>{cat.descripcion || 'Sin descripción'}</p>
          </div>
        ))}
      </div>
    </section>
  );
}