
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

let players = {};
let killerId = null;

app.use(express.static(__dirname + '/public'));

io.on('connection', socket => {
    console.log('New player connected:', socket.id);
    players[socket.id] = {
        id: socket.id,
        x: Math.random() * 600 + 100,
        y: Math.random() * 400 + 100,
        color: 'white',
        isKiller: false
    };

    if (!killerId) {
        killerId = socket.id;
        players[socket.id].isKiller = true;
    }

    io.emit('updatePlayers', players);

    socket.on('move', data => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            io.emit('updatePlayers', players);
        }
    });

    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
        delete players[socket.id];
        if (socket.id === killerId) {
            const ids = Object.keys(players);
            if (ids.length > 0) {
                killerId = ids[0];
                players[killerId].isKiller = true;
            } else {
                killerId = null;
            }
        }
        io.emit('updatePlayers', players);
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
