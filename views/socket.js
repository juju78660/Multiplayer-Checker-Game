var socket = io();

// socket connection cote client
socket.on('connect', function () {
    console.log("connected client side");
    console.log(socket.id);
    });

// socket deconnection cote client
socket.on('disconnect', function () {
    console.log("disconected client side");
    });
