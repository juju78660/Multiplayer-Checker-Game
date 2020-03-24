const express = require('express');
const app = express();
const port = 3000;

app.use(express.static("views"));
app.use(express.static("views/Home"));
app.use(express.static("views/Login"));
app.use(express.static("views/Register"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

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
