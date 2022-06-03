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
  return { "name": name, "card": tab[id][name] }
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
var length_sessions = {}
var creator_session = {}
var UserStory_sessions = {}

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
    if (!length_sessions.hasOwnProperty(msg.session_id)) {
      length_sessions[msg.session_id] = 1;
      creator_session[msg.session_id] = socket.id;
    }
    else {
      length_sessions[msg.session_id] += 1;
    }
    console.log(length_sessions[msg.session_id])

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

    for (var name in session_url[session_id]) {

      message.push(makeElementJSON(name, session_url, session_id));

      all_cards.push(session_url[session_id][name]);
    }

    console.log("Message : " + message)
    console.log("Message event card all users : " + '{"Users" : ' + JSON.stringify(message) + "}")

    if (length_sessions[session_id] == Object.keys(session_url[session_id]).length) {
      socket.emit("receive_show", '{"Users" : ' + JSON.stringify(message) + "}");
      socket.to(session_id).emit("receive_show", '{"Users" : ' + JSON.stringify(message) + "}");
    }
    else {
      socket.emit("receive_card", '{"Users" : ' + JSON.stringify(message) + "}");
      socket.to(session_id).emit("receive_card", '{"Users" : ' + JSON.stringify(message) + "}");
    }
  });

  socket.on("reset", (data) => {
    console.log(`Message from user with ID RESET: ${socket.id}: ${data}`)
    var msg = JSON.parse(data);
    console.log(session_url[msg.session_id])
    if (session_url[msg.session_id].hasOwnProperty(msg.name_session)) {
      delete session_url[msg.session_id][msg.name_session];
    }
    console.log(session_url[msg.session_id])
    socket.emit("receive_reset", 'The card has been reset');
    socket.to(msg.session_id).emit("receive_reset", 'The card has been reset');
  });

  socket.on("show", (data) => {
    console.log(`Message from user with ID SHOW: ${socket.id}: ${data}`)
    var msg = JSON.parse(data);
    var session_id = msg.session_id

    if (creator_session[msg.session_id] == socket.id) {
      message = []
      for (var name in session_url[session_id]) {
        message.push(makeElementJSON(name, session_url, session_id));
      }

      socket.emit("receive_show", '{"Users" : ' + JSON.stringify(message) + "}");
      socket.to(session_id).emit("receive_show", '{"Users" : ' + JSON.stringify(message) + "}");
    }
    else {
      socket.emit("receive_no_show", 'Not the creator');
    }

  });

  socket.on("AddUserStory", (data) => {
    console.log("Add User Story"+ data)
    var msg = JSON.parse(data);
    var session_id = msg.session_id
    var title = msg.title;
    var description = msg.description

    if (UserStory_sessions.hasOwnProperty(session_id)) {
      UserStory_sessions[session_id].push({"userStory" : title, "tasks" : description})
    }
    else {
      UserStory_sessions[session_id] = []
      UserStory_sessions[session_id].push({"userStory" : title, "tasks" : description})
    }

    message = UserStory_sessions[session_id]

    socket.emit("receive_AddUserStory", '{"UserStorys" : ' + JSON.stringify(message) + "}");
    socket.to(session_id).emit("receive_AddUserStory", '{"UserStorys" : ' + JSON.stringify(message) + "}");
  });

  socket.on("getUserStory", (data) => {
    console.log("RECU Get User Story" + data)
    var msg = JSON.parse(data);
    var session_id = msg.session_id
    var selectedUserStory = msg.selectedUserStory

    message = UserStory_sessions[session_id][parseInt(selectedUserStory)-1]
    socket.emit("receive_getUserStory", JSON.stringify(message));
  });

  socket.on("disconnect", () => {
    console.log("User Diconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
})

module.exports = app;