const express = require('express');
const app = express();
const bodyP = require('body-parser');
app.use(bodyP.json());
app.use(bodyP.urlencoded({ extended: true }));
const port = 3000;

// ADD STATIC FOLDERS AND FILES USED IN THE PROGRAM
app.use(express.static("views"));
app.use(express.static("views/Home"));
app.use(express.static("views/Login"));
app.use(express.static("views/Register"));
app.use(express.static("views/Play"));
app.use(express.static("firebase.js"));

// ENGINE USE TO RENDER
var nunjucks = require('nunjucks');

nunjucks.configure('views', {
    express: app,
    autoescape: true
});
app.set('view engine', 'html');

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// *** FIREBASE ***
var firebase = require('firebase');
require('firebase/auth');
require('firebase/database');

// INITIALISE FIREBASE
var firebaseConfig = require('./firebase.js');
firebase.initializeApp(firebaseConfig.getFirebaseConfig());

/****** Routes *******/
/*
app.get('/', function(req, res){
    var user = firebase.auth().currentUser;
    if(!user){
        res.sendFile('home.html', { root: __dirname + "/views/Home" } );
    }
    else{
        res.redirect('/main');
    }
});
*/
app.get('/', function(req, res) {
    res.sendFile('play.html', { root: __dirname + "/views/Play" } );

});

/****** REGISTER *******/
app.get('/register', function(req, res) {
    if(!firebase.auth().currentUser){
        res.render('Register/register');
    }
    else{
        res.redirect('/main');
    }
});

app.post('/register', async function(req, res) {
    var firstStateChange = true;
    var db = firebase.firestore();

    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var repassword = req.body.re_password;

    // DECONNECTE L'UTILISATEUR POSSIBLEMENT DEJA CONNECTE
    if(firebase.auth().currentUser) firebase.auth().signOut();


    if(password == repassword)
    {
        //CHECK IF USER ALREADY EXISTS IN DB
        const usersRef = db.collection('users').doc(username);
        usersRef.get()
            .then((docSnapshot) => {
                if (docSnapshot.exists) {   // IF USERNAME ALREADY EXISTS -> STOP PROCESS
                    console.log("User " + username + " already exists in DB");
                    res.render('Register/register', {error_message: "Username is already in use !",
                        username: username,
                        email: email,
                        password: password,
                        re_password: repassword
                    });
                } else {    // IF USER DOESN'T EXISTS -> CONTINUE CREATION PROCESS
                    // AJOUT COMPTE AUTHENTIFICATION
                    firebase.auth().createUserWithEmailAndPassword(email,password).then(function(firebaseUser) {
                        console.log("Account {Email:" + email + " - username:" + username + "} successfully created");
                        // AJOUT UTILISATEUR BD
                        firebase.auth().onAuthStateChanged(function(user)
                        {
                            if(user && firstStateChange){
                                firstStateChange = false;
                                // ADD USERNAME INFO TO AUTH SYSTEM
                                user.updateProfile({
                                    displayName: username
                                }).then(function() {
                                    // ADD USER TO THE DB
                                    var userUID = user.uid;
                                    let data = {
                                        username : username,
                                        UID : userUID,
                                        email: email,
                                        win: 0,
                                        lost: 0
                                    };
                                    db.collection("users").doc(username).set(data)
                                        .then(function() {
                                            console.log("User {Username:" + username + " - UID:" + userUID + " - email:" + email + "} added to DB");
                                            res.redirect('/main');
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
                    })
                        .catch(function(error)
                        {
                            var errorCode = error.code;
                            var errorMessage = error.message;
                            console.log(errorCode + ":" + errorMessage);

                            res.render('Register/register', {error_message: errorMessage,
                                username: username,
                                email: email,
                                password: password,
                                re_password: repassword
                            });
                        });
                }
            });
    }
    else        // IF PASSWORD AND PASSWORD CONFIRMATION ARE NOT ==
    {
        res.render('Register/register', {error_message: 'Passwords do not match !',
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            re_password: req.body.re_password
        });
    }
});

/****** LOGIN *******/
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
    var firstStateChange = true;
    try {
        var email = req.body.email;
        var password = req.body.password;

        firebase.auth().signInWithEmailAndPassword(email, password).then(function(firebaseUser) {
            firebase.auth().onAuthStateChanged(function(user) {
                if (user && firstStateChange) {
                    firstStateChange = false;
                    console.log("username:" + user.displayName + "-" + "UID:" + user.uid);
                    res.redirect("/main");
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

/****** FORGET PASSWORD *******/
app.get('/forgetPassword', function(req, res) {
    var user = firebase.auth().currentUser;
    if(!user){
        res.render('Login/forgetPassword');
    }
    else{
        res.redirect("/main");
    }
});

app.post('/forgetPassword', async function(req, res) {
    try {
        var auth = firebase.auth();
        var email = req.body.email;

        auth.sendPasswordResetEmail(email).then(function()
        {
            res.render('Login/forgetPassword', {result_message: "The instructions to reset your password has been sent to you"});
        })
            .catch(function(error)
            {
                var errorCode = error.code;
                var errorMessage = error.message;

                console.log(errorCode + ":" + errorMessage);
                res.render('Login/forgetPassword', {result_message: errorMessage});
            });
    }
    catch(error) {
        console.error("Reset password error:" + error);
    }
});




/****** MAIN *******/
app.get('/main', function(req, res) {
    var user = firebase.auth().currentUser;
    if(!user){
        res.redirect('/login');
    }
    else{
        res.render('main', { username: user.displayName, uid: user.uid });
    }
});

/****** DISCONNECT *******/
app.get('/disconnect', function(req, res) {
    if(firebase.auth().currentUser){
        firebase.auth().signOut();
    }
    res.redirect('/');
});

/****** PLAY *******/
app.get('/play', function(req, res) {
    if(firebase.auth().currentUser){
        res.sendFile('play.html', { root: __dirname + "/views/Play" } );
    }
    else{
        res.redirect('/');
    }
});