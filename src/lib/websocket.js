import { createServer } from 'net';

const socketList = {};

const checkSocketList = (command = '', socket) => {
  if (!socketList['bot'] && command === 'bot') {
    socketList['bot'] = socket;
  } else if (!socketList['engine'] && command === 'engine') {
    socketList['engine'] = socket;
  }
}

const server = createServer(socket => {
  console.log('Client connect. Client local address : ' + socket.localAddress + ':' + socket.localPort + '. socket remote address : ' + socket.remoteAddress + ':' + socket.remotePort);
  console.log('ws: a client connected');
  socket.on('end', () => {
    console.log('ws: a client disconnected');
  });
  socket.on('error', error => {
    console.log(error);
    console.log('ws: a error happen');
  });

  socket.setEncoding('utf-8');

  socket.on('data', data => {
    console.log(`ws: received: ${data}`);
    try {
      const fixedData = data.slice(data.indexOf('{'), data.lastIndexOf('}') + 1);
      const parsedData = JSON.parse(fixedData);
      checkSocketList(parsedData.command, socket);

      if (parsedData.command === 'join' && socketList['engine']) {
        socketList['engine'].write(data);
      }

    } catch (error) {
      console.log(error.message)
      console.log('ws: I receive an unformated message')
    }
  });
});

server.on('error', error => {
  console.log(error.message);
});

export default server;
