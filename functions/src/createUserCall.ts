// import * as admin from "firebase-admin";
// const db = admin.firestore();
// export const createUsr = functions.https.onCall( async(data) => {

//   try {
//     const userRef = db.doc("data/emailsPermissions");

//     await admin.auth().createUser({
//       email: data.email,
//       password: data.password,
//     })

//   } catch {

//   }


// return admin.auth().createUser({
//     email: data.email,
//     password: data.password,
// }).then(
//     (userRecord) => {
//         console.log('Se creó el usuario con el uid: ' + userRecord.uid);
//         const infoUsr = {
//             Activo: false,
//             Contrasenia: data.password,
//             Correo: data.email,
//             Foto: data.nombrefoto,
//             Llave: userRecord.uid,
//             Nombre: data.nombre,
//             PP: false,
//             Privilegios: data.privilegios,
//             UrldeImagen: data.urldeImagen
//         };
//         //update your db
//         // return db.collection....
//     ).catch((error) => {
//         console.log(error);
//         return error
//     });
// });
