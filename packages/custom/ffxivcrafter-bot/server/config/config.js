'use strict'

module.exports = {
  bot: {
    game: {
      allowSelfRaiding: true,
      potatofarm: {
        goldPerSecond: 0.00028
      },
      units: {
        zombies: {
          cost: 5,
          killProbabilities: {
            zombies: 0.1
          },
          stealAmount: 0.1
        }
      },
      buildings: {
        farm: {
          goldPerTick: 1
        }
      }
    }
  }
}
