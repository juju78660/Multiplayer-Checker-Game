let socket = io();

// socket connection cote client
socket.on('connect', function () {
    console.log("connected client side");
    console.log(socket.id);

    // socket when new user connecte
    socket.on("updateUserConnected", function (users) {
      console.log(users);
    });
});

// socket deconnection cote client
socket.on('disconnect', function () {
    console.log("disconected client side");
    });

let nb = 0;

function add () {
    nb++;
    let nbLi = document.getElementById('nb');
    nbLi.innerHTML = nb;
}

let btn = document.getElementById('add');
btn.addEventListener("click", function () {
    add();
})
