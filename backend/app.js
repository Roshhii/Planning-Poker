require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const historyRoutes = require("./routes/history")
const { MongoClient } = require('mongodb');
const connection = require("./db");
const { User } = require("./models/user");

// server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// database connection
connection();

/* // database connection
Avec le MongoClient mais c'est une autre tehcnique qui ne marche pas avec le front

var url = "mongodb://localhost:27017";
var dbo
MongoClient.connect(url, function(err, db) {
  console.log("Server connected to the database")
  if (err) throw err;
  dbo = db.db("db_planning_poker");
  var query = { email: "abcd@gmail.com" };
  dbo.collection("users").find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
  });
}); */

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/user/history", historyRoutes);

// backend process

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

  /*
  Ecouteur "login" qui récupère les données de l'utilisayeur au moment de l'authentification
  et renvoie l'username associé : firstName-lastName

  PLUS UTILISE
  */
  socket.on("login", async (data) => {
    console.log("login")
    msg = JSON.parse(data)
    console.log("email login reçu: " + msg.email)
    console.log("password login reçu: " + msg.password)

    const user = await User.findOne({ email: msg.email });
    console.log("USER: " + user.firstName + "; " + user.lastName)
    socket.emit("receive_user-logged", JSON.stringify({
      "username": user.firstName + "-" + user.lastName
    }))
    /* db.collection('users').find({
      "email":msg.email
    }) */
    /*
    Aller chercher les infos (firstName, lastName) des infos login reçues
    et les envoyer pour concaténer les deux et ce sera le name_session de
    l'utilisateur
    */
    /* var query = { email: msg.email };
    dbo.collection("users").find(query).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      socket.emit("receive_user-logged", JSON.stringify({
        "username": result[0].firstName + "-" + result[0].lastName
      }))
    }); */
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