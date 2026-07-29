import { Link } from 'react-router-dom';
import '../estilos/Footer.css';
import logoFooter from '../assets/Logo-casa-cata-achicado.webp';

export default function Footer() {
  // Función para volver al inicio con un scroll suave
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-container">
      <div className="footer-grid">
        
        {/* Columna: Logo que navega al inicio y hace scroll */}
        <div className="footer-scroll-top">
          <Link to="/" onClick={scrollToTop} aria-label="Volver al inicio">
            <img 
              src={logoFooter} 
              alt="Logo La Casa de Cata" 
              className="footer-logo"
            />
          </Link>
        </div>

        {/* Columna 1: Info del Bazar */}
        <div className="footer-column">
          <h3>La Casa de Cata</h3>
          <p>Tu bazar de confianza en el barrio. Calidad y buenos precios.</p>
        </div>

        {/* Columna 2: Enlaces rápidos */}
        <div className="footer-column">
         
        </div>

        {/* Columna 3: Ubicación */}
          <div className="footer-column">
            <h3>Ubicación</h3>
            <p>
              <a 
                href="https://maps.google.com/?q=Villa+Margarita+La+Leonesa+Chaco" 
                target="_blank" 
                rel="noopener noreferrer"
                className="enlace-mapa"
              >
                Villa Margarita, La Leonesa 📍
              </a>
            </p>
          </div>
      </div>
      
      <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} La Casa de Cata. Todos los derechos reservados.</p>
          <p className="footer-credits">
            Desarrollado por <a href="https://mi-portfolio-carlos-avalos.vercel.app/" target="_blank" rel="noopener noreferrer" className="link-autor">Carlos Avalos</a>
          </p>
      </div>

    </footer>
  );
}