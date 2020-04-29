
// Recuperation du bouton logout et creation de sa socket
const logout = document.getElementById('btn_logout');
logout.setAttribute("class", "btn btn-dark");
logout.addEventListener('click', function () {socket.emit('NewLogout');});

// socket when new user connecte
socket.on("updateUserConnected", function (users, dbUsers) {

    console.log(users);
    var usernameValue = document.getElementById("username"); // RECUPERATION USERNAME DANS HTML

    var tableau = document.getElementById("tableau");

    // REMISE A ZERO DU TABLEAU
    tableau.innerHTML = '';

    var listeUtilisateursConnectes = [];    // LISTE DES UTILISATEURS CONNECTES
    var listeUtilisateursNonConnectes = []; // LISTE DES UTILISATEURS NON CONNECTES
    var boolConnecte = false;

    // PARCOURS DES UTILISATEURS DE LA BD ET AJOUT DANS LA LISTE CONNECTE OU NON
    dbUsers.forEach(function (user) {
        var userConnecte;
        boolConnecte = false;

        users.forEach(function(value){
            if(value.username === user[0]){
                boolConnecte = true;
                userConnecte = value;
            }
            if (socket.id === value.idSocket) {
                usernameValue.innerHTML = value.username;
            }
        });
        if(boolConnecte) listeUtilisateursConnectes.push([user[0], user[1][1], user[1][2]]);
        else listeUtilisateursNonConnectes.push([user[0], user[1][1], user[1][2]]);
    });

    // REMPLISSAGE DU TABLEAU DES UTILISATEURS CONNECTES
    for (var i = 0; i < listeUtilisateursConnectes.length; i++) {
        var btn = document.createElement("BUTTON");
        var donnees = listeUtilisateursConnectes[i];
        var ligne = tableau.insertRow(-1); // AJOUT LIGNE
        ligne.id = donnees[0];
        var colonne1 = ligne.insertCell(0); // AFFICHAGE NOM UTILISATEUR
        colonne1.innerHTML = donnees[0];
        var colonne2 = ligne.insertCell(1); // AFFICHAGE PARTIE GAGNEE
        colonne2.innerHTML = donnees[2];
        var colonne3 = ligne.insertCell(2); // AFFICHAGE PARTIE PERDUES
        colonne3.innerHTML = donnees[1];
        var colonne4 = ligne.insertCell(3); // BOUTON BATTLE


        // SI L'AJOUT DU BOUTON CORRESPOND A L'UTILISATEUR
        if(usernameValue.innerHTML === donnees[0]) {
            btn.innerHTML = "XXX";
        }else{
            btn.innerHTML = "Battle";
            users.forEach(function(value){
                if(value.username === donnees[0]){
                    btn.addEventListener('click', function () {
                        socket.emit('battle', {
                            challengedSocketId: value.idSocket,
                            challengerSocketId: socket.id
                        });
                    });
                }
            });
        }
        btn.setAttribute("class", "btn btn-dark");
        colonne4.appendChild(btn);
    }

    // REMPLISSAGE DU TABLEAU DES UTILISATEURS NON CONNECTES
    for (var i = 0; i < listeUtilisateursNonConnectes.length; i++) {
        var donnees = listeUtilisateursNonConnectes[i];
        var ligne = tableau.insertRow(-1); // AJOUT LIGNE
        ligne.id = donnees[0];
        var colonne1 = ligne.insertCell(0);
        colonne1.innerHTML = donnees[0];
        var colonne2 = ligne.insertCell(1); // AFFICHAGE PARTIE GAGNEE
        colonne2.innerHTML = donnees[2];
        var colonne3 = ligne.insertCell(2); // AFFICHAGE PARTIE PERDUES
        colonne3.innerHTML = donnees[1];
    }
});


// Redirect opponent to play
socket.on("battlePage", function () {
    location.href = '/play';
});
