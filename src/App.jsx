// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Inicio from './pages/Inicio.jsx';

import Categoria from './pages/Categoria.jsx';
import ProductosPorCategoria from './pages/ProductosPorCategoria.jsx';
import ItemDetail from './pages/ItemDetail.jsx';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<Categoria />} />
          <Route path="/productos/:catName" element={<ProductosPorCategoria />} />
          <Route path="/producto/:id" element={<ItemDetail />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App;