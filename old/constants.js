module.exports = {
  EXP_TIMER: 10, // segundos
  SLIMES_DATA: {
    get default() {
      return {
        race: 'normal',
        experience: 0,
        nutrients: {},
      };
    },
  },
  MULTIPLIER: {
    lounge: {
      expMultiplier: 1,
    },
    forest: {
      expMultiplier: 1.1,
    },
  },
  NUTRIENTS: {
    lounge: [],
    forest: ['grass', 'earth'],
  },
  BIOMES: {
    get default() {
      return this.lounge;
    },
    available: ['lounge', 'forest'],
    lounge: 'lounge',
    forest: 'forest',
  },
  RACES: {
    get default() {
      return this.normal;
    },
    normal: 'normal',
    grass: 'grass',
    earth: 'earth',
  },
  ACCOUNT_NUMBERS: {
    get default() {
      return this.first;
    },
    first: 1,
    second: 2,
    third: 3,
  }
};