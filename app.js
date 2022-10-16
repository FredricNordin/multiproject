import express from 'express';
import fs from 'fs';
import http from 'http';
import { Server } from "socket.io";
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = new Server(server);

let players = [];

io.on('connection', (socket) => {
    console.log("Client connected ID: " + socket.id);
    // Add a new user object to the users array as {id: socket.id, x: 100, y: 100}
    players.push({id: socket.id, x: 100, y: 100});
    // Update clients
    io.emit('data', players);

    // When the client sends a 'move' event find the object in players array matching data received from client, and update the x and y values for that object.
    socket.on('move', (data) => {
        players.forEach((players) => {
            if (players.id === data.id) {
                players.x += data.x;
                players.y += data.y;
            }
        });
        // Update clients
        io.emit('data', players);
    });

    // When the client disconnects
    socket.on('disconnect', () => {
        // Remove the object with id matching the disconnected sockets id.'
        players = players.filter((players) => players.id !== socket.id);
        // Update clients
        io.emit('data', players);
    });
});

// Once every 3 seconds console.log the players array.
setInterval(() => {
    console.log(players);
}, 3000);

// serve public folder html
app.use(express.static('public'));

export default server;