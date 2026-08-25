import { Link } from 'react-router-dom';
import '../estilos/PageNotFound.css';

export default function PageNotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">¡Página no encontrada!</h2>
        <p className="not-found-text">
          Che, parece que te perdiste o la página ya no está disponible por acá.
        </p>
        <Link to="/" className="not-found-btn">
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}