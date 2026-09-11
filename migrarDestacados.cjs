/**
 * SCRIPT: MIGRAR CAMPO DESTACADO EN PRODUCTOS
 * Objetivo: Agregar el campo 'destacado: false' a todos los productos de la colección seleccionada que no lo tengan.
 */

const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("./serviceAccountKey.json");

// ==========================================
// CONFIGURACIÓN DE LA COLECCIÓN A MIGRAR
// ==========================================
const COLECCION_NOMBRE = "productos"; // Cambiá a "productos" cuando pases a producción

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore();

async function agregarCampoDestacado() {
  console.log(`\n🚀 [${new Date().toLocaleTimeString()}] Iniciando migración en la colección '${COLECCION_NOMBRE}'...`);

  try {
    const snapshot = await db.collection(COLECCION_NOMBRE).get();

    if (snapshot.empty) {
      console.log(`⚠️ No se encontraron documentos en la colección '${COLECCION_NOMBRE}'.`);
      return;
    }

    const batch = db.batch();
    let contadorModificados = 0;

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const productoRef = db.collection(COLECCION_NOMBRE).doc(doc.id);

      // Si el campo 'destacado' no existe, lo agregamos en false
      if (typeof data.destacado === "undefined") {
        batch.update(productoRef, { destacado: false });
        contadorModificados++;
        console.log(`📦 Actualizando: ${data.nombre || doc.id} -> destacado: false`);
      }
    });

    if (contadorModificados > 0) {
      await batch.commit();
      console.log(`\n============================================================`);
      console.log(`✅ [PROCESO EXITOSO]`);
      console.log(`🚀 Se actualizaron ${contadorModificados} documentos en '${COLECCION_NOMBRE}' con el campo 'destacado: false'.`);
      console.log(`============================================================\n`);
    } else {
      console.log(`\n✨ Todos los documentos en '${COLECCION_NOMBRE}' ya tenían el campo 'destacado'. No hubo cambios necesarios.`);
    }

  } catch (error) {
    console.error("\n🚨 Error crítico en el proceso:", error);
  }
}

agregarCampoDestacado();