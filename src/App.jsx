// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Inicio from './pages/Inicio.jsx';

import Categoria from './pages/Categoria.jsx';
import ProductosPorCategoria from './pages/ProductosPorCategoria.jsx';
import ItemDetail from './pages/ItemDetail.jsx';
import FormularioProducto from './components/FormularioProducto.jsx'; // 👈 1. Importamos el formulario

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<Categoria />} />
          <Route path="/productos/:catName" element={<ProductosPorCategoria />} />
          <Route path="/producto/:id" element={<ItemDetail />} />
          <Route path="/panel-producto" element={<FormularioProducto />} /> {/* 👈 2. Ruta para agregar producto */}
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}


export default App;