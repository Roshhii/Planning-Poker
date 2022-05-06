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
  const { session_id, name_session, card } = req.body;
  if (!session_url.hasOwnProperty(session_id)){
    session_url[session_id] = {};
  }

  session_url[session_id][name_session] = parseInt(card);

  console.log(session_url);

  var all_cards = []
  stringToSend = '{"Users": ['
  //get tab of all chosen cards
    for (var name in session_url[session_id]){
      if (all_cards.length != 0){
        stringToSend += ", ";
      }
      stringToSend += '{"name": ' + '"' + name + '", ' + '"card": ' +session_url[session_id][name] + "}";
      
      all_cards.push(session_url[session_id][name]);
    }
  stringToSend += "]}";

  if (all_cards.length >= 5){
   /* const sum = all_cards.reduce((a, b) => a + b, 0);
    const average = (sum / all_cards.length) || 0;
    res.send("Your Card : " + card + "           List of all chosen card : " + stringToSend + " Average : " + average);

    session_url[session_id] = new Array();*/
  }
  console.log(JSON.parse(stringToSend))

  res.send(stringToSend);

});

module.exports = app;
