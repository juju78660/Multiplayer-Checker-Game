// INITIALISE FIREBASE
/*var firebase = require('./firebase.js');
firebase.initializeApp(firebase.getFirebaseConfig());*/

console.log("");
// PEUT ETRE A SUPPRIMER ???
  /*
  firebase.analytics();

  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

  $("#btn_login").click(function()
  {
    console.log("ICI");
    var email = $("#email").val();
    var password = $("#password").val();

    if(email!="" && password!="")
    {
        var result = firebase.auth().signInWithEmailAndPassword(email, password);
        result.catch(function(error)
        {
            var errorCode = error.code;
            var errorMessage = error.message;

            console.log(errorCode);
            console.log(errorMessage);
            window.alert("Message: " + errorMessage );
        });
    }
    else
    {
        window.alert("Please fill out all fields!");
    }
  });

  $("#btn_logout").click(function()
  {
    firebase.auth().signOut();
  });
  */