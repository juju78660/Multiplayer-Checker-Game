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

// INITIALISE FIREBASE
var firebaseConfig = require('./firebase.js');
firebase.initializeApp(firebaseConfig.getFirebaseConfig());


app.get('/', function(req, res){
    if(!firebase.auth().currentUser){
        res.sendFile('home.html', { root: __dirname + "/views/Home" } );
    }
    else{
        res.sendFile('main.html', { root: __dirname + "/views/Login" } );
    }
});

/****** Routes *******/
app.get('/register', function(req, res) {
    if(!firebase.auth().currentUser){
        res.sendFile('register.html', { root: __dirname + "/views/Register" } );
    }
    else{
        res.sendFile('main.html', { root: __dirname + "/views/Login" } );
    }
});

app.get('/login', function(req, res) {
    if(!firebase.auth().currentUser){
        res.sendFile('login.html', { root: __dirname + "/views/Login" } );
    }
    else{
        res.sendFile('main.html', { root: __dirname + "/views/Login" } );
    }
});

app.get('/forgetPassword', function(req, res) {
  res.sendFile('forgetPassword.html', { root: __dirname + "/views/Login" } );
});

app.get('/main', function(req, res) {
    if(!firebase.auth().currentUser){
        res.sendFile('login.html', { root: __dirname + "/views/Login" } );
    }
    else{
        res.sendFile('main.html', { root: __dirname + "/views/Login" } );
    }
});
