require('dotenv').config();

// Config
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const Utils = require('./utils');

const SLIMES_CACHE = [];

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));
app.use(express.json());

// Routes

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/join', async (req, res) => {
  const { username } = req.body;

  let slime = await Utils.dynamoGet({
    TableName: 'Slimes',
    Key: { username, accountNumber: 1 },
    AttributesToGet: ['slimeData', 'currentlyPlayingAt'],
    Select: 'SPECIFIC_ATTRIBUTES'
  });

  if (!slime.Item) {
    const slimeData = {
      race: 'normal',
      experience: 0,
      level: 0
    };

    await Utils.dynamoUpdate({
      Key: { username, accountNumber: 1 },
      TableName: 'Slimes',
      ExpressionAttributeValues: {
        ':currentlyPlayingAt': process.env.CHANNEL_NAME,
        ':slimeData': slimeData,
      },
      UpdateExpression: 'set currentlyPlayingAt = :currentlyPlayingAt, slimeData = :slimeData',
    });

    slime = {
      Item: {
        slimeData,
        currentlyPlayingAt: process.env.CHANNEL_NAME,
      }
    };
  }

  if (slime.Item.currentlyPlayingAt !== process.env.CHANNEL_NAME) {
    await Utils.dynamoUpdate({
      Key: { username: context.username, accountNumber: 1 },
      TableName: 'Slimes',
      ExpressionAttributeValues: {
        ':currentlyPlayingAt': process.env.CHANNEL_NAME,
      },
      UpdateExpression: 'set currentlyPlayingAt = :currentlyPlayingAt',
    });

    slime.Item.currentlyPlayingAt = process.env.CHANNEL_NAME;
  }

  slime.Item.username = username;

  io.emit('join', slime.Item);

  SLIMES_CACHE.push(slime.Item);

  res.send('a user has joined');
});

app.post('/chatBalloon', (req, res) => {
  const { username, message } = req.body;
  
  io.emit('chatBalloon', { username, message });

  res.send('a user chat ballon has been created');
});

// Socket

io.on('connection', (socket) => {
  console.log('a connection has been established');

  for(const slime of SLIMES_CACHE) {
    io.emit('join', slime);
  }
  
  socket.on('disconnect', () => {
    console.log('a connection has been lost');
  });
});

// Http Server

server.listen(3000, () => {
  console.log('listening on *:3000');
});