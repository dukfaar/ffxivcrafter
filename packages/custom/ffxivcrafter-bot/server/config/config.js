'use strict'

module.exports = {
  bot: {
    game: {
      allowSelfRaiding: true,
      units: {
        zombies: {
          cost: 0,
          killProbabilities: {
            zombies: 0.1
          }
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
