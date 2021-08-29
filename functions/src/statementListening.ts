/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
const db = admin.firestore();

interface UserData {
  id:string | null;
  openValue: number;
  lastPayment: number;
  due: number;
}

async function update(change:any) {
  const statement = change.after.data();
  const uid = statement?.companyId || statement?.customerId;

  const billReduce = db.collection("bill");

  const response = await billReduce.where("id", "==", uid).get();

  let billingData: UserData = {
    id: uid,
    openValue: 0,
    lastPayment: 0,
    due: new Date().getTime() + 1000 + 60 + 60 * 24 * 28,
  };

  response.forEach((doc)=>{
    billingData = doc.data() as UserData;
  });

  const value = statement.type == "debit" ? -statement.value : statement.value;


  billReduce.doc(uid).set({
    ...billingData,
    openValue: billingData.openValue + value,
  });
}

export const statementListening = functions.firestore
    .document("statement/{docId}")
    .onWrite(async (change, context) => {
      if (!change.after.exists) { // deleted
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
