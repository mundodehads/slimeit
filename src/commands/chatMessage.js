const chatMessage = async ({ context, ws, message }) => {
  const data = {
    username: context.username,
    showMessage: message,
  };
  ws.write(JSON.stringify({ command: 'chatMessage', data }));
}

export default chatMessage;
