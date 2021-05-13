module.exports = {
  SLIMES_DATA: {
    get default() {
      return {
        race: this.RACES.default,
        experience: 0,
        level: 0
      };
    },
  },
  BIOMES: {
    get default() {
      return this.lounge;
    },
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