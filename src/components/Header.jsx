import { useState } from 'react';
import { Link } from 'react-router-dom';
import logoBazar from '../assets/Logo-casa-cata-achicado.webp';
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

      <div className="logo-container">
        <Link 
          to="/" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img src={logoBazar} alt="Logo La Casa de Cata" />
        </Link>
      </div>

      <Navbar isOpen={isOpen} closeMenu={closeMenu} />
    </header>
  );
}