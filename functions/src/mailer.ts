/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import * as functions from "firebase-functions";
import * as express from "express";
import * as nodemailer from "nodemailer";
import * as cors from "cors";

// import * as admin from "firebase-admin";

// const db = admin.firestore();

const credentials = functions.config().nodemailer;

const app = express();
app.use(cors({origin: true}));

app.post("/", (req, res):any => {
  const {body} = req; // to, subject, html
  const isValidMessage = body.to && body.html && body.subject;

  if (!isValidMessage) {
    return res.status(400).send({message: "Ocorreu um erro ao enviar o email."});
  }

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
    subject: body.subject,
    sendmail: true,
    html: body.html,
    to: body.to,
  };

  transporter.sendMail(mailOptions).then((info)=>{
    return res.send(info);
  }).catch((err)=>{
    return res.status(500).send({message: "error " + err.message});
  });
});


export const mailer = functions.runWith({timeoutSeconds: 540}).https.onRequest(app);
