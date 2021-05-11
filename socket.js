const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/join', (req, res) => {
  io.emit('join', {
    slimeData: req.body.slimeData,
    username: req.body.username,
  });

  res.send('a user has joined');
});

io.on('connection', (socket) => {
  console.log('a connection has been established');
  
  socket.on('disconnect', () => {
    console.log('a connection has been lost');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});