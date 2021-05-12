const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const SLIMES_CACHE = [];

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/join', (req, res) => {
  const slime = {
    slimeData: req.body.slimeData,
    username: req.body.username,
  };

  io.emit('join', slime);
  SLIMES_CACHE.push(slime);

  res.send('a user has joined');
});

app.post('/chatBalloon', (req, res) => {
  io.emit('chatBalloon', {
    username: req.body.username,
    message: req.body.message,
  });

  res.send('a user chat ballon has been created');
});

io.on('connection', (socket) => {
  console.log('a connection has been established');

  for(const slime of SLIMES_CACHE) {
    io.emit('join', slime);
  }
  
  socket.on('disconnect', () => {
    console.log('a connection has been lost');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});