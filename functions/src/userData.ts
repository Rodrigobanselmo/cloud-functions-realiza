/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();
const db = admin.firestore();

interface UserData {
  cursos:any;
  name:string;
  link?:string | false;
  email:string;
  cpf:string;
  type:string;
  code?:string;
  status:any;
  creation:string;
  createdAt:number | string;
  uid:string;
}

async function update(change:any) {
  const user = change.after.data();

  if (user?.isPrimaryAccount && user?.access == "client") return;
  const companyId = user?.companyId;
  const reduceType = "users";
  let docId = null;
  console.log("user", user?.companyId);

  const reduceRef = db.collection("reduce");
  const reduce = await reduceRef.where("id", "==", companyId).where("reduceType", "==", reduceType).get();
  console.log("afterReduce", reduce);

  let newData:UserData[] = [];
  // let indexData:any = null;
  reduce.forEach((doc)=>{
    console.log("doc.data()", doc.data().data);
    const index:any = doc.data().data.findIndex((i:UserData)=>i?.uid === user?.uid || i?.link === user?.link || i?.email === user?.email);
    console.log("index", index);
    if (index != -1) {
      console.log("index2", index);
      docId=doc.id;
      newData = [...doc.data().data];
      // const data = {
      //   cursos: user?.cursos ? user.cursos : false,
      //   availableCursos: user?.availableCursos ? user.availableCursos : false,
      //   company: user?.company ? user.company : false,
      //   companyId: user?.companyId ? user.companyId : false,
      //   name: user?.name ? user.name : false,
      //   link: user?.link ? user.link : false,
      //   email: user?.email ? user.email : false,
      //   cpf: user?.cpf ? user.cpf : false,
      //   type: user?.type ? user.type : false,
      //   status: user?.status ? user.status : false,
      //   creation: user?.creation ? user.creation : false,
      //   photoURL: user?.photoURL ? user.photoURL : false,
      //   createdAt: user?.createdAt ? user.createdAt : false,
      //   uid: user?.uid ? user.uid : false,
      // };
      newData[index] = user;
    }
  });

  console.log("docId", docId);
  if (docId) await reduceRef.doc(docId).update({data: newData});
  console.log("okkkkkk", "okkkkkk");
  return null;
}

export const usersListening = functions.firestore
    .document("users/{docId}")
    .onWrite(async (change, context) => {
      // if (!change.before.exists) {
      //   creation(change);
      //   return;
      // }
      if (!change.after.exists) {
        console.log("!change.after.exists");
        return null;
      }
      try {
        await update(change);
        console.log("done");
      } catch (error) {
        console.log(error);
      }
      return;
    });
