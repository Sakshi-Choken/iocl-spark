const badgeList = [
  {
    name: 'First Steps',
    condition: (user, totalGamesPlayed) => totalGamesPlayed >= 1,
  },
  {
    name: 'Coin Collector',
    condition: (user) => user.coins >= 100,
  },
  {
    name: 'Rising Star',
    condition: (user) => user.coins >= 300,
  },
  {
    name: 'IOCL Champion',
    condition: (user) => user.coins >= 500,
  },
  {
    name: 'Level Up',
    condition: (user) => user.level >= 3,
  },
  {
    name: 'Game Master',
    condition: (user, totalGamesPlayed) => totalGamesPlayed >= 10,
  },
];

module.exports = badgeList;