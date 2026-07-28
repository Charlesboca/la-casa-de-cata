import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';

// 1. Convertimos tus importaciones normales en carga perezosa (lazy)
const Inicio = lazy(() => import('./pages/Inicio.jsx'));
const Categoria = lazy(() => import('./pages/Categoria.jsx'));
const ProductosPorCategoria = lazy(() => import('./pages/ProductosPorCategoria.jsx'));
const ItemDetail = lazy(() => import('./pages/ItemDetail.jsx'));
const FormularioProducto = lazy(() => import('./components/FormularioProducto.jsx'));

// Un spinner o texto simple mientras carga el bloque de la página
const LoadingFallback = () => (
  <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
    Cargando...
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/productos" element={<Categoria />} />
            <Route path="/productos/:catName" element={<ProductosPorCategoria />} />
            <Route path="/producto/:id" element={<ItemDetail />} />
            <Route path="/panel-producto" element={<FormularioProducto />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  )
}

export default App;