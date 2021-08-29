/* eslint-disable camelcase */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
var Vimeo = require("vimeo").Vimeo;

// import * as path from "path";
// import axios from "axios";

// const db = admin.firestore();

if (process.env.NODE_ENV != "production") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("dotenv").config();
}

const CLIENT_ID = "134c80e724ca5534a53e5fe1d0c28ab1120a9e3c";
const CLIENT_SECRET = "fh6SDHk81PDip4Rygvolf8m0z4FmOrdwYrtEuizrGI4+QHozl5Dwo1ovfGNHTtf5Av5GGQdqPUuq8j4tkAlFL4ejwETJsNZ6K72HoDBDji0EWhLgGA7L5V8uEQRoKL6f";
const ACCESS_TOKEN = "827d3e9e98fc7d2d9691f6434d01c604";
// 49c87165cccb9efcd32b7c712409c60a


const app = express();
app.use(cors({origin: true}));

app.get("/", (req, res):express.Response => {
  var client = new Vimeo(CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN);
  client.request({
    method: "GET",
    path: "/tutorial",
  }, function(error:any, body:any, status_code:any, headers:any):any {
    if (error) {
      console.log(error);
    }

    console.log(body);
    return res.send("Hello");
  });
  return res.send("Hello");
});

export const vimeo = functions.https.onRequest(app);

// axios.get("https://brasilapi.com.br/api/banks/v1").then((response)=>{
//   console.log("res", response.data);
//   return res.end(JSON.stringify(response.data));
// }).catch((error)=>{
//   console.log("error", error);
//   return res.send("Hello");
// });
