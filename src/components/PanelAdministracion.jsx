import { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig.js';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import FormularioProducto from './FormularioProducto';
import '../estilos/PanelAdministracion.css';

// Función helper para optimizar y comprimir imágenes de Cloudinary al vuelo
const optimizarImagenCloudinary = (urlOriginal, ancho = 300) => {
  if (!urlOriginal || !urlOriginal.includes('cloudinary.com')) {
    return urlOriginal;
  }

  const partes = urlOriginal.split('/upload/');
  if (partes.length !== 2) return urlOriginal;

  const transformaciones = `w_${ancho},f_auto,q_auto/`;
  return `${partes[0]}/upload/${transformaciones}${partes[1]}`;
};

export default function PanelAdministracion() {
  const [productos, setProductos] = useState([]);
  const [productoAEditar, setProductoAEditar] = useState(null);
  const [cargandoLista, setCargandoLista] = useState(true);

  // Función para traer todos los productos de Firestore
  const fetchProductos = async () => {
    setCargandoLista(true);
    try {
      const querySnapshot = await getDocs(collection(db, "productos"));
      const lista = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProductos(lista);
    } catch (error) {
      console.error("Error al cargar la lista de productos:", error);
    } finally {
      setCargandoLista(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // Función para borrar un producto directamente desde la lista
  const handleBorrarDesdeLista = async (id, nombre) => {
    if (!window.confirm(`¿Seguro querés eliminar el producto "${nombre}"?`)) return;
    
    try {
      await deleteDoc(doc(db, "productos", id));
      fetchProductos(); // Recargamos la lista automáticamente
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      alert("No se pudo eliminar el producto.");
    }
  };

  return (
    <div className="panel-admin-container">
      
      {/* 1. EL FORMULARIO (Se encarga de crear o de editar si le pasamos un producto) */}
      <FormularioProducto 
        productoAEditar={productoAEditar}
        onProductoGuardado={() => {
          setProductoAEditar(null); // Limpiamos la edición al guardar
          fetchProductos();        // Actualizamos la lista de abajo
        }}
        onCancelarEdicion={() => setProductoAEditar(null)}
      />

      <hr className="panel-admin-divider" />

      {/* 2. EL LISTADO DE PRODUCTOS EXISTENTES ABAJO */}
      <div className="panel-admin-listado-section">
        <h2 className="panel-admin-titulo">
          Listado de Productos (La Casa de Cata)
        </h2>
        
        {cargandoLista ? (
          <p className="panel-admin-mensaje">Cargando listado de productos...</p>
        ) : productos.length === 0 ? (
          <p className="panel-admin-mensaje">No hay productos cargados en este momento.</p>
        ) : (
          <div className="panel-admin-grid">
            {/* Aplicamos el .sort() para ordenar alfabéticamente por nombre antes del .map() */}
            {productos
              .sort((a, b) => a.nombre.localeCompare(b.nombre))
              .map((prod) => {
                // Determinamos qué imagen mostrar y la pasamos por el optimizador de Cloudinary
                const imagenOriginal = prod.imagen || (prod.imagenes && prod.imagenes[0]) || 'https://via.placeholder.com/150';
                const imagenCard = optimizarImagenCloudinary(imagenOriginal, 300);

                return (
                  <div key={prod.id} className="panel-admin-card">
                    <div>
                      <img 
                        src={imagenCard} 
                        alt={prod.nombre} 
                        className="panel-admin-card-img"
                      />
                      <span className="panel-admin-card-categoria">
                        {prod.categoria}
                      </span>
                      <h3 className="panel-admin-card-nombre">
                        {prod.nombre}
                      </h3>
                      <p className="panel-admin-card-precio">
                        ${prod.precio}
                      </p>
                    </div>

                    <div className="panel-admin-card-actions">
                      {/* Botón Editar: Carga los datos arriba en tu formulario */}
                      <button 
                        onClick={() => {
                          setProductoAEditar(prod);
                          window.scrollTo({ top: 0, behavior: 'smooth' }); // Te sube suavemente arriba
                        }}
                        className="btn-admin btn-editar"
                      >
                        Editar
                      </button>

                      {/* Botón Borrar */}
                      <button 
                        onClick={() => handleBorrarDesdeLista(prod.id, prod.nombre)}
                        className="btn-admin btn-borrar"
                      >
                        Borrar
                      </button>
                    </div>
                  </div>
                );
            })}
          </div>
        )}
      </div>

    </div>
  );
}