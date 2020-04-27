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
var db = firebase.firestore();

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

var boolDejaConnecte = false;
app.post('/register', async function(req, res) {
    boolDejaConnecte = false;
    var firstStateChange = true;

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
        var boolDejaConnecte = false;
        // AJOUT UTILISATEUR BD
        firebase.auth().onAuthStateChanged(function(user)
        {
            if(user && !boolDejaConnecte){
                console.log("ICIII");
                boolDejaConnecte = true;
                // ADD USERNAME INFO TO AUTH SYSTEM
                user.updateProfile({
                    displayName: username
                }).then(function() {

                    // ADD USER TO THE DB
                    let data = {
                        userUID : user.uid,
                        username : username,
                        email: email,
                        win: 0,
                        lost: 0
                    };
                    db.collection("users").doc(username).set(data)
                        .then(function() {
                            res.redirect("/main");
                            console.log("User " + username + " added to DB");
                            return(1);
                        })
                        // IF USER CAN'T BE ADDED TO DB, REMOVING ACCOUNT FROM FIREBASE AUTHENTICATION
                        .catch(function(error) {
                            console.error("Error adding user: ", error);
                            user.delete()
                            .then(function() {console.error("USER ACCOUNT DELETED");})
                            .catch(function(error) { console.error("Error deleting user account: ", error);});
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
                    console.log("User " + user.displayName + " connected");
                    return res.redirect("/main");
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
        res.render('Main/main', {  user: user });
    }
});

app.get('/play', function(req, res) {
    var user = firebase.auth().currentUser
    if(!user){
        res.redirect('/login');
    }
    /*else if(users.getUserById(user.uid).available){
        res.redirect('/main');
        console.log("PAS EN BATAILLE");
    }*/
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
let inBattle = [];
let opponent = false

var dbUsers = new Map();
// the server listen for a connection
io.on('connection', (socket) => {

    user = firebase.auth().currentUser;

    if (user) {

        let userobj = new userObj(socket.id, user.uid, user.displayName);

        // RECUPERATION DONNES UTILISATEUR EN BD
        db.collection("users").get()
            .then(function(querySnapshot) {
                console.log('updateUserConnected recup BD');
                //console.log(users);
                if (!querySnapshot.empty) {
                    querySnapshot.docs.map(function (documentSnapshot) {
                        dbUsers.set(documentSnapshot.data().username, [documentSnapshot.data().username, documentSnapshot.data().lost, documentSnapshot.data().win]);
                    })
                } else {
                    console.log('NO USER FOUND IN DATABASE !');
                }
                // if not already in the list add him & send the update list
                if (!users.getUserById(userobj.idUser)) {
                    users.addUser(userobj);
                    console.log('updateUserConnected');
                    io.emit('updateUserConnected', users.getUsers(), Array.from(dbUsers));
                }

                // Remove the user from the list and send it to the front
                socket.on('NewLogout', (message) => {
                    users.removeUser(socket.id);
                    console.log('NewLogout');
                    console.log(users);
                    io.emit('updateUserConnected', users.getUsers(), Array.from(dbUsers));
                });

                // Remove the user from the list and send it to the front
                socket.on('disconnect', () => {
                    console.log('disconnect');
                    // if user exist not in battle remove him
                    if (users.getUserBySocket(socket.id)) {
                        if ((users.getUserBySocket(socket.id)).available == true) {
                            users.removeUser(socket.id);
                            io.emit('updateUserConnected', users.getUsers(), Array.from(dbUsers));
                        }
                    }
                });

                // end the game by give up
                socket.on('GiveUpRequest', (res) => {
                    socket.broadcast.to(res).emit('GiveUpRequest', res);
                    setTimeout( () => {
                        io.emit('updateUserConnected', users.getUsers(), Array.from(dbUsers));
                        console.log("Update liste utilisateurs apres giveIp");
                    }, 10000);
                    /*
                    // INCREMENTATION
                    const increment = firebase.firestore.FieldValue.increment(1);
                    db.collection("users").doc(user.displayName).update({
                        win: increment
                    })
                        .then(function() {
                            console.log("INCREMENTATION REUSSIE")
                        })
                        .catch(function(error) {
                            console.error("Error incrementing victory of user " +  user.displayName + ": ", error.message);
                        });*/
                });
            });


        // if user in battle update their socket id
        if (inBattle.length != 0) {
          if (!opponent) {
            let challenger = inBattle.shift();
            users.getUserById(challenger.idUser).idSocket = socket.id;
            opponent = true;
          }
          else {
            let challenged = inBattle.shift();
            users.getUserById(challenged.idUser).idSocket = socket.id;
            opponent = false;
            inBattle = [];
          }
        }

        // socket battle
        socket.on('battle', (res) => {

          // recover both opponent
          let challenger = users.getUserBySocket(res.challengerSocketId);
          let challenged = users.getUserBySocket(res.challengedSocketId);

          // Verif available & send both in play.html
          if (challenger.invite(challenged) == true) {

            // challenger take black
            challenger.socketOpponent = challenged.idSocket;
            challenger.color = "black";

            // challenged take white
            challenged.socketOpponent = challenger.idSocket;
            challenged.color = "white";
            challenged.turn = true;

            // Add them in list inBattle
            inBattle.push(challenger);
            inBattle.push(challenged);

            // Send both in play & update list
            io.to(challenger.idSocket).emit('battlePage');
            io.to(challenged.idSocket).emit('battlePage');

            // Wait until they are on play.html
            setTimeout( () => {
              io.to(challenger.idSocket).emit('UpdateBattle', {
                challenger: challenger,
                challenged: challenged
              });
              io.to(challenged.idSocket).emit('UpdateBattle', {
                challenger: challenger,
                challenged: challenged
              });
            }, 3000);
          }
        });

        // Pass my turn & opponent turn
        socket.on('PassTurn', (res) => {
          console.log(res);
          res.me.turn = false;
          res.opponent.turn = true;
          socket.emit('UpdateBattle', {challenger: res.me, challenged: res.opponent});
          socket.broadcast.to(res.opponent.idSocket).emit('UpdateBattle', {challenger: res.me, challenged: res.opponent});
        });

        // update the adversaire board
        socket.on('UpdateBoard', (res) => {
          socket.broadcast.to(res.opponent.idSocket).emit('UpdateAdversaireBoard', res);
        });

    }
});

// HAVE REPLACE app by server
server.listen(port, () => console.log(`Example app listening on port ${port}!`));