const express = require('express');
const bodyP = require('body-parser');
var nunjucks = require('nunjucks');
const http = require('http');
const socketIO = require('socket.io');
var firebase = require('firebase');
var firebaseConfig = require('./js/firebase.js');
const { userObj } = require('./js/userObj');
const { Users } = require('./js/Users');

// INITIALIZE THE APP
const app = express();
app.use(bodyP.json());
app.use(bodyP.urlencoded({ extended: true }));

// ADD STATIC FOLDERS AND FILES USED IN THE PROGRAM
app.use(express.static("views"));
app.use(express.static("views/Home"));
app.use(express.static("views/Login"));
app.use(express.static("views/Register"));
app.use(express.static("views/Main"));
app.use(express.static("views/Play"));

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

/****** Routes *******/
app.get('/', function(req, res){
    // Retirer if else pour pouvoir connecter plusieurs utilisateur
    res.sendFile('home.html', { root: __dirname + "/views/Home" } );
});

app.get('/register', function(req, res) {
    // Retirer if else pour pouvoir connecter plusieurs utilisateur
    res.render('Register/register');
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

        // AJOUT UTILISATEUR BD
        firebase.auth().onAuthStateChanged(function(user)
        {
            if(user){
                // ADD USERNAME INFO TO AUTH SYSTEM
                user.updateProfile({
                    displayName: username
                }).then(function() {

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
                            res.render('Main/main', {user: user});
                            return;
                        })

                        // IF USER CAN'T BE ADDED TO DB, REMOVING ACCOUNT FROM FIREBASE AUTHENTICATION
                        .catch(function(error) {
                            console.error("Error adding user: ", error);
                            var user = firebase.auth().currentUser;
                            if(user){
                                console.error("USER LOGGED");
                                user.delete()
                                .then(function() {console.error("USER ACCOUNT DELETED");})
                                .catch(function(error) { console.error("Error deleting user account: ", error);});
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
    // retirer if else pour pouvoir connecter plusieurs utilisateur
        res.render('Login/login');
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
                    res.render('Main/main', {  user: user });
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
        res.sendFile('Main/main.html', { root: __dirname + "/views" } );
    }
});

app.get('/play', function(req, res) {
    if(!firebase.auth().currentUser){
        res.redirect('/login');
    }
    else{
        res.sendFile('Play/play.html', { root: __dirname + "/views" } );
    }
});

/****** DISCONNECT *******/
app.get('/disconnect', function(req, res) {
    if(firebase.auth().currentUser){
        firebase.auth().signOut();
    }
    res.redirect('/');
});

let users = new Users();

// the server listen for a connection
io.on('connection', (socket) => {

    user = firebase.auth().currentUser;

    if (user) {

        // Create userobj and add to users
        let userobj = new userObj(socket.id, user.uid, user.displayName);
        users.addUser(userobj);

        // Send update list to all user
        io.emit('updateUserConnected', users.getUsers());

        // Remove the user from the list and send it to the front
        socket.on('NewLogout', (message) => {
            users.removeUser(userobj.getIdUser());
            io.emit('updateUserConnected', users.getUsers());
        });

        // Battle socket
        socket.on('battle', (res, callback) => {

            let challenger = users.getUserBySocket(socket.id);
            let challenged = users.getUserBySocket(res.challengedSocketId);

            // Verif available & send opponent in play.html
            // may need a room later
            if (challenger.invite(challenged) == true) {

                let room = challenger.username + challenged.username;
                challenger.room = room;
                challenged.room = room;

                socket.broadcast.to(challenged.idSocket).emit('battlePage');
                // send currrent user in play.html
                callback();
            }
        })

        // Remove the user from the list and send it to the front
        socket.on('disconnect', () => {
            users.removeUser(userobj.getIdUser());
            io.emit('updateUserConnected', users.getUsers());
        });
    }
});

// HAVE REPLACE app by server
server.listen(port, () => console.log(`Example app listening on port ${port}!`));
