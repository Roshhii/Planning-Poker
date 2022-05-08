const express = require('express');
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const infoUser = new Map();

function makeElementJSON(name, tab, id) {
  return {"name": name,"card": tab[id][name]}
}

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

var session_url = {}

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("key", (data) => {
    console.log(`Message from user with ID: ${socket.id}: ${data}`)
    console.log(`User with ID: ${socket.id} want a key.`)
    socket.emit("receive_key", makeid(10));
  })

  socket.on("user", (data) => {
    console.log(`Message from user with ID: ${socket.id}: ${data}`)
    msg = JSON.parse(data)
    socket.join(msg.session_id)
    infoUser.set(msg.username, msg.session_id)
    console.log("Username : " + (msg.username))
    console.log("Session_id : " + msg.session_id)
    socket.emit("receive_user", JSON.stringify({
      "username": msg.username,
      "session_id": msg.session_id
    }))
  })

  socket.on("card", (data) => {
    console.log("Card event received : " + data);
    var msg = JSON.parse(data);
    var session_id = msg.session_id
    var name_session = msg.name_session
    var card = msg.card
    if (!session_url.hasOwnProperty(session_id)) {
      session_url[session_id] = {};
    }

    session_url[session_id][name_session] = parseInt(card);
    

    var all_cards = []
    message = []
    //stringToSend = '{"Users": ['
    //get tab of all chosen cards
    for (var name in session_url[session_id]) {
      /* if (all_cards.length != 0) {
        stringToSend += ", ";
      } */
      //stringToSend += '{"name": ' + name + '", ' + '"card": ' + session_url[session_id][name] + "},";
      message.push(makeElementJSON(name, session_url, session_id));

      all_cards.push(session_url[session_id][name]);
    }
    //stringToSend += "]}";
    //socket.emit("receive_card", stringToSend);
    console.log("Message : " + message)
    console.log("Message event card all users : " + '{"Users" : ' + JSON.stringify(message) + "}")
    socket.emit("receive_card", '{"Users" : ' + JSON.stringify(message) + "}") ;

  });

  socket.on("disconnect", () => {
    console.log("User Diconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
})

module.exports = app;