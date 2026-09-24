import { createContext, useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig.js';
import { collection, getDocs } from 'firebase/firestore';

// ==========================================
// 1. CREACIÓN DEL CANAL GLOBAL (EL CONTEXTO)
// ==========================================
export const ProductosContext = createContext();

// ==========================================
// 2. CREACIÓN DEL PROVIDER (LA ESTACIÓN EMISORA)
// ==========================================
export const ProductosProvider = ({ children }) => {
  
  // Estado 1: Array con todos los productos de Firebase.
  const [productos, setProductos] = useState([]);
  
  // Estado 2: Banderita de carga (true/false).
  const [cargando, setCargando] = useState(true);

  // 🔍 Estado 3: Término de búsqueda global para filtrar en todo el sitio
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  // Definimos qué colección de Firebase vamos a consultar.
  const COLECCION_ACTIVA = "productos"; 

  // ==========================================
  // 3. EFECTO DE CARGA ÚNICA (EL LLAMADO A FIREBASE)
  // ==========================================
  useEffect(() => {
    const fetchTodosLosProductos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, COLECCION_ACTIVA));
        
        const listaProductos = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        listaProductos.sort((a, b) => a.nombre.localeCompare(b.nombre));
        
        setProductos(listaProductos);

      } catch (error) {
        console.error("Error al cargar la base de datos:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchTodosLosProductos();

  }, []); 

  // ==========================================
  // 4. EMISIÓN DE LA SEÑAL (EL WI-FI)
  // ==========================================
  return (
    // Agregamos 'terminoBusqueda' y 'setTerminoBusqueda' al valor compartido del Context
    <ProductosContext.Provider value={{ productos, cargando, terminoBusqueda, setTerminoBusqueda }}>
      {children} 
    </ProductosContext.Provider>
  );
};
