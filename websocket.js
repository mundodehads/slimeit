const WebSocket = require('ws');

const PORT = process.env.DEFAULT_WS_PORT || 3000;

const wsServer = new WebSocket.Server({ port: PORT }, () => {
  console.log('server started!');
});


wsServer.on('connection', ws => {
  ws.on('message', data => {
    console.log(`received message: ${data}`);
    ws.send(data);
  });
});

wsServer.on('listening', () => {
  console.log(`listening on *:${PORT}`);
});

