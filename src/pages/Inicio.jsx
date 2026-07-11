import { Link } from 'react-router-dom';

import '../estilos/Inicio.css'; // Importamos el CSS
import '../estilos/Horarios.css'; // Importamos el CSS


export default function Inicio() {
  return (
    <div className="inicio-container">
      <section className="banner">
        <h1>Bienvenidos a <span>La Casa de Cata</span></h1>
        <p>Todo lo que tu hogar necesita, con la calidad y confianza de siempre.</p>
      </section>

      <section className="servicios-container">
        <h2 className="titulo-seccion">Nuestros Servicios</h2>
        <div className="grid-servicios">
          <div className="tarjeta-servicio">
            <span className="icono">🖨️</span>
            <h3>Fotocopias e Impresiones</h3>
            <p>Blanco y negro o color, alta calidad para tus trabajos escolares o laborales.</p>
          </div>
          
          <div className="tarjeta-servicio">
            <span className="icono">📋</span>
            <h3>Gestión de Trámites</h3>
            <p>Tramitamos tus antecedentes, constancias de CUIL, ANSES y más trámites online.</p>
          </div>

          <div className="tarjeta-servicio">
            <span className="icono">🌐</span>
            <h3>Trámites Online</h3>
            <p>Asistencia personalizada para trámites digitales complejos y consultas web.</p>
          </div>
        
        {/* Tarjeta de Acceso a Productos */}
        <Link to="/productos" className="tarjeta-servicio tarjeta-especial">
          <span className="icono">🛍️</span>
          <h3>Ver Productos</h3>
          <p>Explorá todo nuestro catálogo de bazar y novedades que tenemos para vos.</p>
          <span className="ver-mas">Ir a la tienda →</span>
        </Link>
        

        </div>
      </section>



        {/* Nueva Sección de Horarios */}
            <section className="seccion-horarios">
                <h2 className="horarios-titulo">Horarios de Atención</h2>
                <div className="horarios-grid">
                <div className="horario-card">
                    <h3>Lunes a Viernes</h3>
                    <p className="hora">08:00 - 12:00</p>
                    <p className="hora">17:00 - 20:00</p>

                </div>
                <div className="horario-card">
                    <h3>Sábados</h3>
                    <p className="hora">09:00 - 12:00</p>
                     <p className="hora">17:00 - 20:00</p>

                </div>
                <div className="horario-card">
                    <h3>Domingos</h3>
                    <p className="estado">Cerrado</p>
                </div>
                </div>
            </section>

    </div>
  );
}