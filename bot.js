require('dotenv').config();

const tmi = require('tmi.js');
const axios = require('axios').default;

const COMMANDS = {
  '!join': join,
  '!exit': exit, 
  default: defaultCommand,
};

const SLIMES_CACHE = {};

function defaultCommand() {
  return;
}

async function join({ context, client, target }) {
  if (SLIMES_CACHE[context.username]) {
    client.say(target, `${context.username}, you already joined the session!`);
    return;
  }

  await axios.post('http://localhost:3000/join', {
    username: context.username,
  });

  SLIMES_CACHE[context.username] = true;
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
      await (COMMANDS[messageSplited[0]] || COMMANDS.default)({ client, target, context, message, self });
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
