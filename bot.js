import 'dotenv/config';

import client from './src/lib/twitchChatBot';

(() => {
  try {
    client.connect();
  } catch (error) {
    console.log(error.message);
  }
})();
