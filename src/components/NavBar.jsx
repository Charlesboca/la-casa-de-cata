import { Link } from 'react-router-dom';

// components/Navbar.jsx
export default function Navbar({ isOpen, closeMenu }) {
  return (
    <nav className={`nav-vertical ${isOpen ? "open" : ""}`}>
      {/* Al hacer clic en cualquier Link, ejecutamos closeMenu() */}
      <Link to="/" onClick={closeMenu}>Inicio</Link>
      <Link to="/productos" onClick={closeMenu}>Productos</Link>
{/*       <Link to="/carrito" onClick={closeMenu}>Carrito</Link>
 */}    </nav>
  );
}