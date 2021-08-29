/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import * as functions from "firebase-functions";
import * as express from "express";
import * as nodemailer from "nodemailer";
import * as cors from "cors";
import * as ejs from "ejs";
import * as path from "path";
import * as pdf from "html-pdf";
import * as admin from "firebase-admin";
import axios from "axios";
admin.initializeApp();

const db = admin.firestore();

if (process.env.NODE_ENV != "production") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("dotenv").config();
}

const CLIENT_ID = "1044188074333-jl4jdvj4etm2h7cl92bq6v0da325827b.apps.googleusercontent.com";
const CLIENT_SECRET = "VVVsnTU2FQrUFwsVCEWUl2Ea";
const REFRESH_TOKEN = "1//04bPpWhioPomfCgYIARAAGAQSNwF-L9Ir9O7FH75HqCNaOzy0Bxnm9C6EY9bzqME5fmDrc2t3OcLN-uwyF33BL24IzqmSofr2_cs";

const app = express();
app.use(cors({origin: true}));

app.post("/", (req, res):any => {
  const {body} = req; // to, subject, html
  const isValidMessage = body.to && body.html && body.subject;

  if (!isValidMessage) {
    return res.status(400).send({message: "Ocorreu um erro ao enviar o email."});
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: "rodrigobanselmo@gmail.com",
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
    },
  });

  const mailOptions = {
    from: "App Reconecta",
    // replyTo: process.env.EMAIL_USER,
    replyTo: "rodrigobanselmo@gmail.com",
    subject: body.subject,
    html: body.html,
    to: body.to,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return res.status(500).send({message: "error " + err.message});
    }

    return res.send({message: "email sent"});
  });
});

app.post("/teste", async (req, res):Promise<any> => {
  // if (false) {
  //   return res.status(400).send({message: "Ocorreu um erro ao enviar o email."});
  // }
  const {body} = req; // to, subject, html
  console.log(body);

  const userRef = db.doc(`phone/${body.msg.from.replace("@c.us", "")}`);
  await userRef.set({
    // body: admin.firestore.FieldValue.arrayUnion(body.msg.body),
    body: body.msg.body,
    timestamp: body.msg.timestamp,
  });
  console.log("OK");

  return res.send({message: "email sented"});
  // return res.send("Hello");
});

app.get("/bank", (req, res):any => {
  // if (false) {
  //   return res.status(400).send({message: "Ocorreu um erro ao enviar o email."});
  // }
  axios.get("https://brasilapi.com.br/api/banks/v1").then((response)=>{
    console.log("res", response.data);
    return res.end(JSON.stringify(response.data));
  }).catch((error)=>{
    console.log("error", error);
    return res.send("Hello");
  });
});

app.get("/pdf", (request, response) => {
  const passengers = [
    {
      name: "Joyce",
      flightNumber: 7859,
      time: "18h00",
    },
    {
      name: "Brock",
      flightNumber: 7859,
      time: "18h00",
    },
    {
      name: "Eve",
      flightNumber: 7859,
      time: "18h00",
    },
  ];

  const filePath = path.join(__dirname, "print.ejs");
  ejs.renderFile(filePath, {passengers}, (err, html):any => {
    if (err) {
      return response.send("Erro na leitura do arquivo");
    }

    const options = {
      height: "11.25in",
      width: "8.5in",
    };


    pdf.create(html, options).toBuffer(function(err, buffer):any {
      if (err) {
        return response.send("Erro ao gerar o PDF");
      }

      console.log("This is a buffer:", Buffer.isBuffer(buffer));
      return response.send(buffer);
    });
  });
});


export const mailer = functions.https.onRequest(app);


// app.post("/teste", async (req, res):Promise<any> => {
//   const {body} = req; // to, subject, html

//   const userRef = db.doc(`phone/${body.from.replace("@c.us", "")}`);
//   await userRef.set({
//     body: body.body,
//     timestamp: body.timestamp,
//   });
//   console.log("OK");
//   return res.send({message: "msg sented"});

//   // return res.send("Hello");
// });
// {
// >    msg: {
// >      id: {
// >        fromMe: false,
// >        remote: '555180173688@c.us',
// >        id: '9A455540039782FE7551F358C62108AF',
// >        _serialized: 'false_555180173688@c.us_9A455540039782FE7551F358C62108AF'
// >      },
// >      ack: 0,
// >      hasMedia: false,
// >      body: 'Vy',
// >      type: 'chat',
// >      timestamp: 1622145563,
// >      from: '555180173688@c.us',
// >      to: '5512996818163@c.us',
// >      isForwarded: false,
// >      isStatus: false,
// >      isStarred: false,
// >      broadcast: false,
// >      fromMe: false,
// >      hasQuotedMsg: false,
// >      vCards: [],
// >      mentionedIds: [],
// >      links: []
// >    }
// >  }
