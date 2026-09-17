import { createContext, useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig.js';
import { collection, getDocs } from 'firebase/firestore';

// ==========================================
// 1. CREACIÓN DEL CANAL GLOBAL (EL CONTEXTO)
// ==========================================
// Creamos el objeto Context. Este va a ser el "puente" o "canal de radio" 
// por donde van a viajar los datos hacia cualquier componente que los pida.
export const ProductosContext = createContext();

// ==========================================
// 2. CREACIÓN DEL PROVIDER (LA ESTACIÓN EMISORA)
// ==========================================
// El Provider es el componente padre que envuelve a toda la app. 
// Recibe "{ children }" que son todos los componentes hijos que viven adentro suyo
//  (App,productosporcategoria Layout, Rutas, etc.).
export const ProductosProvider = ({ children }) => {
  
  // Estado 1: Acá creamos que guardara el array con todos los productos que traemos de Firebase. Arranca vacío ([]).
  const [productos, setProductos] = useState([]);
  
  // Estado 2: La banderita (true/false) para saber si los datos se están cargando o ya llegaron.
  // Arranca en 'true' porque al abrir la página todavía estamos esperando la respuesta de Firebase.
  // es para saber cuando se usa el spinner de carga o el mensaje de "Cargando..." en la app.
  const [cargando, setCargando] = useState(true);

  // Definimos qué colección de Firebase vamos a consultar (tu base de prueba).
  const COLECCION_ACTIVA = "productos"; 

  // ==========================================
  // 3. EFECTO DE CARGA ÚNICA (EL LLAMADO A FIREBASE)
  // ==========================================
  useEffect(() => {
    // Definimos una función asíncrona para ir a buscar los datos a la base de datos
    const fetchTodosLosProductos = async () => {
      try {
        // Pedimos A FIREBASE UNA SOLA VEZ todos los documentos de la colección
        const querySnapshot = await getDocs(collection(db, COLECCION_ACTIVA));
        
        // Transformamos los datos crudos de Firebase en un array limpio de objetos de JavaScript.
        // A cada documento le inyectamos su ID propio y el resto de sus propiedades (...doc.data()).
        const listaProductos = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Ordenamos la lista alfabéticamente por nombre una sola vez para que ya quede prolija en memoria
        listaProductos.sort((a, b) => a.nombre.localeCompare(b.nombre));
        
        // Guardamos todos los productos en el estado global "productos"
        setProductos(listaProductos);

      } catch (error) {
        // Si llega a haber un error de red o de permisos, lo atrapamos acá en la consola
        console.error("Error al cargar la base de datos:", error);
      } finally {
        // Haya salido bien o mal la consulta, apagamos la banderita de carga (pasamos a false).
        // Esto le avisa a la app que el "spinner" o cartel de carga ya debe desaparecer.
        setCargando(false);
      }
    };

    // Ejecutamos la función de búsqueda de inmediato
    fetchTodosLosProductos();

  }, []); // 👈 ARRAY VACÍO: Este corchete vacío es la clave absoluta. 
          // Le dice a React: "Ejecutá este código UNA SOLA VEZ cuando el Provider se monte en la pantalla 
          // (al iniciar la página) y nunca más". Acá evitamos quemar la cuota de Firebase.

  // ==========================================
  // 4. EMISIÓN DE LA SEÑAL (EL WI-FI)
  // ==========================================
  return (
    // El componente .Provider envuelve a toda la app ({children}).
    // En la propiedad 'value' metemos el paquete de datos que queremos compartir con el mundo:
    // - productos (la mercadería lista para filtrar)
    // - cargando (el estado del semáforo: true/false)
    <ProductosContext.Provider value={{ productos, cargando }}>
      {children} 
      {/* {children} permite que todos tus componentes hijos se muestren en pantalla con normalidad, */}
      {/* pero ahora con la ventaja de estar bajo la cobertura del "Wi-Fi" de datos de este Context. */}
    </ProductosContext.Provider>
  );
};