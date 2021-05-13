require('dotenv').config();

const tmi = require('tmi.js');
const axios = require('axios').default;
const Constants = require('./constants');

const COMMANDS = {
  '!join': join,
  '!exit': exit, 
  '!travel': travel,
  '!where': where,
  '!stats': stats,
  default: defaultCommand,
};

const SLIMES_CACHE = {};

function defaultCommand({ context, target, commands }) {
  client.say(target, `${context.username}, this command (${commands[0]}) has not yet been implemented!`);
  return;
}

async function join({ context, target }) {
  if (SLIMES_CACHE[context.username]) {
    client.say(target, `${context.username}, you already joined the session!`);
    return;
  }

  const slime = await axios.post('http://localhost:3000/join', {
    username: context.username,
  });

  SLIMES_CACHE[context.username] = slime.data;
}

async function exit({ context, target }) {
  if (!SLIMES_CACHE[context.username]) {
    client.say(target, `${context.username}, to leave you have to join first!`);
    return;
  }

  await axios.post('http://localhost:3000/exit', {
    username: context.username,
  });

  delete SLIMES_CACHE[context.username];
}

async function travel({ context, target, commands }) {
  if (!SLIMES_CACHE[context.username]) {
    client.say(target, `${context.username}, to travel you have to join first!`);
    return;
  }

  if (!commands[1]) {
    client.say(target, `${context.username}, type a biome to travel to, example: !travel forest`);
    return;
  }

  if(!Constants.BIOMES.available.find(biome => biome === commands[1])) {
    client.say(target, `${context.username}, this location (${commands[1]}) is not available to travel!`);
    return;
  }

  if(SLIMES_CACHE[context.username].biome === commands[1]) {
    client.say(target, `${context.username}, you are already in this (${SLIMES_CACHE[context.username].biome}) biome!`);
    return;
  }

  await axios.post('http://localhost:3000/travel', {
    username: context.username,
    biome: commands[1],
  });

  SLIMES_CACHE[context.username].biome = commands[1];
}

function where({ context, target }) {
  if (!SLIMES_CACHE[context.username]) {
    client.say(target, `${context.username}, to find where you are you have to join first!`);
    return;
  }

  client.say(target, `${context.username}, you are at ${SLIMES_CACHE[context.username].biome} biome!`);
}

function stats({ context, target }) {
  if (!SLIMES_CACHE[context.username]) {
    client.say(target, `${context.username}, to check your stats you have to join first!`);
    return;
  }

  const slime = await axios.post('http://localhost:3000/stats', {
    username: context.username,
  });

  client.say(target, `${context.username}, your stats are: ${JSON.stringify(slime.data)}`);
}

async function chatBalloon({ context, message }) {
  await axios.post('http://localhost:3000/chatBalloon', {
    username: context.username,
    message: message,
  });
}

async function onMessageHandler(target, context, message, self) {
  if (self) { return; }

  const messageSplited = message.split(' ');
  
  try {
    if (messageSplited[0][0] === '!') {
      await (COMMANDS[messageSplited[0]] || COMMANDS.default)({ target, context, message, self, commands: messageSplited });
      return;
    }

    if (SLIMES_CACHE[context.username]) {
      await chatBalloon({ context, message });
      return;
    }
  } catch (error) {
    console.log(error);
    return;
  }
}

function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

const client = new tmi.client({
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN,
  },
  channels: [
    process.env.CHANNEL_NAME,
  ]
});

client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

client.connect();
