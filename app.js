
const express = require('express');
const app = express();
const port = 3000;

// To use the env variable in the .env file
require('dotenv').config();
//console.log("MY_VARIABLE: " + process.env.FIREBASE_CONFIG);

app.use(express.static("views"));
app.use(express.static("views/Home"));
app.use(express.static("views/Login"));
app.use(express.static("views/Register"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// *** FIREBASE ***
var firebase = require('firebase');
require('firebase/auth');
require('firebase/database');

//  FIREBASE CONFIG get the api key in the .env file not commited to hide the key
var firebaseConfig = process.env.FIREBASE_CONFIG;

firebase.initializeApp(firebaseConfig);

app.get('/', function(req, res){
    res.sendFile('home.html', { root: __dirname + "/views/Home" } );
    // TO DO: REDIRECTION VERS /main SI L'UTILISATEUR EST DEJA CONNECTE
});

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
