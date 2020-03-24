/*
// On charge le framework Express...
var express = require('express');
// On crée l'application web
var app = express();

// On configure Express pour servir les fichiers condftenus dans public/
// à l'url /
app.use('/s', express.static('public'));
express.static('script.js');
express.static('style.css');


console.log('Server running at http://127.0.0.1:1337/');

app.get('/', function (req, res) {
    res.sendfile('hello.html', { root: __dirname + "/views" } );
});

// On lance l'application
app.listen(process.env.PORT);
*/

const express = require('express')
const app = express()
const port = 3000

app.use(express.static("views"));
app.use(express.static("views/Home"));
app.use(express.static("views/Login"));
app.use(express.static("views/Register"));

app.get('/', function(req, res){
    res.sendFile('home.html', { root: __dirname + "/views/Home" } );
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


// *** FIREBASE ***
var firebase = require('firebase');
  require('firebase/auth');
  require('firebase/database');

//  FIREBASE CONFIG
var firebaseConfig =
{   
    apiKey: "AIzaSyB-h0fhhciH-F2z9JUp_bbn4QcDzR2zhSo",
    authDomain: "dames-14e44.firebaseapp.com",
    databaseURL: "https://dames-14e44.firebaseio.com",
    projectId: "dames-14e44",
    storageBucket: "dames-14e44.appspot.com",
    messagingSenderId: "593473240019",
    appId: "1:593473240019:web:8a81b758a93a7e08ce8d26",
    measurementId: "G-HP3VF4RGTK"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

// CHECK IF THE USER IS LOGGED
module.exports = {
    isAuthenticated: function (req, res, next) {
      var user = firebase.auth().currentUser;
      if (user !== null) {
        req.user = user;
        next();
      } else {
        res.redirect('/login');
      }
    },
  }
/*
var documents = require('../controllers/documents');

  const routes = (router, authenticate) => {
    // Get all documents
    router.get('/documents/', authenticate.isAuthenticated, documents.getAll);
  }

  module.exports routes;

*/


/****** Routes *******/

app.get('/register', function(req, res) {
  res.sendFile('register.html', { root: __dirname + "/views/Register" } );
});

app.get('/login', function(req, res) {
  res.sendFile('login.html', { root: __dirname + "/views/Login" } );
});

app.get('/forgetPassword', function(req, res) {
  res.sendFile('forgetPassword.html', { root: __dirname + "/views/Login" } );
});

app.get('/main', function(req, res) {
  res.sendFile('main.html', { root: __dirname + "/views/Login" } );
});

/*
// Style page Login
app.get('/style.css', function(req, res) {
  res.sendFile("/views/Home/css/main.css");
});
*/

// on ajoute des routes vers l'url /
app.get('/', function(req, res)
{
  //console.log('session ' + req.session.pseudo);
  if(req.session.pseudo)
  {
    res.redirect('/userConnecter');
  }
  else
  {
    res.render('connexion.html');
  }

});

