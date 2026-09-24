// src/components/Layout.jsx
import Header from './Header';
import Footer from './Footer';
import ResultadosBusquedaGlobal from './ResultadosBusquedaGlobal'; // 1. Importamos el componente flotante

export default function Layout({ children }) {
  return (
    // Agregamos bg-white aquí para asegurar que todo el fondo sea blanco
    <div className="flex flex-col min-h-screen bg-white" style={{ position: 'relative' }}>
      <Header />
      
      {/* 2. El panel flotante vive acá y aparecerá en cualquier página */}
      <ResultadosBusquedaGlobal />

      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}