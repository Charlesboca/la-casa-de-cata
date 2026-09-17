// src/helpers/cloudinary.js

/**
 * Optimiza una URL de Cloudinary inyectando parámetros de compresión y tamaño.
 * @param {string} url - La URL original de la imagen.
 * @param {number} ancho - El ancho máximo deseado en píxeles (por defecto 800px).
 * @returns {string} La URL transformada y optimizada.
 */
export const optimizarImagen = (url, ancho = 800) => {
  // Si no hay URL o no es de Cloudinary, la devolvemos tal como vino para evitar errores
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) {
    return url || '';
  }

  // Insertamos las transformaciones justo después de la barra de /upload/
  // f_auto: Elige el mejor formato para el navegador (WebP, AVIF, etc.)
  // q_auto: Ajusta la compresión de forma inteligente sin perder calidad visual
  // w_res: Redimensiona al ancho exacto que necesitamos (adiós a los 3MB)
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${ancho}/`);
};