/**
 * SCRIPT: MIGRAR CAMPO MADRE (BOOLEANO) - LA CASA DE CATA
 * Objetivo: Agregar el campo 'madre: false' a todos los productos del bazar que no lo tengan.
 */

const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("./serviceAccountKey.json");

// ==========================================
// CONFIGURACIÓN DE LA COLECCIÓN A MIGRAR
// ==========================================
const COLECCION_NOMBRE = "productos"; 

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore();

async function agregarCampoMadreBooleano() {
  console.log(`\n🚀 [${new Date().toLocaleTimeString()}] Iniciando migración de campo 'madre' (booleano) para La Casa de Cata en '${COLECCION_NOMBRE}'...`);

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

      // Si el campo 'madre' no existe, le asignamos false por defecto
      if (typeof data.madre === "undefined") {
        batch.update(productoRef, { madre: false });
        contadorModificados++;
        console.log(`📦 Actualizando: ${data.nombre || doc.id} -> madre: false`);
      }
    });

    if (contadorModificados > 0) {
      await batch.commit();
      console.log(`\n============================================================`);
      console.log(`✅ [PROCESO EXITOSO - LA CASA DE CATA]`);
      console.log(`🚀 Se actualizaron ${contadorModificados} documentos con el campo 'madre: false'.`);
      console.log(`============================================================\n`);
    } else {
      console.log(`\n✨ Todos los documentos en '${COLECCION_NOMBRE}' ya tenían el campo 'madre'. No hubo cambios necesarios.`);
    }

  } catch (error) {
    console.error("\n🚨 Error crítico en el proceso:", error);
  }
}

agregarCampoMadreBooleano();