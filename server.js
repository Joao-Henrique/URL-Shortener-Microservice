//////////////////////////////////////////////////
///////////   REQUIRE MODULES   //////////////////
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const ShortUrlModel = require ('./models/ShortUrl.model')
const keys = require('./keys.js');
app.use(bodyParser.json());
app.use(cors());
// END /////////////////////////////////////////////
////////////////////////////////////////////////////

mongoose.connect(keys.mongoURI);

////////////////////////////////////////////////////
//ALLOWS NODE TO FIND STATIC CONTENT (HTML AND CSS)/
app.use(express.static(__dirname + '/public'));
// END /////////////////////////////////////////////
////////////////////////////////////////////////////


////////////////////////////////////////////////////
///////   GETS USER INPUT FOR VALIDATION    ////////
app.get('/new/:urlToShorten(*)', (req, res) => {
  var urlToShorten = req.params.urlToShorten
  var regEx = /[-a-zA-Z0-9@:%\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%\+.~#?&//=]*)?/gi;
  if (regEx.test(urlToShorten)===true) {
    var short = Math.floor(Math.random()*100000).toString();
    var data = new ShortUrlModel({
      originalUrl: urlToShorten,
      shorterUrl: 'localhost:' + portNumber + '/' + short
    });
    data.save();
    return res.json(data)
  }
  var data = new ShortUrlModel({
    originalUrl: urlToShorten,
    shorterUrl: 'Your URL is invalid'
  })
  return res.json(data);
});
// END /////////////////////////////////////////////
////////////////////////////////////////////////////


////////////////////////////////////////////////////
////////////   QUERY DB AND GO TO URL   ////////////
app.get('/:urlToForward', (req, res) => {
  var shorterUrl = req.params.urlToForward;
  ShortUrlModel.findOne({'shorterUrl': shorterUrl}, (err, data) => {
    if (err) return res.send('Error reading database');
    var re = new RegExp("^(http|https)://", "i");
    var strToCheck = data.originalUrl;
    if(re.test(strToCheck)){
      res.redirect(301, data.originalUrl);
    }
    else {
      res.redirect(301, 'http://' + data.originalUrl);
    }
  });
});
// END /////////////////////////////////////////////
////////////////////////////////////////////////////


////////////////////////////////////////////////////
////////////   LISTEN ON PORT   ////////////////////
const portNumber = 3000;
app.listen(process.env.port || portNumber, () => 
  console.log('App Listening on Port ' + portNumber + '...'));
// END /////////////////////////////////////////////
////////////////////////////////////////////////////