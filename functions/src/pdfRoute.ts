/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
import * as ejs from "ejs";
import * as path from "path";
import * as pdf from "html-pdf";
// import * as admin from "firebase-admin";

// admin.initializeApp();

// const db = admin.firestore();

if (process.env.NODE_ENV != "production") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("dotenv").config();
}

const app = express();
app.use(express.static('public'));
app.use(cors({origin: true}));

app.post("/", (req, res):any => {
  res.json({})
});

function onCreatePdf(
  html: string,
  options: pdf.CreateOptions,
): Promise<string | Buffer> {
  return new Promise(resolve => {
    pdf.create(html, options).toBuffer((err, buffer) => {
      console.log(2);
      if (err) {
        resolve('Erro ao gerar o PDF');
      }
      resolve(buffer);
    });
  });
}

function onEjs(): Promise<string | Buffer> {
  
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

  return new Promise(resolve => {
    const filePath = path.join(__dirname, 'print.ejs');
    ejs.renderFile(filePath, { passengers }, async (err, html) => {
      if (err) {
        resolve(`Erro na leitura do arquivo ${err}`);
      }

      const options = {
        // format: 'A4',
        height: '595px',
        width: '841px',
        header: { height: '0px' },
      };

      console.log(1);
      const pdfBuffer = await onCreatePdf(html, options as pdf.CreateOptions);
      console.log('pdfBuffer', pdfBuffer);
      resolve(pdfBuffer);
    });
  });
}

app.post("/pdf", async (request, response) => {
  const pdfBuffer = await onEjs();
  return response.send(pdfBuffer);
});


export const pdfRoute = functions.https.onRequest(app);


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
