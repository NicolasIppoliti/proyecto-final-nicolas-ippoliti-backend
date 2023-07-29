import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log(socket.id); // "G5p5..."
});

socket.on('chat message', (msg) => {
  console.log('message: ' + msg);
});

// To send a message
socket.emit('chat message', 'Hello world!');
