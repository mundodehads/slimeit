# Slime Twitch Game

## About

Slime It! is a slime based game to play wit twitch chat, each chat user can join with a random slime and ~ do something ~ to evolve and reach top of the food chain.

## Chat Ideas

- [X] Seguwuk: Visual represatation of slime can also have a chat balloon
- [X] Seguwuk: each slime has an unique attribute (strenghs/weaks), considering futures battles between slimes
- [ ] LncPedro: when the host gets a raid, show raid members as new slimes on screen!
- [ ] LuckLucky: Balloon should have a maximum amount and fade with time
- [ ] Enigma_Hall: Monster on biomes that slimes can fight!
- [ ] Enigma_Hall: Biomes skin based on streamer slime!
- [ ] LncPedro: Random biomes to straemers integration
- [X] BiancaAzuma: add command exit to leave the screen
- [ ] BiancaAzuma: add nickname to slimes

## Streamer Ideas
- [X] randon evolving based on evolving tree
- [ ] Website to players check their smiles when streamer is offline
- [ ] IA to evolving trees to generate new races
- [ ] Chat balloon skins

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

## TODO

- [X] Study Twitch API to interact with chat commands/messages
- [X] Webwook on node.js
- [X] Define backend architecture
- [X] Define wich database to use
- [X] Create command !join
- [X] Create visual represetation
- [X] Implement some cache
- [X] Seguwuk: Visual represatation of slime can also have a chat baloon
- [X] Draw some slimes
- [X] Add slime on html
- [X] BiancaAzuma: add command exit to leave the screen
- [X] Improve cache & improve commands handler
- [X]  Enable biomes
- [X] Enable evolving