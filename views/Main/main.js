
let socket = io();

socket.on('connect', function () {
    console.log("connected client side");
    });

socket.on('disconnect', function () {
    console.log("disconected client side");
    });

const logout = document.getElementById('btn_logout');

logout.addEventListener('click', function () {
    socket.emit('logout', {
        user: "user",
        text: "Mamba out"
    });
});