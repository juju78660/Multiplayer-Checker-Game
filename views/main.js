let socket = io();

let nbConnect = 0;

socket.on('connection', () => {

    console.log("in connection");
    //nbConnect = nbConnect +1;
    console.log("user connected");
    
    socket.on('disconnect', () => {
        console.log("disconected");
    });
});