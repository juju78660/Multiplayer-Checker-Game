
let socket = io();

// socket connection cote client
socket.on('connect', function () {
    console.log("connected client side");
    });

// socket deconnection cote client
socket.on('disconnect', function () {
    console.log("disconected client side");
    });

// Recuperation du bouton logout et creation de sa socket
const logout = document.getElementById('btn_logout');
logout.addEventListener('click', function () {socket.emit('NewLogout');});

// socket which update list client
socket.on("updateUserConnected", function (users) {

    // create order list
    let ol = document.createElement('ol');

    // for each user create elem with name and button
    users.forEach(function (user) {
        let li = document.createElement('li');
        let btn = document.createElement('button');

        // match userid & button
        btn.setAttribute("id", user.idUser);
        li.innerHTML = user.username;
        ol.appendChild(li);
        btn.innerHTML = "Battle";
        ol.appendChild(btn);
    });

    // append to front div
    let userList = document.querySelector("#users");
    userList.innerHTML = "";
    userList.appendChild(ol);
})

// socket battle
const btns = document.getElementsByTagName('button');
btns.forEach(function(btn) {
    btn.addEventListener('click', function () {
        if (btn.getAttribute("id") != 'btn_logout') {
            socket.emit('battle', {idChallenged: btn.getAttribute("id")});
        };
    });
});