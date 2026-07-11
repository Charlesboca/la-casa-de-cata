import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // 1. Agregamos Link
import { db } from '../firebase/firebaseConfig.js'; 
import { collection, query, where, getDocs } from 'firebase/firestore';
import SkeletonProducto from '../components/SkeletonProducto';
import '../estilos/CategoriaDetail.css';



export default function CategoriaDetail() {
  const { catName } = useParams();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   const fetchProductos = async () => {
  setLoading(true);
  try {
    const q = query(collection(db, "productos"), where("categoria", "==", catName));
    const querySnapshot = await getDocs(q);
    
    const listaProductos = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Eliminamos el setTimeout y actualizamos el estado de inmediato
    setProductos(listaProductos);
    setLoading(false);

  } catch (error) {
    console.error("Error al cargar productos:", error);
    setLoading(false);
  }
};

    fetchProductos();
  }, [catName]);

  return (
    <section>

      {/* 1. Agregamos el botón de volver */}
      <div className="contenedor-volver">
        <Link to="/productos" className="btn-volver">
          ← Volver a categorías
        </Link>
      </div>

      <h2 className="titulo-categoria">
        Productos de la categoría: {catName}
      </h2>

      {loading ? (
        <div className="grid-productos">
            <SkeletonProducto />
            <SkeletonProducto />
            <SkeletonProducto />
        </div>
      ) : (
        <div className="grid-productos">
          {productos.length > 0 ? (
            productos.map(prod => (
              // 2. Envolvemos la tarjeta en un Link hacia el detalle
              <Link to={`/producto/${prod.id}`} key={prod.id} className="tarjeta-producto-link">
                <div className="tarjeta-producto">
                   <img
                    src={prod.imagen}
                    alt={prod.nombre}
                    className="producto-img"
  />
                  <h3>{prod.nombre}</h3>
                  <p>Precio: ${prod.precio}</p>
                </div>
              </Link>
            ))
          ) : (
            <p>No hay productos en esta categoría todavía.</p>
          )}
        </div>
      )}
    </section>
  );
}