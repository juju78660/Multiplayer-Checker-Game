const express = require('express');
const bodyP = require('body-parser');
var nunjucks = require('nunjucks');
const http = require('http');
const socketIO = require('socket.io');
var firebase = require('firebase');
var firebaseConfig = require('./js/firebase.js');
var user = require('./js/user');
require('firebase/auth');
require('firebase/database');

// INITIALIZE THE APP
const app = express();
app.use(bodyP.json());
app.use(bodyP.urlencoded({ extended: true }));

app.use(express.static("views"));
app.use(express.static("views/Home"));
app.use(express.static("views/Login"));
app.use(express.static("views/Register"));

// ENGINE USE TO RENDER
nunjucks.configure('views', {
    express: app,
    autoescape: true
});
app.set('view engine', 'html');


// INITIALISE FIREBASE
firebase.initializeApp(firebaseConfig.getFirebaseConfig());

// SOCKET IO NEED OUR OWN HTTP SERVER
const port = 3000;
let server = http.createServer(app);
let io = socketIO(server);

let connected_users = {};
let nbConnect = 0;

// the server listen for a connection
io.on('connection', (socket) => {

    nbConnect = nbConnect +1;
    //console.log("nombre user connecté :" + nbConnect);
    console.log("user connected");
    
    socket.on('disconnect', () => {
        console.log("disconected")
    });
});

app.get('/', function(req, res){
    console.log("Utilisateur: " + firebase.auth().currentUser);
    if(!firebase.auth().currentUser){
        res.sendFile('home.html', { root: __dirname + "/views/Home" } );
    }
    else{
        res.redirect('/main');
    }
});

/****** Routes *******/
app.get('/register', function(req, res) {
    if(!firebase.auth().currentUser){
        res.render('Register/register');
    }
    else{
        res.redirect('/main');
    }
});

app.post('/register', async function(req, res) {
    var x = new Boolean("false");
    var db = firebase.firestore();

    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var repassword = req.body.re_password;

    // DECONNECTE L'UTILISATEUR POSSIBLEMENT DEJA CONNECTE
    firebase.auth().signOut();

    if(password == repassword)
    {

        // AJOUT COMPTE AUTHENTIFICATION
        firebase.auth().createUserWithEmailAndPassword(email,password).catch(function(error)
        {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode + ":" + errorMessage);

            res.render('Register/register', {error_message: errorMessage,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                re_password: req.body.re_password
            });
        });
        console.log("Account email:" + email + " successfully created (Username:" + username + ")");

        // AJOUT UTILISATEUR BD
        firebase.auth().onAuthStateChanged(function(user)
        {
            if(user){
                console.log("Utilisateur co: " + user.uid);

                // ADD USERNAME INFO TO AUTH SYSTEM
                user.updateProfile({
                    displayName: username
                }).then(function() {
                    console.log("Username set to:" + username);

                    // ADD USER TO THE DB
                    var userUID = user.uid;
                    let data = {
                        username : username,
                        email: email,
                        win: 0,
                        lost: 0
                    };
                    db.collection("users").doc(userUID).set(data)
                        .then(function() {
                            console.log("User {Username:" + user.displayName + " - UID:" + userUID + " - email:" + user.email + "} has been added to the DB");
                            res.render('main', { username: user.displayName, uid: user.uid });
                            return;
                        })
                        // IF USER CAN'T BE ADDED TO DB, REMOVING ACCOUNT FROM FIREBASE AUTHENTICATION
                        .catch(function(error) {
                            console.error("Error adding user: ", error);
                            var user = firebase.auth().currentUser;
                            if(user){
                                console.error("USER LOGGED");
                                user.delete().then(function() {
                                    console.error("USER ACCOUNT DELETED");
                                }).catch(function(error) {
                                    console.error("Error deleting user account: ", error);
                                });
                            }
                            console.log("REDIRECTION VERS /register a faire");
                        });
                }).catch(function(error) {
                    console.error("Error setting username: ", error);
                });

            }
        });

    }
    else
    {
        res.render('Register/register', {error_message: 'Passwords do not match !',
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            re_password: req.body.re_password
        });
    }
});

app.get('/login', function(req, res) {
    var user = firebase.auth().currentUser;
    if(!user){
        res.render('Login/login');
    }
    else{
        res.redirect("/main");
    }
});

app.post('/login', async function(req, res) {
    var x = true;

    console.log("/login post");
    try {
        var email = req.body.email;
        var password = req.body.password;

        firebase.auth().signInWithEmailAndPassword(email, password).then(function(firebaseUser) {
            //res.redirect('/main');
            firebase.auth().onAuthStateChanged(function(user) {
                if (user && x) {
                    x = false;
                    console.log("username:" + user.displayName + "-" + "UID:" + user.uid);
                    res.render('main', { username: user.displayName, uid: user.uid });
                    //res.redirect("/main");
                    /*res.end();
                    return;*/
                }
            });
        })
        .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode + ":" + errorMessage);

            res.render('Login/login', {error_message: errorMessage,
                email: req.body.email,
                password: req.body.password});
        });
    }
    catch(error) {
        console.error("Login error:" + error);
    }
});

app.get('/forgetPassword', function(req, res) {
  res.sendFile('forgetPassword.html', { root: __dirname + "/views/Login" } );
});

app.get('/main', function(req, res) {
    if(!firebase.auth().currentUser){
        res.redirect('/login');
    }
    else{
        res.sendFile('main.html', { root: __dirname + "/views" } );
    }
});

app.get('/disconnect', function(req, res) {
    if(firebase.auth().currentUser){
        firebase.auth().signOut();
    }
    res.redirect('/');
});


// HAVE REPLACE app by server
server.listen(port, () => console.log(`Example app listening on port ${port}!`));