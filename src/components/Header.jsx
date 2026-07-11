import { useState } from 'react';
import { Link } from 'react-router-dom'; // 1. Importá Link
import logoBazar from '../assets/Logo-casa-cata.jpeg';
import Navbar from './NavBar'; 
import '../estilos/Header.css';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="header-wrapper">
      <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      {/* 2. Envolvé la imagen con el componente Link */}
      <div className="logo-container">
        <Link to="/">
          <img src={logoBazar} alt="Logo La Casa de Cata" />
        </Link>
      </div>

      <Navbar isOpen={isOpen} closeMenu={closeMenu} />
    </header>
  );
}