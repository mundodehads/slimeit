const showme = async ({ context, cache, ws }) => {
  if (cache.checkKey(context.username)) {
    const data = { username: context.username }
    ws.write(JSON.stringify({ command: 'showme', data }));
  }
}

export default showme;
