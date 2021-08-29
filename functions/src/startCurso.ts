/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable require-jsdoc */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {v4} from "uuid";

const db = admin.firestore();
export const createUsr = functions.https.onCall( async (data, context) => {
  const userId = context.auth?.uid;
  const userRef = db.doc(`users/${userId}`);
  const studentsRef = db.collection("students");
  const batch = db.batch();

  function onAddCurso({cursos, index}:any) { // criar students e remover uma unidade de curso
    const today = new Date(new Date().setHours(23, 59, 0, 0));
    const expireDate = new Date(today.setDate(today.getDate() + data.daysToExpire)).getTime();
    const newCursos = [...cursos];
    if (typeof newCursos[index].quantity == "number") newCursos[index] = {...newCursos[index], quantity: newCursos[index].quantity-1};
    newCursos[index].status = "started";
    newCursos[index].percentage = 0;
    newCursos[index].expireDate = expireDate;

    const curso = newCursos[index];
    const cursoModules = curso?.epi ? curso.epi.map((item:any)=>{
      return item.id;
    }) : "all";

    batch.update(userRef, {
      cursos: newCursos,
    });

    batch.set(studentsRef.doc(v4()), {
      uid: userId,
      status: "started",
      percentage: 0,
      startDate: new Date().getTime(),
      expireDate: expireDate,
      finishedDate: false,
      cursoId: curso.id,
      modules: cursoModules,
      watched: {},
    });
    return batch.commit();
  }

  try {
    const userSnap = await userRef.get();

    if (userSnap.data()?.cursos) {
      const cursos = userSnap.data()?.cursos; // pega o cursp
      const index = cursos.findIndex((i:any)=>i.id === data.cursoId); // acha index no array de cursos
      if (index > 0) { // se index existir
        if (cursos[index]?.quantity) { // se possui quantidade maior que 0 de cursos
          return onAddCurso({cursos, index}); // se o curso existe e possui quantidade maior que 0 ele vai criar students e remover uma unidade de curso
        } else {
          return {error: "Você não possui este curso."};
        }
      }
    }
    return {error: "Você não possui este curso."};
  } catch (error) {
    return {error};
  }
});
