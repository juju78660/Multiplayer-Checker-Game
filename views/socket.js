var socket = io({transports: ['websocket'], upgrade: false});

console.log(cookieSession);

// socket connection cote client
socket.on('connect', function () {
    console.log("connected client side");
    console.log(socket.id);
    });

// socket deconnection cote client
socket.on('disconnect', function () {
    console.log("disconected client side");
    });
