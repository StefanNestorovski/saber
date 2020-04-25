'use strict'

const { app, ipcMain } = require('electron');
const Window = require('./Window');

var robot = require("robotjs");
const express = require('express');
var bodyParser = require('body-parser');
const path = require('path')
const server = express();
const port = 3000;

let mainWindow;

function main() {
  mainWindow = new Window({
    file: 'index.html'
  });

  let count = 1;
  mainWindow.send('toRend', {updatedRot: count++})

  ipcMain.on('toMain', (e, data) => {
    console.log(data);
  })
}

app.on('ready', main);

app.on('window-all-closed', function () {
  app.quit();
})


// creating server
server.use(bodyParser.json() );       // to support JSON-encoded bodies
server.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

server.post('/update', (req, res) => {
  console.log(req.body);
  console.log("Update sent at: " + Date.now());
  mainWindow.send('toRend', req.body)
  res.send('Hello World!')

  if (false) {
    if(req.body.updatedRot === "left") {
      robot.mouseClick("left");
    }
    if(req.body.updatedRot === "right") {
      robot.mouseClick("right");
    }
  }
  if (true) {
    if(req.body.updatedRot === "left") {

    }
    if(req.body.updatedRot === "right") {

    }
  }
})

server.post('/*', (req, res) => {
  console.log("Messaged at: " + Date.now());
  res.send('BAD!')
})

server.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))



const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8008 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    //console.log('received: %s', message);
    mainWindow.send('toRendLine', message)
  });

  ws.send('something');
});
