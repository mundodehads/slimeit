# Slime Twitch Game

## About

Slime It! is a slime based game to play wit twitch chat, each chat user can join with a random slime and ~ do something ~ to evolve and reach top of the food chain.

## TODO 11/05/21

- [X] Study Twitch API to interact with chat commands/messages
- [X] Webwook on node.js
- [X] Define backend architecture
- [X] Define wich database to use
- [X] Create command !join
- [X] Create visual represetation
- [X] Implement some cache

## Chat Ideas

- [ ] Seguwuk: Visual represatation of slime can also have a chat baloon
- [ ] Seguwuk: each slime has an unique attribute (strenghs/weaks), considering futures battles between slimes
- [ ] LncPedro: when the host gets a raid, show raid members as new slimes on screen!

## Streamer Ideas
- [ ] Chat baloon skins
- [ ] randon evolving based on evolving tree
- [ ] IA to evolving trees to generate new races

## Database Scheme

### Slimes

```js
const slime = {
    username: 'matheusmazeto', // index,
    accountNumber: 1 // secondary-index
    currentlyPlayingAt: 'mundodehads' // foreign-key world index,
    slimeData: {
        experience: 0,
        level: 0,
        race: 'normal', // foreign-key race index,
    },
};
```

### Worlds

```js
const world = {
    name: 'mundodehads', // index,
};
```

### Races

```js
const race = {
    name: 'mud', // index,
};
```