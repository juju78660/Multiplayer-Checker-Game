
let socket = io();

socket.on('connect', () => {
    console.log("connected client side");
    });

socket.on('disconnect', () => {
    console.log("disconected client side");
    });