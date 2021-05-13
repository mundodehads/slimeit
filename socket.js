require('dotenv').config();

// Config
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const Utils = require('./utils');
const Constants = require('./constants');
const EvolvingTree = require('./evolving_tree');

const SLIMES_CACHE = {};

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));
app.use(express.json());

function initSync() {
  setInterval(async () => {
    console.log('Syncing data...');
    const promises = [];


    for (const slime of Object.keys(SLIMES_CACHE)) {
      promises.push(Utils.dynamoUpdate({
        Key: { username: slime, accountNumber: 1 },
        TableName: 'Slimes',
        ExpressionAttributeValues: {
          ':slimeData': SLIMES_CACHE[slime].slimeData,
        },
        UpdateExpression: 'set slimeData = :slimeData',
      }));
    }

    Promise.all(promises);
  }, 60000);
}

function checkEvolve(username) {
  if (EvolvingTree[SLIMES_CACHE[username].slimeData.race]) {
    const evolveTo = [];
    for (const newRace of Object.keys(EvolvingTree[SLIMES_CACHE[username].slimeData.race])) {
      if (SLIMES_CACHE[username].slimeData.nutrients[newRace]) {
        if (SLIMES_CACHE[username].slimeData.nutrients[newRace] > EvolvingTree[SLIMES_CACHE[username].slimeData.race][newRace]) {
          evolveTo.push(newRace);
        }
      }
    }

    if (evolveTo.length) {
      const evolveToNewRace = evolveTo[Utils.randomNumber(0, evolveTo.length - 1)];
      
      io.emit('evolve', { username, race: evolveToNewRace });

      SLIMES_CACHE[username].slimeData.race = evolveToNewRace;
    }
  }
}

function initExp(username, biome) {
  SLIMES_CACHE[username].expInterval = setInterval(() => {
    SLIMES_CACHE[username].slimeData.experience += Constants.EXP_TIMER * Constants.MULTIPLIER[biome].expMultiplier;
    
    for (const nutrient of Constants.NUTRIENTS[biome]) {
      if (!SLIMES_CACHE[username].slimeData.nutrients[nutrient]) {
        SLIMES_CACHE[username].slimeData.nutrients[nutrient] = 0;
      }

      SLIMES_CACHE[username].slimeData.nutrients[nutrient] += Utils.randomNumber(Constants.EXP_TIMER / 2, Constants.EXP_TIMER);
    }

    if (Constants.NUTRIENTS[biome].length) {
      checkEvolve(username);
    }
  }, Constants.EXP_TIMER * 1000);
}

// Routes

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

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

  io.emit('join', slime.Item);

  SLIMES_CACHE[username] = slime.Item;
  
  res.send(JSON.stringify(slime.Item));

  initExp(slime.Item.username, slime.Item.biome);
});

app.post('/exit', async (req, res) => {
  const { username } = req.body;

  io.emit('exit', { username });

  clearInterval(SLIMES_CACHE[username].expInterval);
  delete SLIMES_CACHE[username];

  res.send('a user has leave');
});

app.post('/travel', async (req, res) => {
  const { username, biome } = req.body;

  io.emit('travel', { username, biome });

  SLIMES_CACHE[username].biome = biome;
  clearInterval(SLIMES_CACHE[username].expInterval);

  res.send('a user has travel to a different biome');

  initExp(username, biome);
});

app.post('/stats', async (req, res) => {
  const { username } = req.body;

  res.send(JSON.stringify(SLIMES_CACHE[username].slimeData));
});

app.post('/chatBalloon', (req, res) => {
  const { username, message } = req.body;
  
  io.emit('chatBalloon', { username, message });

  res.send('a user chat ballon has been created');
});

// Socket

io.on('connection', (socket) => {
  console.log('a connection has been established');

  for(const slime of Object.keys(SLIMES_CACHE)) {
    io.emit('join', SLIMES_CACHE[slime]);
  }
  
  socket.on('disconnect', () => {
    console.log('a connection has been lost');
  });
});

// Http Server

server.listen(3000, () => {
  console.log('listening on *:3000');
});

initSync();