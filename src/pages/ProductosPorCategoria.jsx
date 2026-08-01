import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase/firebaseConfig.js'; 
import { collection, query, where, getDocs } from 'firebase/firestore';
import SkeletonProducto from '../components/SkeletonProducto.jsx';
import '../estilos/ProductosPorCategoria.css';

export default function ProductosPorCategoria() {
  const { catName } = useParams();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState(''); // Estado para la barra de búsqueda

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    const fetchProductos = async () => {
      setLoading(true);
      setBusqueda(''); // Limpiamos la búsqueda al cambiar de categoría
      try {
        const q = query(collection(db, "productos"), where("categoria", "==", catName));
        const querySnapshot = await getDocs(q);
        
        const listaProductos = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // 🔤 Ordenamos alfabéticamente por nombre antes de meterlo al estado
        listaProductos.sort((a, b) => a.nombre.localeCompare(b.nombre));
        
        setProductos(listaProductos);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [catName]);

  // 🔍 Filtramos los productos según lo que escriba el usuario en el buscador
  const productosFiltrados = productos.filter(prod =>
    prod.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

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

      {/* 🔍 Input de búsqueda integrado */}
      {!loading && productos.length > 0 && (
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

      {loading ? (
        <div className="grid-productos">
            <SkeletonProducto />
            <SkeletonProducto />
            <SkeletonProducto />
        </div>
      ) : (
        <div className="grid-productos">
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map(prod => (
              <Link 
                to={`/producto/${prod.id}`} 
                state={{ producto: prod }} 
                key={prod.id} 
                className="tarjeta-producto-link"
              >
                <div className="tarjeta-producto">
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
                    <p>Precio: ${prod.precio}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="sin-productos">No se encontraron productos con ese nombre.</p>
          )}
        </div>
      )}
    </section>
  );
}