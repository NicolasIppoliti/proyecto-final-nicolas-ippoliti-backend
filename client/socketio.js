import { io } from "socket.io-client";

const socket = io("https://proyecto-final-nicolas-ippoliti-backend.onrender.com");

socket.on("connect", () => {
  console.log(socket.id); // "G5p5..."
});

socket.on('chat message', (msg) => {
  console.log('message: ' + msg);
});

// To send a message
socket.emit('chat message', 'Hello world!');
