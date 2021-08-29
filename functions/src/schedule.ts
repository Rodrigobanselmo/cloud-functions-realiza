/* eslint-disable max-len */
import * as functions from "firebase-functions";
// import * as express from "express";
// import * as nodemailer from "nodemailer";
// import * as cors from "cors";
// import * as admin from "firebase-admin";
import axios from "axios";

// const db = admin.firestore();

export const scheduledFunction = functions.pubsub.schedule("every 1 minutes").onRun(() => {
  console.log("This will be run every 1 minutes!");
  console.log("OK");
  // const userRef = db.doc("phone/time");
  // return userRef.set({
  //   time: Math.random(),
  // });
  axios.post("https://reconecta-bot.herokuapp.com/chat/sendmessage/555180173688", {
    message: "Estou funcionando ainda!",
  })
      .then(function(response) {
        return console.log(response);
      })
      .catch(function(error) {
        return console.log(error);
      });
});

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
