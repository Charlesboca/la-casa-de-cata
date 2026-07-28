import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase/firebaseConfig.js';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import '../estilos/FormularioProducto.css';

export default function FormularioProducto({ onProductoAgregado }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  
  const [imagenFile, setImagenFile] = useState(null);
  const [listaCategorias, setListaCategorias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  
  // 👈 Nuevo estado para controlar la visibilidad del Modal
  const [modalAbierto, setModalAbierto] = useState(false);
  
  const inputFileRef = useRef(null);

  const [nombreGuardado, setNombreGuardado] = useState(''); // 👈 Nuevo estado

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categorias"));
        const categoriasData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setListaCategorias(categoriasData);
        if (categoriasData.length > 0) {
          setCategoria(categoriasData[0].nombre.toLowerCase());
        }
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };
    fetchCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nombre || !precio || !categoria) {
      setMensaje({ texto: 'Por favor, completá al menos el nombre, el precio y la categoría.', tipo: 'error' });
      return;
    }

    setCargando(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      let imagenUrl = 'https://via.placeholder.com/150';

      if (imagenFile) {
        const formData = new FormData();
        formData.append("file", imagenFile);
        formData.append("upload_preset", "rowasound_upload");
        
        const res = await fetch("https://api.cloudinary.com/v1_1/djl3xx2lo/image/upload", { 
          method: "POST", 
          body: formData 
        });
        const data = await res.json();
        
        if (data.secure_url) {
          imagenUrl = data.secure_url;
        }
      }

      // Si Firebase guarda correctamente, avanza sin ir al catch
      await addDoc(collection(db, "productos"), {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: Number(precio),
        categoria: categoria.toLowerCase().trim(),
        imagen: imagenUrl,
        createdAt: new Date()
      });

      // Guardamos el nombre en una variable temporal antes de limpiar el estado
     // ❌ Borrá esto:
      // const nombreGuardado = nombre;

      // ✅ Poné esto en su lugar:
      setNombreGuardado(nombre.trim());

      // 🚀 Activamos el modal de éxito
      setModalAbierto(true);
      
      // Limpiamos los campos
      setNombre('');
      setDescripcion('');
      setPrecio('');
      setImagenFile(null);

      if (inputFileRef.current) {
        inputFileRef.current.value = '';
      }

      if (onProductoAgregado) {
        onProductoAgregado();
      }

    } catch (error) {
      console.error("Error al agregar el producto: ", error);
      setMensaje({ texto: 'Hubo un error al guardar el producto. Intentá de nuevo.', tipo: 'error' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <> 
      <h1 className="titulo-principal-formulario">Agregar Producto</h1>

      <div className="formulario-contenedor">
        
        {mensaje.texto && (
          <div className={`mensaje-alerta ${mensaje.tipo}`}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="formulario-grupo">
            <label>Nombre del producto:</label>
            <input 
              type="text" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              placeholder="Ej: Set de mates rústicos"
              required 
            />
          </div>

          <div className="formulario-grupo">
            <label>Descripción:</label>
            <textarea 
              value={descripcion} 
              onChange={(e) => setDescripcion(e.target.value)} 
              placeholder="Detalles, medidas o materiales..."
            />
          </div>

          <div className="formulario-grupo">
            <label>Precio ($):</label>
            <input 
              type="number" 
              value={precio} 
              onChange={(e) => setPrecio(e.target.value)} 
              placeholder="Ej: 4500"
              required 
            />
          </div>

          <div className="formulario-grupo">
            <label>Categoría / Rubro:</label>
            <select 
              value={categoria} 
              onChange={(e) => setCategoria(e.target.value)}
            >
              {listaCategorias.map((cat) => (
                <option key={cat.id} value={cat.nombre.toLowerCase()}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="formulario-grupo">
            <label>Imagen del producto:</label>
            <input 
              type="file" 
              ref={inputFileRef} 
              accept="image/*"
              onChange={(e) => setImagenFile(e.target.files[0])} 
              style={{ color: '#ccc' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn-guardar"
            disabled={cargando}
          >
            {cargando ? 'Subiendo imagen y guardando...' : 'Guardar Producto'}
          </button>
        </form>
      </div>

      {/* 🌟 MODAL DE ÉXITO */}
      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-contenido">
            <h3>¡Éxito! 🎉</h3>
            {/* 👈 Acá usamos la variable temporal que no se borró */}
            <p>El producto <strong>{nombreGuardado}</strong> se guardó correctamente en La Casa de Cata.</p>
                        <button 
              className="btn-cerrar-modal" 
              onClick={() => setModalAbierto(false)}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </>
  );
}