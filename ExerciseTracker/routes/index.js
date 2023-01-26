const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bodyParser = require("body-parser")
require('dotenv').config()

//DB configuration
const uri = process.env.MONGO_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000});

//tratando a conexao do meu db
const connection = mongoose.connection;
connection.on("error", console.error.bind(console, "connection erro: "));
connection.once("open", () => {
  console.log("connection successfuly");
});

//criando um schema para armazenar os dados no DB
const personSchema = new Schema({
  username: String,
  description: String,
  duration: String,
  date: String,
}, {collection: "registration"});

const registration = mongoose.model("registration", personSchema); 

app.use(cors())
app.use(bodyParser.urlencoded({extends: false}))
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.post("/api/users", async function(req, res){
  const username = req.body.username;
  console.log(username);
  var findOne = new registration({
    username: username,
  })
  await findOne.save();
  res.json({username: findOne.username, _id: findOne._id})
})

app.get("/api/users", async function(req, res){
  var find = await registration.find();
  res.json(find);
})

app.post("/api/users/:_id/exercises", async function(req, res){
  var idparameter = req.params._id;
  var idbody = idparameter;
  var description = req.body.description;
  var duration = parseInt(req.body.duration);
  var date = req.body.date;
  
  if(!date){
    date = new Date();
  }else{
    date = new Date(date).toDateString();
  }

 
  await registration.updateOne({_id: idbody}, {$set:{description: description, duration: duration, date: date}});

 var byid = await registration.findById(idbody);
  res.json(byid);
})

app.get("/api/users/:_id/logs?", async function(req, res){
  var idparameter = req.params._id;
  var from = req.query.from;
  var to = req.query.to;
  var limit = Number(req.query.limit);

  registration.find({idparameter})
  .where("username")
  .gte(from)
  .lte(to)
  .limit(limit)
  .then(registration => res.json(registration))
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
