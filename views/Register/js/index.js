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
  firebase.analytics();

  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

  // Recuperation de la bdd
  var db = firebase.firestore();

  $("#btn_register").click(function()
  {

    // recuperation des données du formulaire
    var email = $("#email").val();
    var password = $("#password").val();
    var repassword = $("#re_password").val();
    var game_name = $("#game_name").val();

    if(email!="" && password!="" && repassword!="")
    {
        if(password == repassword)
        {

          // Creation de l'utilisateur et verif erreur
          var result = firebase.auth().createUserWithEmailAndPassword(email,password);
          result.catch(function(error)
          {
            var errorMessage = error.message;
            window.alert("Message: " + errorMessage );
          });
          }
          else
          {
            window.alert("Passwords do not match");
          }

          // get user
          var user = firebase.auth().currentUser;

          // Add a new document in collection "users" avec comme nom de doc user.id avec gameName,  email, win, lost
          db.collection("users").doc(user.uid).set({
            game_name: game_name,
            email: email,
            win: 0,
            lost: 0
          })
          .then(function() {
            console.log("Document successfully written!");
          })
          .catch(function(error) {
            console.error("Error writing document: ", error);
          });
    }
    else
    {
        window.alert("Please fill out all fields!");
    }
  });