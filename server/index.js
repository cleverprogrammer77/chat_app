const express = require('express')
const app = express();
const http = require('http')
const cors = require('cors')

const { Server } = require("socket.io");

app.use(cors())

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin : 'http://localhost:5173',
        methods : ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('User connected',socket.id);

    socket.on('join_room', (data) => {
        socket.join(data);
        console.log(`User with id : ${socket.id} joined room : ${data}`);
    })

    socket.on("send_message", (data) => {
        // console.log(data)
        socket.to(data.room).emit("receive_message", data)
    })

    //image send
    socket.on('send_image', (data) => {
        // Handle the received image data here
        // You can save it to a file, process it, or send it to other clients in the room
        console.log(`Received image from ${socket.id} in room ${data.room}`);
        // Example: You can broadcast the image to all clients in the room
        io.to(data.room).emit('receive_image', data.image);
    });

    //image sent

    socket.on("disconnect", () => {
        console.log('User disconnected', socket.id);
    })
});


server.listen(3001, () => {
    console.log('listening on *:3001');
})