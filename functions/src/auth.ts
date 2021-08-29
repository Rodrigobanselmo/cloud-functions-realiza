/* eslint-disable max-len */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
const db = admin.firestore();


export const authCreationListening = functions.auth
    .user()
    .onCreate((user, context) => {
      const userRef = db.doc("data/emailsPermissions");
      return userRef.update("data", admin.firestore.FieldValue.arrayRemove(user.email));
    });

// export const createUserEmail = functions.auth
//     .user()
//     .onCreate(async (user, context) => {
//       const userRef = db.collection("users");
//       const userData = userRef.where("email", "==", user.email).get();

//       // const response = await linkRef
//       // const arrayData = [];
//       // console.log('refreshLink')

//       // response.forEach(function (doc) {
//       //   arrayData.push({...doc.data()});
//       // });

//       // await userData = userRef.isEqual
//       return userRef.update("data", admin.firestore.FieldValue.arrayRemove(user.email));
//     });
