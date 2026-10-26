/**
 * SCRIPT: QUITAR CAMPO MADRE - LA CASA DE CATA
 * Objetivo: Eliminar el campo 'madre' de todos los productos del bazar en Firestore.
 */

const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const serviceAccount = require("./serviceAccountKey.json");

// ==========================================
// CONFIGURACIÓN DE LA COLECCIÓN A LIMPIAR
// ==========================================
const COLECCION_NOMBRE = "productos"; 

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore();

async function quitarCampoMadre() {
  console.log(`\n🚀 [${new Date().toLocaleTimeString()}] Iniciando limpieza del campo 'madre' para La Casa de Cata en '${COLECCION_NOMBRE}'...`);

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

      // Si el producto tiene el campo 'madre', lo removemos de Firestore
      if (typeof data.madre !== "undefined") {
        batch.update(productoRef, {
          madre: FieldValue.delete()
        });
        contadorModificados++;
        console.log(`🗑️ Quitando campo 'madre' de: ${data.nombre || doc.id}`);
      }
    });

    if (contadorModificados > 0) {
      await batch.commit();
      console.log(`\n============================================================`);
      console.log(`✅ [PROCESO EXITOSO - LA CASA DE CATA]`);
      console.log(`🚀 Se eliminó el campo 'madre' en ${contadorModificados} documentos.`);
      console.log(`============================================================\n`);
    } else {
      console.log(`\n✨ Ningún documento en '${COLECCION_NOMBRE}' tenía el campo 'madre'. La base ya estaba limpia.`);
    }

  } catch (error) {
    console.error("\n🚨 Error crítico en el proceso:", error);
  }
}

quitarCampoMadre();