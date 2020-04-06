
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

// socket when new user connecte
socket.on("updateUserConnected", function (users) {

    let ol = document.createElement('ol');

    // for each user create elem with name and button
    users.forEach(function (user) {
        let li = document.createElement('li');
        let btn = document.createElement('button');

        li.innerHTML = user.username;
        ol.appendChild(li);

        // Add click battle event
        btn.innerHTML = "Battle";
        btn.setAttribute("class", "login100-form-btn");
        
        btn.addEventListener('click', function () {
            //envoyer le champs id de btns.item(i)
            socket.emit('battle', { challengedSocketId: user.idSocket});
        })
        ol.appendChild(btn);
    });

    // append to front div
    let userList = document.querySelector("#users");
    userList.innerHTML = "";
    userList.appendChild(ol);
})