
// Recuperation du bouton logout et creation de sa socket
const logout = document.getElementById('btn_logout');
logout.addEventListener('click', function () {socket.emit('NewLogout');});

// socket when new user connecte
socket.on("updateUserConnected", function (users) {

    console.log(users);

    var tableau = document.getElementById("tableau");
    while (tableau.firstChild) {
        tableau.removeChild(tableau.firstChild);
    }
    // for each user create elem with name and button
    users.forEach(function (user) {
        console.log(user);
        var ligne = tableau.insertRow(-1); // AJOUT LIGNE

        var colonne1 = ligne.insertCell(0);
        colonne1.innerHTML = user.username;
        var btn = document.createElement("BUTTON");
        var colonne2 = ligne.insertCell(1);

        btn.innerHTML = "Battle";
        btn.setAttribute("class", "btn btn-dark");
        btn.addEventListener('click', function () {
            socket.emit('battle', {
                challengedSocketId: user.idSocket,
                challengerSocketId: socket.id
            });
        });
        colonne2.appendChild(btn);
    });
});

// Redirect opponent to play
socket.on("battlePage", function () {
    location.href = '/play';
});
