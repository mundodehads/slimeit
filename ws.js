import 'dotenv/config';

import server from './src/lib/websocket';

(() => {
  try {
    const port = parseInt(process.env.WS_PORT, 10) || 3000;
    server.listen(port, '127.0.0.1');
    console.log(`WS server listening on *:${port}`);
  } catch (error) {
    console.log(error.message);
  }
})();
