/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
const db = admin.firestore();

interface IMessage {
  msg: string;
  type: string;
}

interface INotifications {
  missing: number;
  name: string;
  email: string;
  photoURL: string;
  uid: string;
  data: Array<IMessage>;
}

interface IUserChat {
  userId: string;
  name: string;
  photoURL: string;
  email: string;
  created_at: number;
}

interface IActiveUsers {
  data: IUserChat[], 
  answer: IUserChat[]
}

const credentials = functions.config().nodemailer;

const onSendEmail = async(message:string,name:string):Promise<void> => {
  const notificationsEmailRef = db.collection("notifications").doc('emails');
  const emails  = await notificationsEmailRef.get();
  
  if (!emails.exists) throw new Error ('Notification email not found')

  const email = emails.data()?.support_notifications
  
  const subject = `Support: Dúvidade recebida`
  const html = 
    `<p>
      O Aluno <b>${name}</b> mandou uma menssagem no chat de supporte: 
      <br/>
      <br/>
      <br/>Menssagem:
      <br/>
      <br/>˜${message}˜.
      <br/>
      <br/>
      Responda agora mesmo: <a href="https://reconecta.netlify.app/login">www.realizaconecta.com.br/responder-aluno</a>
    </p>`
  

  const transporter = nodemailer.createTransport({
    host: "smtpi.uni5.net",
    port: 465,
    secure: true,
    auth: {user: credentials.email, pass: credentials.pass},
    // port: 587,
  });

  const mailOptions = {
    from: "alex@realizaconsultoria.com.br",
    replyTo: "alex@realizaconsultoria.com.br",
    subject,
    sendmail: true,
    html,
    to: email,
  };

  await transporter.sendMail(mailOptions);
  console.log('email enviado com sucesso');
}

const onAddNewActiveNotificationUser = async (chat:INotifications) => {
  const notificationsActiveRef = db.collection("notifications").doc('activeUsers');
  const { email, name, uid,photoURL } = chat

  const activeUsers = await notificationsActiveRef.get();
  var active: IUserChat[] = []
  var answer: IUserChat[] = []
  if (activeUsers.data() && activeUsers.data()?.data) {
    const array = activeUsers.data() as IActiveUsers
    active.push(...array.data)
    answer.push(...array.answer)
    active = active?.filter((i:IUserChat)=>i.userId !== uid)
    answer = answer?.filter((i:IUserChat)=>i.userId !== uid)
  }

  const userChat = {
    userId: uid,
    created_at: new Date().getTime(),
    name,
    email,
    photoURL
  }

  active.push(userChat)

  await notificationsActiveRef.update({//admin.firestore.FieldValue.arrayUnion(body.msg.body),
    data: active,
    answer: answer,
  });
};

const onAnswerUser = async (chat:INotifications) => {
  const notificationsActiveRef = db.collection("notifications").doc('activeUsers');
  const { email, name, uid,photoURL } = chat

  const activeUsers = await notificationsActiveRef.get();
  var active: IUserChat[] = []
  var answer: IUserChat[] = []
  if (activeUsers.data() && activeUsers.data()?.data) {
    const array = activeUsers.data() as IActiveUsers
    active.push(...array.data)
    answer.push(...array.answer)
    active = active?.filter((i:IUserChat)=>i.userId !== uid)
    answer = answer?.filter((i:IUserChat)=>i.userId !== uid)
  }

  if (answer.length > 50) answer.shift();

  const userChat = {
    userId: uid,
    created_at: new Date().getTime(),
    email, 
    name,
    photoURL
  }

  answer.push(userChat)

  await notificationsActiveRef.update({//admin.firestore.FieldValue.arrayUnion(body.msg.body),
    data: active,
    answer: answer,
  });


};

async function onCreateNewChat(change:functions.Change<functions.firestore.DocumentSnapshot>) {
  const chat = change.after.data() as INotifications;
  console.log('notificationsListening started')

  
  if (!chat.data[chat.data.length-1]) throw new Error ('Notification data not found')
  if (!chat.data[chat.data.length-1]?.type) throw new Error ('Notification data not found')
  
  if (chat.data[chat.data.length-1]?.type === 'user') {
    await onSendEmail(chat.data[chat.data.length-1]?.msg,chat.name)
    await onAddNewActiveNotificationUser(chat)
  }
  if (chat.data[chat.data.length-1]?.type !== 'user') {
    // await onSendEmail(chat.data[chat.data.length-1]?.msg,chat.name)
    await onAnswerUser(chat)
  }
}


export const notificationsListening = functions.firestore
    .document("users/{userId}/notifications/{chat}")
    .onWrite(async (change, context) => {
      console.log('notificationsListening started')

      if (!change.after.exists) { // deleted
        console.log("!change.after.exists");
        return null;
      }
      try {
        await onCreateNewChat(change);
        console.log("done");
      } catch (error) {
        console.log(error);
      }
      return;
    });
