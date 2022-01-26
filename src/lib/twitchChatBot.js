import tmi from 'tmi.js';
import { Socket } from 'net';
import { join, defaultCommand } from '../commands';
import { LocalCache } from '../utils';

const SLIMES_CACHE = new LocalCache();

const COMMANDS = {
  '!join': join,
  default: defaultCommand,
};

var ws = new Socket();
const port = parseInt(process.env.WS_PORT, 10) || 3000;
ws.connect(port, '127.0.0.1', () => {
	console.log('bot: connected with success');
  ws.write(JSON.stringify({ command: 'bot' }));
});

ws.on('data', (data) => {
	console.log(`bot: received: ${data}`);
});

const onMessageHandler = async (target, context, message, self) => {
  if (self) { return; }

  const messageSplited = message.split(' ');

  try {
    if (messageSplited[0][0] === '!') {
      await (COMMANDS[messageSplited[0]] || COMMANDS.default)(client, { target, context, message, self, commands: messageSplited, cache: SLIMES_CACHE, ws });
      return;
    }
  } catch (error) {
    console.log(error);
    return;
  }
};

const onConnectedHandler = (addr, port) => {
  console.log(`* Connected to ${addr}:${port}`);
};

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

export default client;
