const exit = async ({ client, context, target, cache, ws }) => {
  if (!cache.checkKey(context.username)) {
    client.say(target, `${context.username}, for one to quit they must first join!`);
    return;
  }

  ws.write(JSON.stringify({ command: 'exit', data: { username: context.username } }));
  cache.pop(context.username);
}

export default exit;
