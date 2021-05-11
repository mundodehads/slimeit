require('dotenv').config();

const tmi = require('tmi.js');
const axios = require('axios').default;
const Utils = require('./utils');

const SLIMES_CACHE = {};

function defaultCommand() {
  return;
}

function generateSlimeData() {
  return {
    race: 'normal',
    experience: 0,
    level: 0
  };
}

async function join({ context, client, target }) {
  if (SLIMES_CACHE[context.username]) {
    client.say(target, `${context.username}, you already joined the session!`);
    return;
  }

  let slime = await Utils.dynamoGet({
    TableName: 'Slimes',
    Key: { username: context.username, accountNumber: 1 },
    AttributesToGet: ['slimeData', 'currentlyPlayingAt'],
    Select: 'SPECIFIC_ATTRIBUTES'
  });

  if (!slime.Item) {
    const slimeData = generateSlimeData();

    await Utils.dynamoUpdate({
      Key: { username: context.username, accountNumber: 1 },
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

  await axios.post('http://localhost:3000/join', {
    slimeData: slime.slimeData,
    username: context.username,
  });

  SLIMES_CACHE[context.username] = true;
}

const COMMANDS = {
  '!join': join,
  default: defaultCommand,
};

async function onMessageHandler(target, context, msg, self) {
  if (self) { return; }

  const commandName = msg.trim();

  try {
    await (COMMANDS[commandName] || COMMANDS.default)({ client, target, context, msg, self });
  } catch (error) {
    console.log(error);
  }

  return;
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