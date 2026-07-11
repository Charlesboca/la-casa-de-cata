// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Inicio from './pages/Inicio.jsx';
import Producto from './pages/Producto.jsx';
import CategoriaDetail from './pages/CategoriaDetail.jsx';
import ItemDetail from './pages/ItemDetail.jsx';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<Producto />} />
          <Route path="/productos/:catName" element={<CategoriaDetail />} />
          <Route path="/producto/:id" element={<ItemDetail />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App;