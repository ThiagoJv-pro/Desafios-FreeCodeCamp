var express = require('express');
var router = express.Router();
var multer = require("multer");
var upfile = multer({dest: "/uploads"});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/api/fileanalyse", upload.single('upfile'), async function (req, res) {
  
  var name = req.file.originalname;
  var type = req.file.mimetype;
  var size = req.file.size;

 res.json({name: name, type: type, size: size});
});

module.exports = router;
