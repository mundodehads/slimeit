require('dotenv').config();

// Config
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const Utils = require('./utils');
const Constants = require('./constants');

const PORT = parseInt(process.env.WS_PORT, 10) || 3000;
const SLIMES_CACHE = {};
let WS = {};

const app = express();
const server = http.createServer(app);
const wsServer = new WebSocket.Server({ server });

app.use(express.json());

// Routes

app.post('/join', async (req, res) => {
  const { username } = req.body;

  let slime = await Utils.dynamoGet({
    TableName: 'Slimes',
    Key: { username, accountNumber: Constants.ACCOUNT_NUMBERS.default },
    AttributesToGet: ['slimeData', 'currentlyPlayingAt'],
    Select: 'SPECIFIC_ATTRIBUTES'
  });

  if (!slime.Item) {
    await Utils.dynamoUpdate({
      Key: { username, accountNumber: 1 },
      TableName: 'Slimes',
      ExpressionAttributeValues: {
        ':currentlyPlayingAt': process.env.CHANNEL_NAME,
        ':slimeData': Constants.SLIMES_DATA.default,
      },
      UpdateExpression: 'set currentlyPlayingAt = :currentlyPlayingAt, slimeData = :slimeData',
    });

    slime = {
      Item: {
        slimeData: Constants.SLIMES_DATA.default,
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
  slime.Item.biome = Constants.BIOMES.default;

  WS.send(JSON.stringify({
    command: 'join',
    data: JSON.stringify(slime.Item),
  }));

  SLIMES_CACHE[username] = slime.Item;

  res.send(JSON.stringify(slime.Item));
});

// Socket

wsServer.on('connection', (ws) => {
  console.log('a connection has been established');

  for(const slime of Object.keys(SLIMES_CACHE)) {
    ws.send(JSON.stringify({
      command: 'join',
      data: JSON.stringify(SLIMES_CACHE[slime]),
    }));
  }

  WS = ws;
});

// Http Server

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
