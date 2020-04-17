let socket = io();
let list;

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

// recover the li item
let nb = 0;
let nbLi = document.getElementById('nb');

// add 1 to the li item when you click
function add () {
    nb++;
    nbLi.innerHTML = nb;
}

let btn = document.getElementById('add');
btn.addEventListener("click", function () {
    add();
    socket.emit('add');
})

// add 1 to the li item when the others user click
socket.on('updateNb', () => {
  add();
})
