//////////////////////////////////////////////////
///////////   REQUIRE MODULES   //////////////////
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const shortUrl = require ('./models/shortUrl')
app.use(bodyParser.json());
app.use(cors());
// END /////////////////////////////////////////////
////////////////////////////////////////////////////


////////////////////////////////////////////////////
//ALLOWS NODE TO FIND STATIC CONTENT (HTML AND CSS)/
app.use(express.static(__dirname + '/public'));
// END /////////////////////////////////////////////
////////////////////////////////////////////////////


////////////////////////////////////////////////////
////////////   CONNECT TO DATABASE   ///////////////
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:admin@ds115124.mlab.com:15124/urlshortdb')
var db = mongoose.connection
db.on('error',console.error.bind(console,'connection error:'))
db.once('open', ()=> {
    console.log('Succesfuly connected to DB')
})              
// END /////////////////////////////////////////////
////////////////////////////////////////////////////


////////////////////////////////////////////////////
///////   GETS USER INPUT FOR VALIDATION    ////////
app.get('/new/:urlToShorten(*)', (req, res) => {
  var urlToShorten = req.params.urlToShorten
  var regEx = /[-a-zA-Z0-9@:%\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%\+.~#?&//=]*)?/gi;
  if (regEx.test(urlToShorten)===true) {
    var short = Math.floor(Math.random()*100000).toString();
    var data = new shortUrl({
      originalUrl: urlToShorten,
      shorterUrl: short
    });
    data.save((err, data) => {
      if (err) return console.error(err)
    });
    return res.json(data)
  }
  var data = new shortUrl({
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
  shortUrl.findOne({'shorterUrl': shorterUrl}, (err, data) => {
    if (err) return res.send('Error reading database');
    var re = new RegExp("^(http|https)://", "i");
    console.log(data.originalUrl)
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
const portNumber = (process.env.PORT) || 3000;
app.listen( portNumber, () => 
  console.log('YOUR SERVER IS RUNNING...'));
// END /////////////////////////////////////////////
////////////////////////////////////////////////////