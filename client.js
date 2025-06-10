
const socket = io();
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let players = {};
let myId = null;
let speed = 3;
let x = Math.random() * 600 + 100;
let y = Math.random() * 400 + 100;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let id in players) {
        const p = players[id];
        ctx.fillStyle = p.isKiller ? 'red' : p.color;
        ctx.fillRect(p.x, p.y, 30, 30);
        ctx.fillStyle = 'white';
        ctx.fillText(id === myId ? 'YOU' : (p.isKiller ? 'KILLER' : 'PLAYER'), p.x, p.y - 5);
    }
    requestAnimationFrame(draw);
}

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' || e.key === 'w') y -= speed;
    if (e.key === 'ArrowDown' || e.key === 's') y += speed;
    if (e.key === 'ArrowLeft' || e.key === 'a') x -= speed;
    if (e.key === 'ArrowRight' || e.key === 'd') x += speed;
    socket.emit('move', { x, y });
});

socket.on('connect', () => {
    myId = socket.id;
});

socket.on('updatePlayers', data => {
    players = data;
});

draw();
