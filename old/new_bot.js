require('dotenv').config();

const tmi = require('tmi.js');
const axios = require('axios').default;

const COMMANDS = {
  '!join': join,
  default: defaultCommand,
};

const SLIMES_CACHE = {};

function defaultCommand() {
  return;
}

async function join({ context, target }) {
  if (SLIMES_CACHE[context.username]) {
    client.say(target, `${context.username}, you already joined the session!`);
    return;
  }

  const slime = await axios.post(`${process.env.WS_BASE_URL || 'http://localhost:3000'}/join` , {
    username: context.username,
  });

  SLIMES_CACHE[context.username] = slime.data;
}

async function onMessageHandler(target, context, message, self) {
  if (self) { return; }

  const messageSplited = message.split(' ');

  try {
    if (messageSplited[0][0] === '!') {
      await (COMMANDS[messageSplited[0]] || COMMANDS.default)({ target, context, message, self, commands: messageSplited });
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
