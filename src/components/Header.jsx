import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import logoBazar from '../assets/Logo-casa-cata-achicado.webp';
import Navbar from './NavBar'; 
import { ProductosContext } from '../context/ProductosContext';
import '../estilos/Header.css';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  const { terminoBusqueda, setTerminoBusqueda } = useContext(ProductosContext);

  return (
    <header className="header-wrapper header-fravega-layout">
      {/* 1. Izquierda: Logo + Botón Menú */}
      <div className="header-left-section">
        <button className="menu-btn" onClick={() => setIsOpen(!isOpen)} title="Menú">
          ☰
        </button>
        
        <div className="logo-container-fravega">
          <Link 
            to="/" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img src={logoBazar} 
              alt="Logo La Casa de Cata" 
              fetchPriority="high"
            />
          </Link>
        </div>
      </div>

      {/* 2. Centro: Buscador ancho central estilo Frávega */}
      <div className="header-center-section">
        <div className="contenedor-buscador-header">
          <input 
            type="text" 
            placeholder="Fijate en La Casa de Cata..." 
            value={terminoBusqueda}
            onChange={(e) => setTerminoBusqueda(e.target.value)}
            className="input-buscador-header"
          />
          {terminoBusqueda && (
            <button 
              className="btn-limpiar-busqueda" 
              onClick={() => setTerminoBusqueda('')}
              title="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
          <span className="icono-lupa-fravega">🔍</span>
        </div>
      </div>

      {/* 3. Derecha: Navbar / Opciones */}
      <div className="header-right-section">
        <Navbar isOpen={isOpen} closeMenu={closeMenu} />
      </div>
    </header>
  );
}