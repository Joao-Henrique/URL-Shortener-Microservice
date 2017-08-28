//REQUIRE MODULES
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');

//CREATE AN INSTANCE OF EXPRESS FOR OUR APP AND ISNTANTIATE BODYPARSER AND CORS
var app = module.exports = express();
app.use(bodyParser.json());
app.use(cors());
app.use("/", express.static(__dirname));

//SEND HTML AND CSS TO THE CLIENT SIDE
//app.get('/', function(req, res){
//  res.sendFile("index.html", {root: __dirname})
//  res.sendFile("style.css", {root: __dirname})
//});


//LISTEN ON PORT
app.listen(process.env.port || 3000, () => 
  console.log('Your Server is Working...')
);
