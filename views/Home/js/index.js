// INITIALISE FIREBASE
/*var firebaseConfig = require('./firebase.js');
firebase.initializeApp(firebaseConfig.getFirebaseConfig());*/
console.log("");
// PEUT ETRE A SUPPRIMER ???
/*
firebase.analytics();

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

// AFFICHAGE
firebase.auth().onAuthStateChanged(function(user)
{
    var db = firebase.firestore();
    if(!user)
    {
        window.location.href = "/login";
    }
    else{
        // LECTURE BD
        var userUID = firebase.auth().currentUser.uid;

        let userRef = db.collection('users').doc(userUID);
        let getDoc = userRef.get()
            .then(node => {
                if (!node.exists) {
                    console.log('This user doesn\'t exist!');
                } else {
                    console.log('Document data:' + node.username);
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
            });

        return firebase.database().ref('/users/' + userUID).once('value').then(function(snapshot) {
            var username = (snapshot.val() && snapshot.val().userUID) || 'Anonymous';
            document.getElementById("userInfo").textContent= "Hello " + username + " (UID:"+ userUID + ") !";
        });
    }
})

$("#btn_logout").click(function()
{
    firebase.auth().signOut();
});*/
