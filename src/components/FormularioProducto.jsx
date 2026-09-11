import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase/firebaseConfig.js';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import '../estilos/FormularioProducto.css';

export default function FormularioProducto({ productoAEditar, onProductoGuardado, onCancelarEdicion }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  
  // 👉 Estado para el producto destacado
  const [destacado, setDestacado] = useState(false);
  
  // Soporte para múltiples archivos e imágenes existentes
  const [imagenesFiles, setImagenesFiles] = useState([]);
  const [imagenesExistentes, setImagenesExistentes] = useState([]); 
  
  const [listaCategorias, setListaCategorias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nombreGuardado, setNombreGuardado] = useState('');
  
  const inputFileRef = useRef(null);

  const esEdicion = Boolean(productoAEditar);

  // Cargar categorías iniciales
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categorias"));
        const categoriasData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setListaCategorias(categoriasData);
        if (!esEdicion && categoriasData.length > 0) {
          setCategoria(categoriasData[0].nombre.toLowerCase());
        }
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };
    fetchCategorias();
  }, [esEdicion]);

  // Si pasamos un producto para editar, rellenamos el formulario
  useEffect(() => {
    if (productoAEditar) {
      setNombre(productoAEditar.nombre || '');
      setDescripcion(productoAEditar.descripcion || '');
      setPrecio(productoAEditar.precio || '');
      setCategoria(productoAEditar.categoria || '');
      // 👉 Seteamos el estado de destacado si existe, sino false por defecto
      setDestacado(Boolean(productoAEditar.destacado));
      
      // Manejamos si el producto viejo tiene un array de imágenes o una sola foto suelta ("imagen")
      if (productoAEditar.imagenes && Array.isArray(productoAEditar.imagenes)) {
        setImagenesExistentes(productoAEditar.imagenes);
      } else if (productoAEditar.imagen) {
        setImagenesExistentes([productoAEditar.imagen]);
      } else {
        setImagenesExistentes([]);
      }
    } else {
      limpiarFormulario();
    }
  }, [productoAEditar]);

  const limpiarFormulario = () => {
    setNombre('');
    setDescripcion('');
    setPrecio('');
    setDestacado(false); // 👉 Limpiamos el checkbox
    setImagenesFiles([]);
    setImagenesExistentes([]);
    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
  };

  // Función para subir múltiples imágenes a Cloudinary
  const subirImagenesACloudinary = async () => {
    let urlsSubidas = [];
    
    for (let file of imagenesFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "rowasound_upload"); // Tu preset actual
      
      try {
        const res = await fetch("https://api.cloudinary.com/v1_1/djl3xx2lo/image/upload", { 
          method: "POST", 
          body: formData 
        });
        const data = await res.json();
        if (data.secure_url) {
          urlsSubidas.push(data.secure_url);
        }
      } catch (error) {
        console.error("Error al subir imagen a Cloudinary:", error);
      }
    }
    
    return urlsSubidas;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nombre || !precio || !categoria) {
      setMensaje({ texto: 'Por favor, completá al menos el nombre, el precio y la categoría.', tipo: 'error' });
      return;
    }

    setCargando(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      // 👉 EXCLUSIVIDAD: Si este producto se marca como destacado, 
      // buscamos y desactivamos cualquier otro que estuviera destacado antes.
      if (destacado) {
        const q = query(collection(db, "productos"), where("destacado", "==", true));
        const querySnapshot = await getDocs(q);
        const batch = writeBatch(db);
        
        querySnapshot.forEach((docSnap) => {
          // Si estamos editando, evitamos apagar el producto actual
          if (!esEdicion || docSnap.id !== productoAEditar.id) {
            batch.update(docSnap.ref, { destacado: false });
          }
        });
        await batch.commit();
      }

      // 1. Subimos las nuevas fotos seleccionadas
      const nuevasUrls = await subirImagenesACloudinary();

      // 2. Combinamos las imágenes que ya tenía con las nuevas
      const todasLasImagenes = [...imagenesExistentes, ...nuevasUrls];
      
      // Si no hay ninguna imagen, dejamos un placeholder por defecto
      const galeriaFinal = todasLasImagenes.length > 0 ? todasLasImagenes : ['https://via.placeholder.com/150'];

      if (esEdicion) {
        // --- MODIFICACIÓN ---
        const productoRef = doc(db, "productos", productoAEditar.id);
        await updateDoc(productoRef, {
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
          precio: Number(precio),
          categoria: categoria.toLowerCase().trim(),
          destacado: destacado, // 👉 Guardamos el booleano exclusivo
          imagenes: galeriaFinal,
          imagen: galeriaFinal[0] 
        });
        setNombreGuardado(nombre.trim());
        setModalAbierto(true);
      } else {
        // --- ALTA (CREACIÓN) ---
        await addDoc(collection(db, "productos"), {
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
          precio: Number(precio),
          categoria: categoria.toLowerCase().trim(),
          destacado: destacado, // 👉 Guardamos el booleano exclusivo
          imagenes: galeriaFinal,
          imagen: galeriaFinal[0],
          createdAt: new Date()
        });
        setNombreGuardado(nombre.trim());
        setModalAbierto(true);
        limpiarFormulario();
      }

      if (onProductoGuardado) {
        onProductoGuardado();
      }

    } catch (error) {
      console.error("Error al guardar el producto: ", error);
      setMensaje({ texto: 'Hubo un error al guardar el producto. Intentá de nuevo.', tipo: 'error' });
    } finally {
      setCargando(false);
    }
  };

  const handleDelete = async () => {
    if (!productoAEditar) return;
    
    const confirmar = window.confirm(`¿Estás seguro de eliminar el producto "${productoAEditar.nombre}"?`);
    if (!confirmar) return;

    setCargando(true);
    try {
      await deleteDoc(doc(db, "productos", productoAEditar.id));
      alert('Producto eliminado correctamente.');
      limpiarFormulario();
      if (onProductoGuardado) onProductoGuardado();
      if (onCancelarEdicion) onCancelarEdicion();
    } catch (error) {
      console.error("Error al eliminar:", error);
      setMensaje({ texto: 'Error al intentar eliminar el producto.', tipo: 'error' });
    } finally {
      setCargando(false);
    }
  };

  const eliminarImagenExistente = (indexParaBorrar) => {
    setImagenesExistentes(imagenesExistentes.filter((_, index) => index !== indexParaBorrar));
  };

  return (
    <> 
      <div className="encabezado-form-accion">
        <h1 className="titulo-principal-formulario">
          {esEdicion ? 'Modificar Producto' : 'Agregar Producto'}
        </h1>
        {esEdicion && (
          <button type="button" className="btn-cancelar-edicion" onClick={onCancelarEdicion}>
            Cancelar Edición
          </button>
        )}
      </div>

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

          {/* 👉 CHECKBOX DE PRODUCTO DESTACADO (EXCLUSIVO) */}
          <div className="formulario-grupo" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
            <input 
              type="checkbox" 
              id="destacadoCheck"
              checked={destacado} 
              onChange={(e) => setDestacado(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <label htmlFor="destacadoCheck" style={{ cursor: 'pointer', color: '#fff', fontWeight: 'bold' }}>
              ⭐ Marcar como Producto Destacado (Reemplazará al anterior en el Home)
            </label>
          </div>

          {/* SECCIÓN DE MÚLTIPLES IMÁGENES */}
          <div className="formulario-grupo" style={{ marginTop: '15px' }}>
            <label>Imágenes del producto (Podés seleccionar varias):</label>
            <input 
              type="file" 
              ref={inputFileRef} 
              multiple
              accept="image/*"
              onChange={(e) => setImagenesFiles(Array.from(e.target.files))} 
              style={{ color: '#ccc' }}
            />
          </div>

          {/* Previsualización de imágenes ya guardadas (si está editando) */}
          {imagenesExistentes.length > 0 && (
            <div className="preview-imagenes-container">
              <label>Imágenes actuales:</label>
              <div className="grid-miniaturas-preview">
                {imagenesExistentes.map((url, idx) => (
                  <div key={idx} className="miniatura-box">
                    <img src={url} alt="preview" />
                    <button type="button" onClick={() => eliminarImagenExistente(idx)}>❌</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="contenedor-botones-accion">
            <button 
              type="submit" 
              className="btn-guardar"
              disabled={cargando}
            >
              {cargando ? 'Procesando imágenes y guardando...' : (esEdicion ? 'Actualizar Producto' : 'Guardar Producto')}
            </button>

            {esEdicion && (
              <button 
                type="button" 
                className="btn-eliminar-rojo" 
                onClick={handleDelete}
                disabled={cargando}
              >
                Eliminar Producto
              </button>
            )}
          </div>
        </form>
      </div>

      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-contenido">
            <h3>¡Éxito! 🎉</h3>
            <p>El producto <strong>{nombreGuardado}</strong> se {esEdicion ? 'actualizó' : 'guardó'} correctamente en La Casa de Cata.</p>
            <button 
              className="btn-cerrar-modal" 
              onClick={() => {
                setModalAbierto(false);
                if (esEdicion && onCancelarEdicion) onCancelarEdicion();
              }}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </>
  );
}