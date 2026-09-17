/**
 * SCRIPT: COPIAR Y MIGRAR DESDE 'productos' HACIA 'productos_test'
 * Objetivo: Lee de 'productos', transforma 'imagen' en un array 'imagenes', y guarda en 'productos_test'.
 */

const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("./serviceAccountKey.json");

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore();

async function copiarYMigrarCata() {
  const COLECCION_ORIGEN = "productos";
  const COLECCION_DESTINO = "productos_test";

  console.log(`\n🚀 [${new Date().toLocaleTimeString()}] Iniciando copia y migración...`);
  console.log(`📂 Origen: '${COLECCION_ORIGEN}' ➡️ Destino: '${COLECCION_DESTINO}'\n`);

  try {
    const snapshot = await db.collection(COLECCION_ORIGEN).get();

    console.log(`📊 Total de documentos encontrados en '${COLECCION_ORIGEN}': ${snapshot.size}`);
    console.log("------------------------------------------------------------");

    if (snapshot.empty) {
      console.log(`⚠️ Atención: La colección de origen '${COLECCION_ORIGEN}' está vacía.`);
      return;
    }

    const batch = db.batch();
    let contadorCopiados = 0;

    snapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      const destinoRef = db.collection(COLECCION_DESTINO).doc(doc.id);
      const nombreProducto = data.nombre || data.titulo || doc.id;

      console.log(`\n🔍 [${index + 1}] Procesando: "${nombreProducto}" (ID: ${doc.id})`);
      console.log(`   - Campo 'imagen' original:`, data.imagen ? `"${data.imagen}"` : "❌ (No tiene)");

      // Si tiene 'imagen' (string) y no tiene el array 'imagenes', lo transformamos
      let imagenesFinales = data.imagenes || [];
      if (data.imagen && (!data.imagenes || data.imagenes.length === 0)) {
        imagenesFinales = [data.imagen];
      }

      // Armamos el objeto con el array 'imagenes' listo para test
      const productoModificado = {
        ...data,
        imagenes: imagenesFinales
      };

      batch.set(destinoRef, productoModificado);
      contadorCopiados++;
      console.log(`   👉 [COPIADO] Se guardará en '${COLECCION_DESTINO}' con imagenes:`, imagenesFinales);
    });

    console.log("\n------------------------------------------------------------");
    console.log(`⏳ Guardando todo en '${COLECCION_DESTINO}'...`);
    await batch.commit();
    
    console.log(`✅ [PROCESO EXITOSO] Se copiaron y migraron ${contadorCopiados} productos a '${COLECCION_DESTINO}'.`);
    console.log(`============================================================\n`);

  } catch (error) {
    console.error("\n🚨 Error crítico en el proceso:", error);
  }
}

copiarYMigrarCata();