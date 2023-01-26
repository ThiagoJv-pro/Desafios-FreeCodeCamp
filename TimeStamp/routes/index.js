var express = require('express');
var router = express.Router();
let bodyparser = require('body-parser');


router.use(bodyparser.urlencoded({extend: false}))

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

let responseObject = {};

router.get("/api/", function(req, res){
  var date = new Date();
  res.json({unix: date.getTime(), utc: date.toUTCString()})
})

router.get("/api/:date?", function(req, res){
    var str_date = req.params.date;
      
  if(str_date.includes("-")){
    responseObject['unix'] = new Date(str_date).getTime();
    responseObject['utc'] = new Date(str_date).toUTCString();
    
      
  }else{
    str_date = parseInt(str_date);
    responseObject['unix'] = new Date(str_date).getTime();
    responseObject['utc'] = new Date(str_date).toUTCString();
    
  }

  if(!responseObject['unix'] || !responseObject['utc']){
    res.json({error: "Invalid Date"}) 
  }

  res.json(responseObject);
})

module.exports = router;
