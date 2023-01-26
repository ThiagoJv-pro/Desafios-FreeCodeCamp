var express = require('express');

var validUrl = require("valid-url"); //Funcao para identificar se a url passada como argumento esta formatada corretamente
const shortid = require('shortid');
const cors = require('cors');
const app = express.Router();
const bodyParser = require("body-parser");
var mongoose = require("mongoose");
const { urlencoded } = require('express');
const Schema = mongoose.Schema;

app.use(bodyParser.urlencoded({extendeds: false}))
//db configuration
const uri = process.env.MONGO_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
});

const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error: '));
connection.once('open', () => {
  console.log("connection successfully");
})

const urlSchema = new Schema({
  original_url: String,
  short_url: String
}, {collection: 'free'});

const URL = mongoose.model("URL", urlSchema);

/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

app.post("/api/shorturl", async function(req, res){
  const url = req.body.url;
  const urlCode = shortid.generate();
  console.log(urlCode)
  //Validando se a url está no padrão correto
  if(!validUrl.isWebUri(url)){
    res.json({error: "invalid url"});
  }else{
    try{
      var findOne = await URL.findOne({
        original_url: url
      });
      //Verificar se uma variavel findOne é verdadeira, se for, é retornado um objeto Json contendo a keys informadas
      if(findOne){
        res.json({original_url: findOne.original_url,
                 short_url: findOne.short_url})
      }else{
        findOne = new URL({
          original_url: url,
          short_url: urlCode 
        })
        
        await findOne.save();
        
        res.json({
          original_url: findOne.original_url,
          short_url: findOne.short_url
        })
      }
    } catch (err){w
      console.error(err)
    }
  }
})

app.get("/api/shorturl/:short_url?", async function(req, res){
try{
      const urlParams = await URL.findOne({
      short_url: req.params.short_url
   })
      
  if(urlParams){
    return res.redirect(urlParams.original_url);
  }  
  console.log(req.params.short_url);
 }catch (err){
   console.log(err)
 }
})

module.exports = app;
