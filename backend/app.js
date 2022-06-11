require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const { MongoClient } = require('mongodb');
const connection = require("./db");
const { User } = require("./models/user");
const { Records } = require("./models/records");

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

const getUser = async () => {
  const user = await User.find({email: 'lconan@gmail.com'});
  console.log("Louis-Conan: " + user)
}

/* const getHistory = async () => {
  const user = await Records.find({});
  console.log("Records: " + user)
} */


getUser()
//getHistory()


// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// backend process

var infoUser = {};

//Construit un élément JSON avec le vote d'un user
function makeElementJSON(name, tab, id) {
  return { "name": name, "card": tab[id][name] }
}

//Return un id d'une session
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

var session_url = {} //Tableau en deux dimmension qui va contenir les votes des user
var length_sessions = {}
var creator_session = {}
var UserStory_sessions = {} //Tableau en deux dimensions qui va contenir les UserStories suivant la session

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);


  //Message pour une demande de clé de session
  socket.on("key", (data) => {
    console.log(`Key event from socket: ${socket.id}: ${data}`)
    socket.emit("receive_key", makeid(10));
  })


  /*
  USER

  Message pour les données de l'utilisateur
  On ajoute également la taille de la session et le créateur de celle-ci si c'est le cas
  */
  socket.on("user", (data) => {
    console.log(`Message from user with ID: ${socket.id}: ${data}`)
    msg = JSON.parse(data)
    socket.join(msg.session_id)

    if (!infoUser.hasOwnProperty(msg.session_id)) {
      infoUser[msg.session_id] = [[msg.username, msg.email]];
    }
    else{
      infoUser[msg.session_id].push([msg.username, msg.email]);
    }
    for (var user of infoUser[msg.session_id]){
      console.log("info User : " + user[0] + " " + user[1])
    }
    
    
    if (!length_sessions.hasOwnProperty(msg.session_id)) {
      length_sessions[msg.session_id] = 1;
      creator_session[msg.session_id] = socket.id;
    }
    else {
      length_sessions[msg.session_id] += 1;
    }

    socket.emit("receive_user", JSON.stringify({
      "username": msg.username,
      "session_id": msg.session_id
    }))
  })


  /*
  CARD

  On reçoit une carte qu'on stocke dans des tableaux
  Si c'était la dernière carte attendue, on fait un show en envoyant un message show
  Sinon, on envoie un event card qui indique que quelqu'un a voté:
  tableau Users avec pour chaque élément un name et une card
  */
  socket.on("card", async (data) => {
    console.log(`Card event from socket: ${socket.id}: ${data}`);
    var msg = JSON.parse(data);
    var session_id = msg.session_id
    var name_session = msg.name_session
    var card = msg.card
    var email = msg.email
    var username = msg.username

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
    if (length_sessions[session_id] == Object.keys(session_url[session_id]).length) {
      console.log("------ Tout le monde a voté -------")
      let tasks = []
      let usrStry = []
      let votes = []
      
      for (let tmp in UserStory_sessions[session_id]) {
        tasks.push(UserStory_sessions[session_id][tmp]['tasks'])
        usrStry.push(UserStory_sessions[session_id][tmp]['userStory'])
      }
      let date = Date()
      for (var tmp in message) {
        votes.push(message[tmp])
       
      }

      console.log("SHOW: ")
      console.log("User Story: " + usrStry)
      console.log("Tasks: " + tasks)
      console.log("Votes: " + votes)
      console.log("Date: " + date)
      console.log("Email: " + email)

      console.log("length of infoUsers : " + infoUser[session_id].length)

      for (var user of infoUser[session_id]){
        console.log("Username = " + user[0] + "  Email = " + user[1])

        const filter = { sessionId: session_id, email: user[1], username: user[0] };
        const update = {date: date, userStory: usrStry, tasks: tasks, votes: votes };
        
        await Records.findOneAndUpdate(filter, update, {
          new: true,
          upsert: true // Make this update into an upsert
        });
        /*
        await new Records({
          sessionId: session_id,
          date: date,
          username: user[0],
          email: user[1],
          userStory: usrStry,
          tasks: tasks,
          votes: votes
        }).save();*/
      }
      
      socket.emit("receive_show", '{"Users" : ' + JSON.stringify(message) + "}");
      socket.to(session_id).emit("receive_show", '{"Users" : ' + JSON.stringify(message) + "}");
    }
    else {
      socket.emit("receive_card", '{"Users" : ' + JSON.stringify(message) + "}");
      socket.to(session_id).emit("receive_card", '{"Users" : ' + JSON.stringify(message) + "}");
    }
  });

  /*
  RESET

  On supprime l'user des tableaux qui stockaient les votes
  On envoie un event : reset reçu
  */
  socket.on("reset", (data) => {
    console.log(`Reset event from socket: ${socket.id}: ${data}`)
    var msg = JSON.parse(data);
    if (session_url[msg.session_id].hasOwnProperty(msg.name_session)) {
      delete session_url[msg.session_id][msg.name_session];
    }
    socket.emit("receive_reset", 'The card has been reset');
    socket.to(msg.session_id).emit("receive_reset", 'The card has been reset');
  });

  /*
  SHOW

  Si on reçoit un message show du creator, on show toutes les cards. On envoie un message receive_show
  Sinon on envoie un message receive_no_show

  */
  socket.on("show", async (data) => {
    console.log(`Message from user with socket: ${socket.id}: ${data}`)
    var msg = JSON.parse(data);
    var session_id = msg.session_id
    var email = msg.email
    var username = msg.username

    if (creator_session[msg.session_id] == socket.id) {
      message = []
      for (var name in session_url[session_id]) {
        message.push(makeElementJSON(name, session_url, session_id));
      }

      let tasks = []
      let usrStry = []
      let votes = []
      
      for (let tmp in UserStory_sessions[session_id]) {
        tasks.push(UserStory_sessions[session_id][tmp]['tasks'])
        usrStry.push(UserStory_sessions[session_id][tmp]['userStory'])
      }
      let date = Date()
      for (var tmp in message) {
        votes.push(message[tmp])
       
      }

      console.log("SHOW: ")
      console.log("User Story: " + usrStry)
      console.log("Tasks: " + tasks)
      console.log("Votes: " + votes)
      console.log("Date: " + date)
      console.log("Email: " + email)
      console.log("SessionID: " + session_id)

      console.log("length of infoUsers : " + infoUser[session_id].length)

      for (var user of infoUser[session_id]){
        console.log("Username = " + user[0] + "  Email = " + user[1])

        
        const filter = { sessionId: session_id, email: user[1], username: user[0] };
        const update = {date: date, userStory: usrStry, tasks: tasks, votes: votes };
        
        await Records.findOneAndUpdate(filter, update, {
          new: true,
          upsert: true // Make this update into an upsert
        });

      /*  await new Records({
          sessionId: session_id,
          date: date,
          username: user[0],
          email: user[1],
          userStory: usrStry,
          tasks: tasks,
          votes: votes
        }).save();*/
      }

      socket.emit("receive_show", '{"Users" : ' + JSON.stringify(message) + "}");
      socket.to(session_id).emit("receive_show", '{"Users" : ' + JSON.stringify(message) + "}");
    }
    else {
      socket.emit("receive_no_show", 'Not the creator');
    }

  });

  /*
  AddUserStory

  On stocke les userStory reçues dans le tableau en question et on envoie qu'on a bien reçu le message
  avec en message la liste des UserStories
  */
  socket.on("AddUserStory", (data) => {
    console.log(`AddUserStory event from socket: ${socket.id}: ${data}`);
    var msg = JSON.parse(data);
    var session_id = msg.session_id
    var title = msg.title;
    var description = msg.description

    if (UserStory_sessions.hasOwnProperty(session_id)) {
      UserStory_sessions[session_id].push({ "userStory": title, "tasks": description })
    }
    else {
      UserStory_sessions[session_id] = []
      UserStory_sessions[session_id].push({ "userStory": title, "tasks": description })
    }

    message = UserStory_sessions[session_id]

    socket.emit("receive_AddUserStory", '{"UserStories" : ' + JSON.stringify(message) + "}");
    socket.to(session_id).emit("receive_AddUserStory", '{"UserStories" : ' + JSON.stringify(message) + "}");
  });

  /*
  UpdateUserStory

  On change dans le tableau la UserSTory en question puis on renvoie de nouveau toutes les UserStories updated
  */
  socket.on("UpdateUserStory", (data) => {
    console.log(`UpdateUserStory event from socket: ${socket.id}: ${data}`);
    var msg = JSON.parse(data);
    var session_id = msg.session_id;
    var selectedUserStory = parseInt(msg.selectedUserStory) - 1;
    var title = msg.title;
    var description = msg.description;

    UserStory_sessions[session_id][selectedUserStory] = { "userStory": title, "tasks": description }

    message = UserStory_sessions[session_id]

    socket.emit("receive_AddUserStory", '{"UserStories" : ' + JSON.stringify(message) + "}");
    socket.to(session_id).emit("receive_AddUserStory", '{"UserStories" : ' + JSON.stringify(message) + "}");
  });

  /*
  getUserStory

  Envoie toutes les UserStories
  */
  socket.on("getUserStory", (data) => {
    console.log(`getUserStory event from socket: ${socket.id}: ${data}`);
    var msg = JSON.parse(data);
    var session_id = msg.session_id
    var selectedUserStory = msg.selectedUserStory

    message = UserStory_sessions[session_id][parseInt(selectedUserStory) - 1]
    socket.emit("receive_getUserStory", JSON.stringify(message));
  });

  /*
  removeUserStory

  Supprime l'UserStory que l'on souhaite supprimer et renvoie toutes les UserStories
  */
  socket.on("removeUserStory", (data) => {
    console.log(`removeUserStory event from socket: ${socket.id}: ${data}`);
    var msg = JSON.parse(data);
    var session_id = msg.session_id
    var selectedUserStory = msg.selectedUserStory

    UserStory_sessions[session_id].splice(parseInt(selectedUserStory) - 1, 1)

    message = UserStory_sessions[session_id]
    socket.emit("receive_AddUserStory", '{"UserStories" : ' + JSON.stringify(message) + "}");
    socket.to(session_id).emit("receive_AddUserStory", '{"UserStories" : ' + JSON.stringify(message) + "}");
  });


  socket.on("disconnect", () => {
    console.log("User Diconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
})

module.exports = app;