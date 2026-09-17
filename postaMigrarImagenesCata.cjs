/**
 * SCRIPT: ACTUALIZAR 'productos' OFICIAL
 * Objetivo: Lee cada documento de 'productos', le agrega el array 'imagenes' 
 * basado en el campo 'imagen' existente, y lo actualiza en la misma colección.
 */

const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("./serviceAccountKey.json");

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore();

async function actualizarProductosOficiales() {
  const COLECCION = "productos";

  console.log(`\n🚀 [${new Date().toLocaleTimeString()}] Iniciando actualización de la colección '${COLECCION}'...`);

  try {
    const snapshot = await db.collection(COLECCION).get();

    console.log(`📊 Total de documentos encontrados: ${snapshot.size}`);
    console.log("------------------------------------------------------------");

    if (snapshot.empty) {
      console.log(`⚠️ Atención: La colección '${COLECCION}' está vacía.`);
      return;
    }

    const batch = db.batch();
    let contadorActualizados = 0;

    snapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      const docRef = db.collection(COLECCION).doc(doc.id);
      const nombreProducto = data.nombre || doc.id;

      // Si ya tiene el array 'imagenes' con elementos, podemos saltarlo o asegurarnos de dejarlo bien
      let imagenesFinales = data.imagenes || [];
      
      if (data.imagen && (!data.imagenes || data.imagenes.length === 0)) {
        imagenesFinales = [data.imagen];
      }

      console.log(`\n🔍 [${index + 1}] Actualizando: "${nombreProducto}"`);
      console.log(`   👉 Array 'imagenes' que se guardará:`, imagenesFinales);

      // Usamos .update para modificar solo el campo sin tocar el resto de los datos
      batch.update(docRef, {
        imagenes: imagenesFinales
      });

      contadorActualizados++;
    });

    console.log("\n------------------------------------------------------------");
    console.log(`⏳ Aplicando cambios en Firestore...`);
    await batch.commit();
    
    console.log(`✅ [PROCESO EXITOSO] Se actualizaron ${contadorActualizados} productos en '${COLECCION}' con su campo array 'imagenes'.`);
    console.log(`============================================================\n`);

  } catch (error) {
    console.error("\n🚨 Error crítico en el proceso:", error);
  }
}

actualizarProductosOficiales();