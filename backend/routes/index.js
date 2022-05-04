var express = require('express');
var router = express.Router();

router.use(express.json());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("API is working !!");
});

var nb_users = 0;
var nb_cumule = 0;

router.post('/', function(req, res, next) {
  const { card } = req.body;
  nb_users ++;
  nb_cumule += parseInt(card);
  if (nb_users >= 5){
    average = nb_cumule/5;
    res.send("Average : " + average);
    nb_users = 0
  } 
  
  res.send("Confirmed Card : "+card);
});

module.exports = router;
