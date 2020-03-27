// INITIALISE FIREBASE
/*var firebase = require('./firebase.js');
firebase.initializeApp(firebase.getFirebaseConfig());*/
console.log("");
// PEUT ETRE A SUPPRIMER ???
/*
firebase.analytics();

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

$("#btn_register").click(function()
{
	console.log("MDRRR");
	/*
	var db = firebase.firestore();

	var username = $("#username").val();
	var email = $("#email").val();
	var password = $("#password").val();
	var repassword = $("#re_password").val();

	// DECONNECTE L'UTILISATEUR POSSIBLEMENT DEJA CONNECTE
	firebase.auth().signOut();

	if(username!="" && email!="" && password!="" && repassword!="")
	{
		if(password == repassword)
		{
			var result = firebase.auth().createUserWithEmailAndPassword(email,password);

			// AJOUT UTILISATEUR BDD
			firebase.auth().onAuthStateChanged(function(user)
			{
				if(user){
					var userUID = firebase.auth().currentUser.uid;
					let data = {
						username : username,
						email: email,
						win: 0,
						lost: 0
					};
					db.collection("users").doc(userUID).set(data)
					.then(function() {
						console.log("User {UID: " + userUID + ",email:" + firebase.auth().currentUser.email + "} had been added");
					})
					.catch(function(error) {
						console.error("Error adding user: ", error);
					});
				}
			});
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
			window.alert("Passwords do not match");
		}
	}
	else
	{
		window.alert("Please fill out all fields!");
	}
});
*/
