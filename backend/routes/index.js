var express = require('express');
var app = express.Router();

app.use(express.json());

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}

app.get("/",(req,res) => {
  res.send(makeid(10))
});


var session_url = {};

app.post('*',(req,res) => {
  const { session_id, card } = req.body;
  if (!session_url.hasOwnProperty(session_id)){
    session_url[session_id] = new Array();
  }

  session_url[session_id].push(parseInt(card));

  if (session_url[session_id].length >= 5){
    const sum = chosen_card.reduce((a, b) => a + b, 0);
    const average = (sum / chosen_card.length) || 0;
    res.send("Average : " + average);

    session_url[session_id] = new Array();
  }
  
  res.send("Confirmed Card : " + card + "           List of all chosen card : " + session_url[session_id]);

});

/*app.post('/session', function(req, res, next) {
  const { card } = req.body;
  chosen_card[nb_users] = parseInt(card);
  nb_users ++;

  if (nb_users >= 5){
    const sum = chosen_card.reduce((a, b) => a + b, 0);
    const average = (sum / chosen_card.length) || 0;
    res.send("Average : " + average);
    nb_users = 0
    chosen_card = Array(5).fill(null);
  } 
  
  res.send("Confirmed Card : " + card + "           List of all chosen card : " + chosen_card);
});*/

module.exports = app;
