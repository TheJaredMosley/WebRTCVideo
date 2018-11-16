const express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', function(socket){
    console.log("a user connected");

    socket.on('create or join', function(room){
        var myRoom = io.sockets.adapter.rooms[room] || {length: 0};
        var numClients = myRoom.length;


        if(numClients == 0){
            socket.join(room);
            socket.emit('created', room);
        }else if(numClients ==1){
            socket.join(room);
            socket.emit('joined', room);
            console.log("YOU JOINED A ROOM");
        }else {
            socket.emit('full', room);
            console.log("THIS ROOM IS FULL");
        }
    });

    socket.on('ready', function(room){
        socket.broadcast.to(room).emit('ready');
    });

    socket.on('candidate', function(event){
        socket.broadcast.to(event.room).emit('candidate', event);
    });

    socket.on('offer', function(event){
        socket.broadcast.to(event.room).emit('offer', event.sdp);
    });

    socket.on('answer', function(event){
        socket.broadcast.to(event.room).emit('answer', event.sdp);
    });
});

http.listen(3000, function(){
    console.log("listen on port 3000");
});