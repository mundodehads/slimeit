const join = async (client, { context, target, cache, ws }) => {
  if (cache.checkKey(context.username)) {
    client.say(target, `${context.username}, you already joined the session!`);
    return;
  }

  const data = { username: context.username }
  ws.write(JSON.stringify({ command: 'join', data }));

  cache.push(context.username, data);
}

export default join;
