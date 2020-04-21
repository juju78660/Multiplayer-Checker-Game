
// Recuperation du bouton logout et creation de sa socket
const logout = document.getElementById('btn_logout');
logout.addEventListener('click', function () {socket.emit('NewLogout');});

// socket when new user connecte
socket.on("updateUserConnected", function (users) {

    let ol = document.createElement('ol');
    console.log(users);

    // for each user create elem with name and button
    users.forEach(function (user) {
        let li = document.createElement('li');
        let btn = document.createElement('button');

        li.innerHTML = user.username;
        ol.appendChild(li);

        // Add click battle event
        btn.innerHTML = "Battle";
        btn.setAttribute("class", "btn btn-dark");
        btn.addEventListener('click', function () {
          socket.emit('battle', {challengedSocketId: user.idSocket}, function () {
            location.href = '/play.html';
            });
        })
        ol.appendChild(btn);
    });
    // append to front div
    let userList = document.querySelector("#users");
    userList.innerHTML = "";
    userList.appendChild(ol);
})

// Redirect opponent to play
socket.on("battlePage", function () {
    location.href = '/play.html';
});
