'use strict'

describe('functions of the projectAnalyzerService', function () {
  beforeEach(module('mean.ffxivCrafter'))

  var $scope = null
  var $projectAnalyzerService = null

  beforeEach(inject(function ($rootScope, projectAnalyzerService) {
    $scope = $rootScope.$new()
    $projectAnalyzerService = projectAnalyzerService
  }))

  function i (id, name, price, priceHQ) {
    return {
      _id: id,
      name: name,
      price: price,
      priceHQ: priceHQ
    }
  }

  function s (st, i, a, hq, inputs, r) {
    return {
      step: st,
      item: i,
      amount: a,
      hq: hq,
      inputs: inputs,
      recipe: r
    }
  }

  function g (i, a, hq) { return s('Gather', i, a, hq) }
  function b (i, a, hq) { return s('Buy', i, a, hq) }
  function c (i, a, hq, inputs, recipe) { return s('Craft', i, a, hq, inputs, recipe) }

  var ironOreItem = i('ironOreItem', 'Iron Ore', 18, 148)
  var ironIngotItem = i('ironIngotItem', 'Iron Ingot', 68, 648)
  var iceShardItem = i('iceShardItem', 'Ice Shard', 100, 0)

  var ironOreNQGatheringStep = g(ironOreItem, 6, false)
  var ironOreHQGatheringStep = g(ironOreItem, 6, true)
  var iceShardBuyStep = b(iceShardItem, 2, false)

  var ironIngotRecipe = {
    inputs: [{item: 'ironOreItem', amount: 3}, {item: 'iceShardItem', amount: 1}],
    outputs: [{item: 'ironIngotItem', amount: 1}]
  }

  var ironIngotNQCraftingStep = c(ironIngotItem, 2, false, [ironOreNQGatheringStep, iceShardBuyStep], ironIngotRecipe)

  var project1 = {
    tree: ironIngotNQCraftingStep,
    stock: []
  }

  it('should exist', function () {
    expect($projectAnalyzerService).toBeDefined()
  })

  it('returns the price of an item of a non-meta step', function () {
    expect($projectAnalyzerService.itemPrice(ironOreNQGatheringStep)).toBe(18)
    expect($projectAnalyzerService.itemPrice(ironOreHQGatheringStep)).toBe(148)
  })

  it('returns the price of a non-meta step', function () {
    expect($projectAnalyzerService.stepPrice(ironOreNQGatheringStep)).toBe(18 * 6)
    expect($projectAnalyzerService.stepPrice(ironOreHQGatheringStep)).toBe(148 * 6)
  })

  it('calculates the required gathering and crafting of a project', function (done) {
    $projectAnalyzerService.getProjectMaterialList(project1).then(function (result) {
      expect(result.revenue).toBe(68 * 2)
      expect(result.profit).toBe(68 * 2 * 0.95 - 2 * 100)
      expect(result.relativeProfit).toBe(((68 * 2 * 0.95 - 2 * 100) / (2 * 100)) * 100)

      expect(result.gatherList['ironOreItemNQ']).toBeDefined()
      expect(result.gatherList['ironOreItemNQ'].outstanding).toBe(6)

      done()
    })

    $scope.$digest()
  })

  var project2 = {
    tree: ironIngotNQCraftingStep,
    stock: [{amount: 4, hq: false, item: ironOreItem}]
  }

  it('calculates the required gathering and crafting of a project with items in stock', function (done) {
    $projectAnalyzerService.getProjectMaterialList(project2).then(function (result) {
      expect(result.revenue).toBe(68 * 2)
      expect(result.profit).toBe(68 * 2 * 0.95 - 2 * 100)
      expect(result.relativeProfit).toBe(((68 * 2 * 0.95 - 2 * 100) / (2 * 100)) * 100)

      expect(result.gatherList['ironOreItemNQ']).toBeDefined()
      expect(result.gatherList['ironOreItemNQ'].outstanding).toBe(2)

      done()
    })

    $scope.$digest()
  })

  var cedarLumberStep = {
    '_id': '586c206f25fb900f3f6883f9',
    'amount': 75,
    'recipe': {
      '_id': '57dd337c29bed45d2804a416',
      'craftingLevel': 51,
      'craftingJob': 'Carpenter',
      'outputs': [
        {
          'item': '57dd300eec158f5b6b75b42b',
          '_id': '57dd337c29bed45d2804a417',
          'amount': 1
        }
      ],
      'inputs': [
        {
          'item': '57dd300eec158f5b6b75b42c',
          '_id': '57dd337c29bed45d2804a419',
          'amount': 5
        },
        {
          'item': '57dd337c29bed45d2804a418',
          '_id': '57dd337d29bed45d2804a41a',
          'amount': 3
        }
      ],
      '__v': 0
    },
    'step': 'Craft',
    'item': {
      '_id': '57dd300eec158f5b6b75b42b',
      'name': 'Cedar Lumber',
      'discount': 0,
      'inStock': 0,
      'soldOnMarket': false,
      'canBeOrderedByUnprivileged': false,
      'gatheringLevel': 0,
      'gatheringJob': 'None',
      'gatheringEffort': 0,
      'priceHQ': 3500,
      'price': 2500,
      '__v': 0,
      'lastPriceUpdate': '2016-10-19T20:01:57.307Z',
      'ageMultiplier': 10.55,
      'unspoiledNodeTime': {
        'duration': 60
      }
    },
    'inputs': [
      {
        '_id': '586c206f25fb900f3f688417',
        'amount': 375,
        'step': 'Gather',
        'item': {
          '_id': '57dd300eec158f5b6b75b42c',
          'name': 'Cedar Log',
          'discount': 0,
          'inStock': 0,
          'soldOnMarket': false,
          'canBeOrderedByUnprivileged': false,
          'gatheringLevel': 50,
          'gatheringJob': 'Botanist',
          'gatheringEffort': 2,
          'priceHQ': 1104,
          'price': 350,
          '__v': 0,
          'lastPriceUpdate': '2016-10-19T20:02:12.696Z',
          'ageMultiplier': 43.2,
          'datedObject': false,
          'availableFromNpc': false,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [

        ],
        'hq': false,
        '__v': 0
      },
      {
        '_id': '586c206f25fb900f3f688418',
        'amount': 225,
        'step': 'Gather',
        'item': {
          '_id': '57dd337c29bed45d2804a418',
          'name': 'Wind Crystal',
          'discount': 0,
          'inStock': 0,
          'soldOnMarket': false,
          'canBeOrderedByUnprivileged': false,
          'gatheringLevel': 30,
          'gatheringJob': 'None',
          'gatheringEffort': -27,
          'priceHQ': 0,
          'price': 249,
          '__v': 0,
          'lastPriceUpdate': '2017-01-01T17:01:07.089Z',
          'ageMultiplier': 144.17,
          'datedObject': false,
          'availableFromNpc': false,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [

        ],
        'hq': false,
        '__v': 0
      }
    ],
    'hq': false,
    '__v': 0
  }

  var holyCedarLumberStep = {
    '_id': '586c206f25fb900f3f6883fc',
    'amount': 150,
    'recipe': {
      '_id': '57dd344b29bed45d2804a487',
      'craftingLevel': 52,
      'craftingJob': 'Carpenter',
      'outputs': [
        {
          'item': '57dd3069ec158f5b6b75b432',
          '_id': '57dd344b29bed45d2804a488',
          'amount': 1
        }
      ],
      'inputs': [
        {
          'item': '57dd337c29bed45d2804a418',
          '_id': '57dd344b29bed45d2804a489',
          'amount': 3
        },
        {
          'item': '57dd300eec158f5b6b75b42b',
          '_id': '57dd344b29bed45d2804a48a',
          'amount': 1
        },
        {
          'item': '57dd344b29bed45d2804a48b',
          '_id': '57dd344c29bed45d2804a48c',
          'amount': 2
        }
      ],
      '__v': 0
    },
    'step': 'Craft',
    'item': {
      '_id': '57dd3069ec158f5b6b75b432',
      'name': 'Holy Cedar Lumber',
      'discount': 0,
      'inStock': 0,
      'soldOnMarket': false,
      'canBeOrderedByUnprivileged': false,
      'gatheringLevel': 0,
      'gatheringJob': 'None',
      'gatheringEffort': 0,
      'priceHQ': 39000,
      'price': 34038,
      '__v': 0,
      'lastPriceUpdate': '2016-09-28T18:41:44.738Z',
      'ageMultiplier': 7.55,
      'unspoiledNodeTime': {
        'duration': 60
      }
    },
    'inputs': [
      {
        '_id': '586c206f25fb900f3f688426',
        'amount': 450,
        'step': 'Gather',
        'item': {
          '_id': '57dd337c29bed45d2804a418',
          'name': 'Wind Crystal',
          'discount': 0,
          'inStock': 0,
          'soldOnMarket': false,
          'canBeOrderedByUnprivileged': false,
          'gatheringLevel': 30,
          'gatheringJob': 'None',
          'gatheringEffort': -27,
          'priceHQ': 0,
          'price': 249,
          '__v': 0,
          'lastPriceUpdate': '2017-01-01T17:01:07.089Z',
          'ageMultiplier': 144.17,
          'datedObject': false,
          'availableFromNpc': false,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [

        ],
        'hq': false,
        '__v': 0
      },
      {
        '_id': '586c206f25fb900f3f688428',
        'amount': 300,
        'recipe': {
          '_id': '57dd41a70febcb5d9dde9793',
          'craftingLevel': 52,
          'craftingJob': 'Alchemist',
          'outputs': [
            {
              'item': '57dd344b29bed45d2804a48b',
              '_id': '57dd41a70febcb5d9dde9794',
              'amount': 1
            }
          ],
          'inputs': [
            {
              'item': '57dd3c5f0febcb5d9dde9765',
              '_id': '57dd41a70febcb5d9dde9795',
              'amount': 3
            },
            {
              'item': '57dd41a70febcb5d9dde9797',
              '_id': '57dd41a80febcb5d9dde9798',
              'amount': 2
            },
            {
              'item': '57dd41a70febcb5d9dde9796',
              '_id': '57dd41a90febcb5d9dde9799',
              'amount': 2
            }
          ],
          '__v': 0
        },
        'step': 'Craft',
        'item': {
          '_id': '57dd344b29bed45d2804a48b',
          'name': 'Holy Water',
          'discount': 0,
          'inStock': 0,
          'soldOnMarket': false,
          'canBeOrderedByUnprivileged': false,
          'gatheringLevel': 0,
          'gatheringJob': 'None',
          'gatheringEffort': 0,
          'priceHQ': 8750,
          'price': 8750,
          '__v': 0,
          'lastPriceUpdate': '2016-11-06T21:05:14.770Z',
          'ageMultiplier': 13.24,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [
          {
            '_id': '586c206f25fb900f3f68845a',
            'amount': 600,
            'step': 'Gather',
            'item': {
              '_id': '57dd41a70febcb5d9dde9797',
              'name': 'Dravanian Mistletoe',
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 54,
              'gatheringJob': 'Botanist',
              'gatheringEffort': 1,
              'priceHQ': 4675,
              'price': 1893,
              '__v': 0,
              'lastPriceUpdate': '2017-01-02T23:12:16.425Z',
              'ageMultiplier': 25.08,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f688459',
            'amount': 900,
            'step': 'Gather',
            'item': {
              '_id': '57dd3c5f0febcb5d9dde9765',
              'name': 'Water Crystal',
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 30,
              'gatheringJob': 'None',
              'gatheringEffort': -27,
              'priceHQ': 0,
              'price': 150,
              '__v': 0,
              'lastPriceUpdate': '2017-01-01T17:01:41.357Z',
              'ageMultiplier': 110.12,
              'datedObject': false,
              'availableFromNpc': false,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f68845b',
            'amount': 600,
            'step': 'Gather',
            'item': {
              '_id': '57dd41a70febcb5d9dde9796',
              'name': 'Dravanian Spring Water',
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 54,
              'gatheringJob': 'Miner',
              'gatheringEffort': 1,
              'priceHQ': 7000,
              'price': 2805,
              '__v': 0,
              'lastPriceUpdate': '2016-11-12T20:53:30.743Z',
              'ageMultiplier': 25.08,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          }
        ],
        'hq': false,
        '__v': 0
      },
      {
        '_id': '586c206f25fb900f3f688427',
        'amount': 150,
        'recipe': {
          '_id': '57dd337c29bed45d2804a416',
          'craftingLevel': 51,
          'craftingJob': 'Carpenter',
          'outputs': [
            {
              'item': '57dd300eec158f5b6b75b42b',
              '_id': '57dd337c29bed45d2804a417',
              'amount': 1
            }
          ],
          'inputs': [
            {
              'item': '57dd300eec158f5b6b75b42c',
              '_id': '57dd337c29bed45d2804a419',
              'amount': 5
            },
            {
              'item': '57dd337c29bed45d2804a418',
              '_id': '57dd337d29bed45d2804a41a',
              'amount': 3
            }
          ],
          '__v': 0
        },
        'step': 'Craft',
        'item': {
          '_id': '57dd300eec158f5b6b75b42b',
          'name': 'Cedar Lumber',
          'discount': 0,
          'inStock': 0,
          'soldOnMarket': false,
          'canBeOrderedByUnprivileged': false,
          'gatheringLevel': 0,
          'gatheringJob': 'None',
          'gatheringEffort': 0,
          'priceHQ': 3500,
          'price': 2500,
          '__v': 0,
          'lastPriceUpdate': '2016-10-19T20:01:57.307Z',
          'ageMultiplier': 10.55,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [
          {
            '_id': '586c206f25fb900f3f688457',
            'amount': 750,
            'step': 'Gather',
            'item': {
              '_id': '57dd300eec158f5b6b75b42c',
              'name': 'Cedar Log',
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 50,
              'gatheringJob': 'Botanist',
              'gatheringEffort': 2,
              'priceHQ': 1104,
              'price': 350,
              '__v': 0,
              'lastPriceUpdate': '2016-10-19T20:02:12.696Z',
              'ageMultiplier': 43.2,
              'datedObject': false,
              'availableFromNpc': false,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f688458',
            'amount': 450,
            'step': 'Gather',
            'item': {
              '_id': '57dd337c29bed45d2804a418',
              'name': 'Wind Crystal',
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 30,
              'gatheringJob': 'None',
              'gatheringEffort': -27,
              'priceHQ': 0,
              'price': 249,
              '__v': 0,
              'lastPriceUpdate': '2017-01-01T17:01:07.089Z',
              'ageMultiplier': 144.17,
              'datedObject': false,
              'availableFromNpc': false,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          }
        ],
        'hq': false,
        '__v': 0
      }
    ],
    'hq': false,
    '__v': 0
  }

  var cassiaBlockStep = {
    '_id': '586c206f25fb900f3f6883f5',
    'amount': 36,
    'recipe': {
      '_id': '57dd38e50febcb5d9dde9720',
      'craftingLevel': 60,
      'craftingJob': 'Carpenter',
      'outputs': [
        {
          'item': '57dd3165ec158f5b6b75b43c',
          '_id': '57dd38e50febcb5d9dde9721',
          'amount': 1
        }
      ],
      'inputs': [
        {
          'item': '57cfbd439567fb328521568f',
          '_id': '57dd38e50febcb5d9dde9726',
          'amount': 2
        },
        {
          'item': '57dd38e50febcb5d9dde9722',
          '_id': '57dd38e60febcb5d9dde9727',
          'amount': 1
        },
        {
          'item': '57dd38e50febcb5d9dde9725',
          '_id': '57dd38e60febcb5d9dde9728',
          'amount': 1
        },
        {
          'item': '57dd38e50febcb5d9dde9724',
          '_id': '57dd38e60febcb5d9dde9729',
          'amount': 1
        },
        {
          'item': '57dd38e50febcb5d9dde9723',
          '_id': '57dd38e70febcb5d9dde972a',
          'amount': 1
        }
      ],
      '__v': 0
    },
    'step': 'Craft',
    'item': {
      '_id': '57dd3165ec158f5b6b75b43c',
      'name': 'Cassia Block',
      'discount': 0,
      'inStock': 0,
      'soldOnMarket': false,
      'canBeOrderedByUnprivileged': false,
      'gatheringLevel': 0,
      'gatheringJob': 'None',
      'gatheringEffort': 0,
      'priceHQ': 0,
      'price': 200000,
      '__v': 0,
      'lastPriceUpdate': '2016-09-26T08:06:48.237Z',
      'ageMultiplier': 4.15,
      'unspoiledNodeTime': {
        'duration': 60
      }
    },
    'inputs': [
      {
        '_id': '586c206f25fb900f3f688419',
        'amount': 72,
        'step': 'Gather',
        'item': {
          '_id': '57cfbd439567fb328521568f',
          'name': 'Wind Cluster',
          'gatheringLevel': 50,
          'gatheringJob': 'None',
          'gatheringEffort': -45,
          'priceHQ': 0,
          'price': 1500,
          '__v': 0,
          'canBeOrderedByUnprivileged': false,
          'lastPriceUpdate': '2017-01-01T17:04:26.325Z',
          'ageMultiplier': 19.63,
          'soldOnMarket': false,
          'inStock': 0,
          'discount': 0,
          'datedObject': false,
          'availableFromNpc': false,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [

        ],
        'hq': false,
        '__v': 0
      },
      {
        '_id': '586c206f25fb900f3f68841a',
        'amount': 36,
        'step': 'Gather',
        'item': {
          '_id': '57dd38e50febcb5d9dde9722',
          'name': 'Ice Cluster',
          'discount': 0,
          'inStock': 0,
          'soldOnMarket': false,
          'canBeOrderedByUnprivileged': false,
          'gatheringLevel': 50,
          'gatheringJob': 'None',
          'gatheringEffort': -45,
          'priceHQ': 0,
          'price': 500,
          '__v': 0,
          'lastPriceUpdate': '2017-01-01T17:04:54.186Z',
          'ageMultiplier': 9.93,
          'datedObject': false,
          'availableFromNpc': false,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [

        ],
        'hq': false,
        '__v': 0
      },
      {
        '_id': '586c206f25fb900f3f68841d',
        'amount': 36,
        'step': 'Gather',
        'item': {
          '_id': '57dd38e50febcb5d9dde9723',
          'name': 'Dawnborne Aethersand',
          'discount': 0,
          'inStock': 0,
          'soldOnMarket': false,
          'canBeOrderedByUnprivileged': false,
          'gatheringLevel': 0,
          'gatheringJob': 'None',
          'gatheringEffort': 100,
          'priceHQ': 54000,
          'price': 25000,
          '__v': 0,
          'lastPriceUpdate': '2016-10-02T11:38:41.453Z',
          'ageMultiplier': 4.57,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [

        ],
        'hq': false,
        '__v': 0
      },
      {
        '_id': '586c206f25fb900f3f68841c',
        'amount': 36,
        'recipe': {
          '_id': '57dd422c0febcb5d9dde979a',
          'craftingLevel': 60,
          'craftingJob': 'Alchemist',
          'outputs': [
            {
              'item': '57dd38e50febcb5d9dde9724',
              '_id': '57dd422c0febcb5d9dde979b',
              'amount': 1
            }
          ],
          'inputs': [
            {
              'item': '57cfbd439567fb3285215691',
              '_id': '57dd422c0febcb5d9dde979c',
              'amount': 1
            },
            {
              'item': '57cfbd969567fb32852156b7',
              '_id': '57dd422c0febcb5d9dde979d',
              'amount': 2
            },
            {
              'item': '57dd422c0febcb5d9dde979e',
              '_id': '57dd422d0febcb5d9dde97a1',
              'amount': 2
            },
            {
              'item': '57dd422c0febcb5d9dde97a0',
              '_id': '57dd422d0febcb5d9dde97a2',
              'amount': 2
            },
            {
              'item': '57dd422c0febcb5d9dde979f',
              '_id': '57dd422d0febcb5d9dde97a3',
              'amount': 1
            }
          ],
          '__v': 0
        },
        'step': 'Craft',
        'item': {
          '_id': '57dd38e50febcb5d9dde9724',
          'name': 'Astral Oil',
          'discount': 0,
          'inStock': 0,
          'soldOnMarket': false,
          'canBeOrderedByUnprivileged': false,
          'gatheringLevel': 0,
          'gatheringJob': 'None',
          'gatheringEffort': 0,
          'priceHQ': 60000,
          'price': 60000,
          '__v': 0,
          'lastPriceUpdate': '2016-10-15T10:42:39.699Z',
          'ageMultiplier': 4.66,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [
          {
            '_id': '586c206f25fb900f3f688446',
            'amount': 36,
            'step': 'Gather',
            'item': {
              '_id': '57cfbd439567fb3285215691',
              'name': 'Lightning Cluster',
              'gatheringLevel': 50,
              'gatheringJob': 'None',
              'gatheringEffort': -45,
              'priceHQ': 0,
              'price': 1450,
              '__v': 0,
              'canBeOrderedByUnprivileged': false,
              'lastPriceUpdate': '2016-09-26T07:45:04.341Z',
              'ageMultiplier': 10.09,
              'soldOnMarket': false,
              'inStock': 0,
              'discount': 0,
              'datedObject': false,
              'availableFromNpc': false,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f688449',
            'amount': 72,
            'step': 'Gather',
            'item': {
              '_id': '57dd422c0febcb5d9dde97a0',
              'name': 'Seventh Heaven',
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 60,
              'gatheringJob': 'Botanist',
              'gatheringEffort': 100,
              'priceHQ': 30000,
              'price': 4111,
              '__v': 0,
              'lastPriceUpdate': '2016-10-15T10:42:55.179Z',
              'ageMultiplier': 7.12,
              'datedObject': false,
              'availableFromNpc': false,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f688448',
            'amount': 72,
            'step': 'Gather',
            'item': {
              '_id': '57dd422c0febcb5d9dde979e',
              'name': 'Astral Moraine',
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 60,
              'gatheringJob': 'Miner',
              'gatheringEffort': 100,
              'priceHQ': 16500,
              'price': 11798,
              '__v': 0,
              'lastPriceUpdate': '2016-10-15T10:42:27.980Z',
              'ageMultiplier': 7.12,
              'datedObject': false,
              'availableFromNpc': false,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f688447',
            'amount': 72,
            'step': 'Gather',
            'item': {
              '_id': '57cfbd969567fb32852156b7',
              'name': 'Water Cluster',
              'gatheringLevel': 50,
              'gatheringJob': 'None',
              'gatheringEffort': -45,
              'priceHQ': 0,
              'price': 1500,
              '__v': 0,
              'canBeOrderedByUnprivileged': false,
              'lastPriceUpdate': '2017-01-01T17:05:32.419Z',
              'ageMultiplier': 11.68,
              'soldOnMarket': false,
              'inStock': 0,
              'discount': 0,
              'datedObject': false,
              'availableFromNpc': false,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f68844a',
            'amount': 36,
            'step': 'Gather',
            'item': {
              '_id': '57dd422c0febcb5d9dde979f',
              'name': 'Bear Fat',
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 0,
              'gatheringJob': 'None',
              'gatheringEffort': 10,
              'priceHQ': 1200,
              'price': 950,
              '__v': 0,
              'lastPriceUpdate': '2016-10-27T13:59:28.388Z',
              'ageMultiplier': 4.66,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          }
        ],
        'hq': false,
        '__v': 0
      },
      {
        '_id': '586c206f25fb900f3f68841b',
        'amount': 36,
        'recipe': {
          '_id': '57dd3cb10febcb5d9dde976b',
          'craftingLevel': 56,
          'craftingJob': 'Carpenter',
          'outputs': [
            {
              'item': '57dd38e50febcb5d9dde9725',
              '_id': '57dd3cb10febcb5d9dde976c',
              'amount': 1
            }
          ],
          'inputs': [
            {
              'item': '57dd38e50febcb5d9dde9722',
              '_id': '57dd3cb10febcb5d9dde976d',
              'amount': 1
            },
            {
              'item': '57cfbd439567fb328521568f',
              '_id': '57dd3cb10febcb5d9dde976e',
              'amount': 2
            },
            {
              'item': '57dd3cb10febcb5d9dde9770',
              '_id': '57dd3cb20febcb5d9dde9771',
              'amount': 3
            },
            {
              'item': '57dd3cb10febcb5d9dde976f',
              '_id': '57dd3cb20febcb5d9dde9772',
              'amount': 9
            }
          ],
          '__v': 0
        },
        'step': 'Craft',
        'item': {
          '_id': '57dd38e50febcb5d9dde9725',
          'name': 'Cassia Lumber',
          'discount': 0,
          'inStock': 0,
          'soldOnMarket': false,
          'canBeOrderedByUnprivileged': false,
          'gatheringLevel': 0,
          'gatheringJob': 'None',
          'gatheringEffort': 0,
          'priceHQ': 47999,
          'price': 45000,
          '__v': 0,
          'lastPriceUpdate': '2016-09-26T08:15:28.404Z',
          'ageMultiplier': 4.54,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [
          {
            '_id': '586c206f25fb900f3f68844b',
            'amount': 36,
            'step': 'Gather',
            'item': {
              '_id': '57dd38e50febcb5d9dde9722',
              'name': 'Ice Cluster',
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 50,
              'gatheringJob': 'None',
              'gatheringEffort': -45,
              'priceHQ': 0,
              'price': 500,
              '__v': 0,
              'lastPriceUpdate': '2017-01-01T17:04:54.186Z',
              'ageMultiplier': 9.93,
              'datedObject': false,
              'availableFromNpc': false,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f68844d',
            'amount': 108,
            'step': 'Gather',
            'item': {
              '_id': '57dd3cb10febcb5d9dde9770',
              'name': 'Cassia Log',
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 0,
              'gatheringJob': 'None',
              'gatheringEffort': 1,
              'priceHQ': 5000,
              'price': 600,
              '__v': 0,
              'lastPriceUpdate': '2017-01-02T23:12:26.082Z',
              'ageMultiplier': 9.22,
              'datedObject': false,
              'availableFromNpc': false,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f68844c',
            'amount': 72,
            'step': 'Gather',
            'item': {
              '_id': '57cfbd439567fb328521568f',
              'name': 'Wind Cluster',
              'gatheringLevel': 50,
              'gatheringJob': 'None',
              'gatheringEffort': -45,
              'priceHQ': 0,
              'price': 1500,
              '__v': 0,
              'canBeOrderedByUnprivileged': false,
              'lastPriceUpdate': '2017-01-01T17:04:26.325Z',
              'ageMultiplier': 19.63,
              'soldOnMarket': false,
              'inStock': 0,
              'discount': 0,
              'datedObject': false,
              'availableFromNpc': false,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f68844e',
            'amount': 324,
            'step': 'Gather',
            'item': {
              '_id': '57dd3cb10febcb5d9dde976f',
              'name': 'Hardened Sap',
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 0,
              'gatheringJob': 'None',
              'gatheringEffort': 100,
              'priceHQ': 6800,
              'price': 1800,
              '__v': 0,
              'lastPriceUpdate': '2016-11-06T21:57:23.329Z',
              'ageMultiplier': 23.26,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          }
        ],
        'hq': false,
        '__v': 0
      }
    ],
    'hq': false,
    '__v': 0
  }

  var projectMogwallTree = {
    '_id': '586c206f25fb900f3f6883f3',
    'amount': 1,
    'recipe': {
      '_id': '586c1b9e45aba70e56a73d63',
      'craftingLevel': 1,
      'craftingJob': 'Armorer',
      'outputs': [
        {
          'item': '57dd32b329bed45d2804a3ef',
          '_id': '586c1bf084f56b0f306852c4',
          'amount': 1
        }
      ],
      'inputs': [
        {
          'item': '57dd3165ec158f5b6b75b43d',
          '_id': '586c1bf084f56b0f306852c7',
          'amount': 9
        },
        {
          'item': '57dd3165ec158f5b6b75b43c',
          '_id': '586c1bf084f56b0f306852c6',
          'amount': 36
        },
        {
          'item': '57dd3165ec158f5b6b75b43e',
          '_id': '586c1bf084f56b0f306852c5',
          'amount': 18
        },
        {
          '_id': '586c1cd625fb900f3f688374',
          'item': '57dd302cec158f5b6b75b42d',
          'amount': 75
        },
        {
          '_id': '586c1cd625fb900f3f688373',
          'item': '57dd332729bed45d2804a3f4',
          'amount': 75
        },
        {
          '_id': '586c1cd625fb900f3f688372',
          'item': '57dd300eec158f5b6b75b42b',
          'amount': 75
        },
        {
          '_id': '586c1cd625fb900f3f688371',
          'item': '57dd302cec158f5b6b75b42e',
          'amount': 75
        },
        {
          '_id': '586c1cd625fb900f3f688370',
          'item': '57dd3069ec158f5b6b75b42f',
          'amount': 150
        },
        {
          '_id': '586c1cd625fb900f3f68836f',
          'item': '57dd3069ec158f5b6b75b432',
          'amount': 150
        },
        {
          '_id': '586c1cd625fb900f3f68836e',
          'item': '57dd3069ec158f5b6b75b430',
          'amount': 75
        },
        {
          '_id': '586c1cd625fb900f3f68836d',
          'item': '57dd3069ec158f5b6b75b431',
          'amount': 75
        },
        {
          '_id': '586c1cd625fb900f3f68836c',
          'item': '57dd3088ec158f5b6b75b433',
          'amount': 150
        },
        {
          '_id': '586c1cd625fb900f3f68836b',
          'item': '57dd3088ec158f5b6b75b435',
          'amount': 150
        },
        {
          '_id': '586c1cd625fb900f3f68836a',
          'item': '57dd3088ec158f5b6b75b436',
          'amount': 150
        },
        {
          '_id': '586c1cd625fb900f3f688369',
          'item': '57dd3088ec158f5b6b75b434',
          'amount': 75
        },
        {
          '_id': '586c1cd625fb900f3f688368',
          'item': '57dd3165ec158f5b6b75b440',
          'amount': 6
        },
        {
          '_id': '586c1cd625fb900f3f688367',
          'item': '57dd3165ec158f5b6b75b441',
          'amount': 18
        },
        {
          '_id': '586c1cd625fb900f3f688366',
          'item': '57dd3165ec158f5b6b75b43f',
          'amount': 18
        },
        {
          '_id': '586c1cd625fb900f3f688365',
          'item': '57dd3165ec158f5b6b75b443',
          'amount': 27
        },
        {
          '_id': '586c1cd625fb900f3f688364',
          'item': '57dd3165ec158f5b6b75b439',
          'amount': 150
        },
        {
          'item': '57dd3165ec158f5b6b75b438',
          '_id': '586c1cfa25fb900f3f68837a',
          'amount': 75
        },
        {
          'item': '57dd3165ec158f5b6b75b437',
          '_id': '586c1cfa25fb900f3f688379',
          'amount': 75
        },
        {
          '_id': '586c1d6f25fb900f3f68838a',
          'item': '57dd3165ec158f5b6b75b43a',
          'amount': 150
        },
        {
          '_id': '586c1d6f25fb900f3f688389',
          'item': '57dd3165ec158f5b6b75b43b',
          'amount': 75
        },
        {
          'item': '57dd3165ec158f5b6b75b442',
          '_id': '586c1e4b25fb900f3f6883b0',
          'amount': 9
        },
        {
          'item': '57dd3165ec158f5b6b75b444',
          '_id': '586c1e4b25fb900f3f6883af',
          'amount': 3
        }
      ],
      '__v': 0
    },
    'step': 'Craft',
    'item': {
      '_id': '57dd32b329bed45d2804a3ef',
      'name': 'Monstrously Large Mogwall',
      'discount': 0,
      'inStock': 0,
      'soldOnMarket': false,
      'canBeOrderedByUnprivileged': false,
      'gatheringLevel': 0,
      'gatheringJob': 'None',
      'gatheringEffort': 1,
      'priceHQ': 0,
      'price': 40000000,
      '__v': 0,
      'lastPriceUpdate': '2016-12-13T17:49:12.187Z',
      'ageMultiplier': 1.22,
      'unspoiledNodeTime': {
        'duration': 60
      }
    },
    'inputs': [
      {
        '_id': '586c206f25fb900f3f6883fa',
        'amount': 75,
        'step': 'Gather',
        'item': {
          '_id': '57dd302cec158f5b6b75b42e',
          'name': 'Cypress Log',
          'discount': 0,
          'inStock': 0,
          'soldOnMarket': false,
          'canBeOrderedByUnprivileged': false,
          'gatheringLevel': 50,
          'gatheringJob': 'Botanist',
          'gatheringEffort': 1,
          'priceHQ': 7000,
          'price': 7500,
          '__v': 0,
          'lastPriceUpdate': '2016-09-26T07:58:57.375Z',
          'ageMultiplier': 4,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [

        ],
        'hq': false,
        '__v': 0
      },
      {
        '_id': '586c206f25fb900f3f6883fe',
        'amount': 75,
        'step': 'Gather',
        'item': {
          '_id': '57dd3069ec158f5b6b75b431',
          'name': 'Ebony Log',
          'discount': 0,
          'inStock': 0,
          'soldOnMarket': false,
          'canBeOrderedByUnprivileged': false,
          'gatheringLevel': 50,
          'gatheringJob': 'Botanist',
          'gatheringEffort': 20,
          'priceHQ': 6000,
          'price': 2899,
          '__v': 0,
          'lastPriceUpdate': '2016-09-26T08:01:51.811Z',
          'ageMultiplier': 4,
          'datedObject': false,
          'availableFromNpc': false,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [

        ],
        'hq': false,
        '__v': 0
      },
      {
        '_id': '586c206f25fb900f3f688401',
        'amount': 150,
        'step': 'Gather',
        'item': {
          '_id': '57dd3088ec158f5b6b75b436',
          'name': 'Shroud Seedling',
          'discount': 0,
          'inStock': 0,
          'soldOnMarket': false,
          'canBeOrderedByUnprivileged': false,
          'gatheringLevel': 20,
          'gatheringJob': 'Botanist',
          'gatheringEffort': 1,
          'priceHQ': 65,
          'price': 40,
          '__v': 0,
          'lastPriceUpdate': '2016-10-21T14:06:31.320Z',
          'ageMultiplier': 6.4,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [

        ],
        'hq': false,
        '__v': 0
      },
      {
        '_id': '586c206f25fb900f3f688402',
        'amount': 75,
        'step': 'Gather',
        'item': {
          '_id': '57dd3088ec158f5b6b75b434',
          'name': 'Marble',
          'discount': 0,
          'inStock': 0,
          'soldOnMarket': false,
          'canBeOrderedByUnprivileged': false,
          'gatheringLevel': 45,
          'gatheringJob': 'Miner',
          'gatheringEffort': 1,
          'priceHQ': 299,
          'price': 270,
          '__v': 0,
          'lastPriceUpdate': '2016-10-21T09:51:59.979Z',
          'ageMultiplier': 4.93,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [

        ],
        'hq': false,
        '__v': 0
      },
      {
        '_id': '586c206f25fb900f3f688400',
        'amount': 150,
        'step': 'Gather',
        'item': {
          '_id': '57dd3088ec158f5b6b75b435',
          'name': 'Humus',
          'discount': 0,
          'inStock': 0,
          'soldOnMarket': false,
          'canBeOrderedByUnprivileged': false,
          'gatheringLevel': 15,
          'gatheringJob': 'Botanist',
          'gatheringEffort': 1,
          'priceHQ': 784,
          'price': 500,
          '__v': 0,
          'lastPriceUpdate': '2016-09-30T14:14:29.899Z',
          'ageMultiplier': 6.4,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [

        ],
        'hq': false,
        '__v': 0
      },
      {
        '_id': '586c206f25fb900f3f688404',
        'amount': 18,
        'step': 'Gather',
        'item': {
          '_id': '57dd3165ec158f5b6b75b441',
          'name': 'Astral Rock',
          'discount': 0,
          'inStock': 0,
          'soldOnMarket': false,
          'canBeOrderedByUnprivileged': false,
          'gatheringLevel': 50,
          'gatheringJob': 'Miner',
          'gatheringEffort': 20,
          'priceHQ': 3000,
          'price': 2618,
          '__v': 0,
          'lastPriceUpdate': '2016-09-26T08:06:23.346Z',
          'ageMultiplier': 3.25,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [

        ],
        'hq': false,
        '__v': 0
      },
      {
        '_id': '586c206f25fb900f3f688405',
        'amount': 18,
        'step': 'Gather',
        'item': {
          '_id': '57dd3165ec158f5b6b75b43f',
          'name': 'Dark Chestnut Log',
          'discount': 0,
          'inStock': 0,
          'soldOnMarket': false,
          'canBeOrderedByUnprivileged': false,
          'gatheringLevel': 54,
          'gatheringJob': 'Botanist',
          'gatheringEffort': 2,
          'priceHQ': 850,
          'price': 400,
          '__v': 0,
          'lastPriceUpdate': '2016-11-05T12:57:44.607Z',
          'ageMultiplier': 60.91,
          'datedObject': false,
          'availableFromNpc': false,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [

        ],
        'hq': false,
        '__v': 0
      },
      {
        '_id': '586c206f25fb900f3f688406',
        'amount': 27,
        'step': 'Gather',
        'item': {
          '_id': '57dd3165ec158f5b6b75b443',
          'name': 'Birch Log',
          'discount': 0,
          'inStock': 0,
          'soldOnMarket': false,
          'canBeOrderedByUnprivileged': false,
          'gatheringLevel': 58,
          'gatheringJob': 'Botanist',
          'gatheringEffort': 3,
          'priceHQ': 1000,
          'price': 1999,
          '__v': 0,
          'lastPriceUpdate': '2016-11-19T10:39:23.457Z',
          'ageMultiplier': 9.37,
          'datedObject': false,
          'availableFromNpc': false,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [

        ],
        'hq': false,
        '__v': 0
      },
      {
        '_id': '586c206f25fb900f3f6883f7',
        'amount': 75,
        'recipe': {
          '_id': '57dd336e29bed45d2804a40d',
          'craftingLevel': 39,
          'craftingJob': 'Alchemist',
          'outputs': [
            {
              'item': '57dd302cec158f5b6b75b42d',
              '_id': '57dd336e29bed45d2804a40e',
              'amount': 1
            }
          ],
          'inputs': [
            {
              'item': '57cdbb4c48ce3f24ea87a388',
              '_id': '57dd336e29bed45d2804a412',
              'amount': 1
            },
            {
              'item': '57dd336e29bed45d2804a40f',
              '_id': '57dd336f29bed45d2804a413',
              'amount': 5
            },
            {
              'item': '57dd336e29bed45d2804a410',
              '_id': '57dd336f29bed45d2804a414',
              'amount': 2
            },
            {
              'item': '57dd336e29bed45d2804a411',
              '_id': '57dd336f29bed45d2804a415',
              'amount': 1
            }
          ],
          '__v': 0
        },
        'step': 'Craft',
        'item': {
          '_id': '57dd302cec158f5b6b75b42d',
          'name': 'Clinker Bricks',
          'discount': 0,
          'inStock': 0,
          'soldOnMarket': false,
          'canBeOrderedByUnprivileged': false,
          'gatheringLevel': 0,
          'gatheringJob': 'None',
          'gatheringEffort': 0,
          'priceHQ': 6001,
          'price': 10000,
          '__v': 0,
          'lastPriceUpdate': '2016-09-26T07:56:14.079Z',
          'ageMultiplier': 5.38,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [
          {
            '_id': '586c206f25fb900f3f688413',
            'amount': 75,
            'step': 'Gather',
            'item': {
              '_id': '57cdbb4c48ce3f24ea87a388',
              'name': 'Grenade Ash',
              'gatheringLevel': 0,
              'gatheringJob': 'Miner',
              'gatheringEffort': 10,
              'priceHQ': 500,
              'price': 280,
              '__v': 0,
              'lastPriceUpdate': '2016-09-26T07:32:11.826Z',
              'ageMultiplier': 11.16,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f688414',
            'amount': 375,
            'step': 'Gather',
            'item': {
              '_id': '57dd336e29bed45d2804a40f',
              'name': 'Water Shard',
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 1,
              'gatheringJob': 'None',
              'gatheringEffort': 1,
              'priceHQ': 0,
              'price': 178,
              '__v': 0,
              'lastPriceUpdate': '2017-01-01T17:04:08.644Z',
              'ageMultiplier': 52.05,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f688416',
            'amount': 75,
            'step': 'Gather',
            'item': {
              '_id': '57dd336e29bed45d2804a411',
              'name': "Potter's Clay",
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 10,
              'gatheringJob': 'Miner',
              'gatheringEffort': 1,
              'priceHQ': 900,
              'price': 444,
              '__v': 0,
              'lastPriceUpdate': '2016-09-26T08:13:53.486Z',
              'ageMultiplier': 5.38,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f688415',
            'amount': 150,
            'step': 'Gather',
            'item': {
              '_id': '57dd336e29bed45d2804a410',
              'name': 'Siltstone',
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 30,
              'gatheringJob': 'Miner',
              'gatheringEffort': 1,
              'priceHQ': 1950,
              'price': 850,
              '__v': 0,
              'lastPriceUpdate': '2016-10-29T21:27:21.336Z',
              'ageMultiplier': 8.86,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          }
        ],
        'hq': false,
        '__v': 0
      },
      {
        '_id': '586c206f25fb900f3f688407',
        'amount': 150,
        'recipe': {
          '_id': '57dd40a30febcb5d9dde977e',
          'craftingLevel': 30,
          'craftingJob': 'Alchemist',
          'outputs': [
            {
              'item': '57dd3165ec158f5b6b75b439',
              '_id': '57dd40a30febcb5d9dde977f',
              'amount': 1
            }
          ],
          'inputs': [
            {
              'item': '57dd336e29bed45d2804a40f',
              '_id': '57dd40a30febcb5d9dde9780',
              'amount': 3
            },
            {
              'item': '57dd40a30febcb5d9dde9781',
              '_id': '57dd40a50febcb5d9dde9782',
              'amount': 2
            }
          ],
          '__v': 0
        },
        'step': 'Craft',
        'item': {
          '_id': '57dd3165ec158f5b6b75b439',
          'name': 'Horn Glue',
          'discount': 0,
          'inStock': 0,
          'soldOnMarket': false,
          'canBeOrderedByUnprivileged': false,
          'gatheringLevel': 0,
          'gatheringJob': 'None',
          'gatheringEffort': 0,
          'priceHQ': 7800,
          'price': 3900,
          '__v': 0,
          'lastPriceUpdate': '2016-09-26T08:13:19.577Z',
          'ageMultiplier': 6.4,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [
          {
            '_id': '586c206f25fb900f3f688434',
            'amount': 450,
            'step': 'Gather',
            'item': {
              '_id': '57dd336e29bed45d2804a40f',
              'name': 'Water Shard',
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 1,
              'gatheringJob': 'None',
              'gatheringEffort': 1,
              'priceHQ': 0,
              'price': 178,
              '__v': 0,
              'lastPriceUpdate': '2017-01-01T17:04:08.644Z',
              'ageMultiplier': 52.05,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f688435',
            'amount': 300,
            'step': 'Buy',
            'item': {
              '_id': '57dd40a30febcb5d9dde9781',
              'name': 'Aldgoat Horn',
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 0,
              'gatheringJob': 'None',
              'gatheringEffort': 10,
              'priceHQ': 2500,
              'price': 395,
              '__v': 0,
              'lastPriceUpdate': '2016-09-26T08:22:51.585Z',
              'ageMultiplier': 11.2,
              'datedObject': false,
              'availableFromNpc': true,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          }
        ],
        'hq': false,
        '__v': 0
      },
      {
        '_id': '586c206f25fb900f3f68840b',
        'amount': 75,
        'recipe': {
          '_id': '57dd38bb0febcb5d9dde971b',
          'craftingLevel': 30,
          'craftingJob': 'Goldsmith',
          'outputs': [
            {
              'item': '57dd3165ec158f5b6b75b43b',
              '_id': '57dd38bb0febcb5d9dde971c',
              'amount': 1
            }
          ],
          'inputs': [
            {
              'item': '57d05f11686d280c5a863b18',
              '_id': '57dd38bb0febcb5d9dde971d',
              'amount': 3
            },
            {
              'item': '57dd38bb0febcb5d9dde971e',
              '_id': '57dd38bd0febcb5d9dde971f',
              'amount': 3
            }
          ],
          '__v': 0
        },
        'step': 'Craft',
        'item': {
          '_id': '57dd3165ec158f5b6b75b43b',
          'name': 'Cut Stone',
          'discount': 0,
          'inStock': 0,
          'soldOnMarket': false,
          'canBeOrderedByUnprivileged': false,
          'gatheringLevel': 0,
          'gatheringJob': 'None',
          'gatheringEffort': 0,
          'priceHQ': 6000,
          'price': 4507,
          '__v': 0,
          'lastPriceUpdate': '2016-11-16T13:28:57.584Z',
          'ageMultiplier': 4.57,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [
          {
            '_id': '586c206f25fb900f3f688436',
            'amount': 225,
            'step': 'Gather',
            'item': {
              '_id': '57d05f11686d280c5a863b18',
              'name': 'Wind Shard',
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 1,
              'gatheringJob': 'None',
              'gatheringEffort': 1,
              'priceHQ': 0,
              'price': 208,
              '__v': 0,
              'soldOnMarket': false,
              'inStock': 0,
              'discount': 0,
              'lastPriceUpdate': '2016-10-20T16:19:50.100Z',
              'ageMultiplier': 10.11,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f688437',
            'amount': 225,
            'step': 'Gather',
            'item': {
              '_id': '57dd38bb0febcb5d9dde971e',
              'name': 'Granite',
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 31,
              'gatheringJob': 'Miner',
              'gatheringEffort': 1,
              'priceHQ': 1300,
              'price': 999,
              '__v': 0,
              'lastPriceUpdate': '2016-11-16T13:28:37.413Z',
              'ageMultiplier': 9.91,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          }
        ],
        'hq': false,
        '__v': 0
      },
      cedarLumberStep,
      {
        '_id': '586c206f25fb900f3f6883ff',
        'amount': 150,
        'recipe': {
          '_id': '57dd349e29bed45d2804a498',
          'craftingLevel': 54,
          'craftingJob': 'Carpenter',
          'outputs': [
            {
              'item': '57dd3088ec158f5b6b75b433',
              '_id': '57dd349e29bed45d2804a499',
              'amount': 1
            }
          ],
          'inputs': [
            {
              'item': '57dd337c29bed45d2804a418',
              '_id': '57dd349e29bed45d2804a49a',
              'amount': 4
            },
            {
              'item': '57dd3165ec158f5b6b75b43f',
              '_id': '57dd349e29bed45d2804a49b',
              'amount': 5
            }
          ],
          '__v': 0
        },
        'step': 'Craft',
        'item': {
          '_id': '57dd3088ec158f5b6b75b433',
          'name': 'Dark Chestnut Lumber',
          'discount': 0,
          'inStock': 0,
          'soldOnMarket': false,
          'canBeOrderedByUnprivileged': false,
          'gatheringLevel': 0,
          'gatheringJob': 'None',
          'gatheringEffort': 0,
          'priceHQ': 4840,
          'price': 3000,
          '__v': 0,
          'lastPriceUpdate': '2016-10-19T20:01:03.726Z',
          'ageMultiplier': 13.77,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [
          {
            '_id': '586c206f25fb900f3f68842a',
            'amount': 750,
            'step': 'Gather',
            'item': {
              '_id': '57dd3165ec158f5b6b75b43f',
              'name': 'Dark Chestnut Log',
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 54,
              'gatheringJob': 'Botanist',
              'gatheringEffort': 2,
              'priceHQ': 850,
              'price': 400,
              '__v': 0,
              'lastPriceUpdate': '2016-11-05T12:57:44.607Z',
              'ageMultiplier': 60.91,
              'datedObject': false,
              'availableFromNpc': false,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f688429',
            'amount': 600,
            'step': 'Gather',
            'item': {
              '_id': '57dd337c29bed45d2804a418',
              'name': 'Wind Crystal',
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 30,
              'gatheringJob': 'None',
              'gatheringEffort': -27,
              'priceHQ': 0,
              'price': 249,
              '__v': 0,
              'lastPriceUpdate': '2017-01-01T17:01:07.089Z',
              'ageMultiplier': 144.17,
              'datedObject': false,
              'availableFromNpc': false,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          }
        ],
        'hq': false,
        '__v': 0
      },
      {
        '_id': '586c206f25fb900f3f688409',
        'amount': 75,
        'recipe': {
          '_id': '57dd3fe70febcb5d9dde9779',
          'craftingLevel': 50,
          'craftingJob': 'Carpenter',
          'outputs': [
            {
              'item': '57dd3165ec158f5b6b75b437',
              '_id': '57dd3fe70febcb5d9dde977a',
              'amount': 1
            }
          ],
          'inputs': [
            {
              'item': '57dd337c29bed45d2804a418',
              '_id': '57dd3fe70febcb5d9dde977b',
              'amount': 3
            },
            {
              'item': '57dd3fe70febcb5d9dde977c',
              '_id': '57dd3fe80febcb5d9dde977d',
              'amount': 3
            }
          ],
          '__v': 0
        },
        'step': 'Craft',
        'item': {
          '_id': '57dd3165ec158f5b6b75b437',
          'name': 'Spruce Lumber',
          'discount': 0,
          'inStock': 0,
          'soldOnMarket': false,
          'canBeOrderedByUnprivileged': false,
          'gatheringLevel': 0,
          'gatheringJob': 'None',
          'gatheringEffort': 0,
          'priceHQ': 2350,
          'price': 2216,
          '__v': 0,
          'lastPriceUpdate': '2016-10-19T20:00:27.252Z',
          'ageMultiplier': 4,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [
          {
            '_id': '586c206f25fb900f3f688439',
            'amount': 225,
            'step': 'Gather',
            'item': {
              '_id': '57dd3fe70febcb5d9dde977c',
              'name': 'Spruce Log',
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 50,
              'gatheringJob': 'Botanist',
              'gatheringEffort': 20,
              'priceHQ': 2100,
              'price': 1899,
              '__v': 0,
              'lastPriceUpdate': '2016-10-19T20:00:36.326Z',
              'ageMultiplier': 8.8,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f688438',
            'amount': 225,
            'step': 'Gather',
            'item': {
              '_id': '57dd337c29bed45d2804a418',
              'name': 'Wind Crystal',
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 30,
              'gatheringJob': 'None',
              'gatheringEffort': -27,
              'priceHQ': 0,
              'price': 249,
              '__v': 0,
              'lastPriceUpdate': '2017-01-01T17:01:07.089Z',
              'ageMultiplier': 144.17,
              'datedObject': false,
              'availableFromNpc': false,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          }
        ],
        'hq': false,
        '__v': 0
      },
      {
        '_id': '586c206f25fb900f3f6883f4',
        'amount': 9,
        'recipe': {
          '_id': '57dd38f30febcb5d9dde972b',
          'craftingLevel': 26,
          'craftingJob': 'Armorer',
          'outputs': [
            {
              'item': '57dd3165ec158f5b6b75b43d',
              '_id': '57dd38f30febcb5d9dde972c',
              'amount': 1
            }
          ],
          'inputs': [
            {
              'item': '57cdbb5d15751d255aa73cbf',
              '_id': '57dd38f30febcb5d9dde972d',
              'amount': 2
            },
            {
              'item': '57cdbc2615751d255aa73ccb',
              '_id': '57dd38f30febcb5d9dde972e',
              'amount': 1
            }
          ],
          '__v': 0
        },
        'step': 'Craft',
        'item': {
          '_id': '57dd3165ec158f5b6b75b43d',
          'name': 'Steel Hinge',
          'discount': 0,
          'inStock': 0,
          'soldOnMarket': false,
          'canBeOrderedByUnprivileged': false,
          'gatheringLevel': 0,
          'gatheringJob': 'None',
          'gatheringEffort': 0,
          'priceHQ': 9999,
          'price': 4449,
          '__v': 0,
          'lastPriceUpdate': '2016-09-26T08:04:36.641Z',
          'ageMultiplier': 2.71,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [
          {
            '_id': '586c206f25fb900f3f68840e',
            'amount': 18,
            'step': 'Gather',
            'item': {
              '_id': '57cdbb5d15751d255aa73cbf',
              'name': 'Ice Shard',
              'gatheringLevel': 1,
              'gatheringJob': 'None',
              'gatheringEffort': 1,
              'priceHQ': 0,
              'price': 189,
              '__v': 0,
              'canBeOrderedByUnprivileged': false,
              'soldOnMarket': false,
              'inStock': 0,
              'discount': 0,
              'lastPriceUpdate': '2017-01-01T17:08:26.007Z',
              'ageMultiplier': 15.94,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f68840f',
            'amount': 9,
            'recipe': {
              '_id': '57cdbbff15751d255aa73cca',
              'craftingLevel': 26,
              'craftingJob': 'Armorer',
              'outputs': [
                {
                  'item': '57cdbc2615751d255aa73ccb',
                  '_id': '57cdbc7615751d255aa73ce1',
                  'amount': 1
                }
              ],
              'inputs': [
                {
                  'item': '57cda964bfe7852417f888c3',
                  '_id': '57cdbc7615751d255aa73ce4',
                  'amount': 2
                },
                {
                  'item': '57cdbb5d15751d255aa73cbf',
                  '_id': '57cdbc7615751d255aa73ce3',
                  'amount': 2
                },
                {
                  'item': '57cdbb4748ce3f24ea87a387',
                  '_id': '57cdbc7615751d255aa73ce2',
                  'amount': 1
                }
              ],
              '__v': 0
            },
            'step': 'Buy',
            'item': {
              '_id': '57cdbc2615751d255aa73ccb',
              'name': 'Steel Ingot',
              'gatheringLevel': 0,
              'gatheringJob': 'None',
              'gatheringEffort': 0,
              'priceHQ': 3699,
              'price': 258,
              '__v': 0,
              'lastPriceUpdate': '2016-10-29T14:00:41.151Z',
              'ageMultiplier': 6.51,
              'canBeOrderedByUnprivileged': false,
              'soldOnMarket': false,
              'inStock': 0,
              'discount': 0,
              'datedObject': false,
              'availableFromNpc': true,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [
              {
                '_id': '586c206f25fb900f3f688442',
                'amount': 9,
                'step': 'Gather',
                'item': {
                  '_id': '57cdbb4748ce3f24ea87a387',
                  'name': 'Bomb Ash',
                  'gatheringLevel': 0,
                  'gatheringJob': 'Miner',
                  'gatheringEffort': 5,
                  'priceHQ': 803,
                  'price': 300,
                  '__v': 0,
                  'lastPriceUpdate': '2016-09-30T13:11:04.533Z',
                  'ageMultiplier': 6.51,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              },
              {
                '_id': '586c206f25fb900f3f688441',
                'amount': 18,
                'step': 'Gather',
                'item': {
                  '_id': '57cdbb5d15751d255aa73cbf',
                  'name': 'Ice Shard',
                  'gatheringLevel': 1,
                  'gatheringJob': 'None',
                  'gatheringEffort': 1,
                  'priceHQ': 0,
                  'price': 189,
                  '__v': 0,
                  'canBeOrderedByUnprivileged': false,
                  'soldOnMarket': false,
                  'inStock': 0,
                  'discount': 0,
                  'lastPriceUpdate': '2017-01-01T17:08:26.007Z',
                  'ageMultiplier': 15.94,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              },
              {
                '_id': '586c206f25fb900f3f688440',
                'amount': 18,
                'step': 'Gather',
                'item': {
                  '_id': '57cda964bfe7852417f888c3',
                  'name': 'Iron Ore',
                  'gatheringLevel': 14,
                  'gatheringJob': 'Miner',
                  'gatheringEffort': 1,
                  'priceHQ': 900,
                  'price': 18,
                  '__v': 0,
                  'lastPriceUpdate': '2017-01-01T17:04:33.620Z',
                  'ageMultiplier': 29.4,
                  'canBeOrderedByUnprivileged': false,
                  'soldOnMarket': false,
                  'inStock': 0,
                  'discount': 0,
                  'datedObject': false,
                  'availableFromNpc': false,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              }
            ],
            'hq': false,
            '__v': 0
          }
        ],
        'hq': false,
        '__v': 0
      },
      {
        '_id': '586c206f25fb900f3f6883f6',
        'amount': 18,
        'recipe': {
          '_id': '57dd38fd0febcb5d9dde972f',
          'craftingLevel': 28,
          'craftingJob': 'Alchemist',
          'outputs': [
            {
              'item': '57dd3165ec158f5b6b75b43e',
              '_id': '57dd38fd0febcb5d9dde9730',
              'amount': 1
            }
          ],
          'inputs': [
            {
              'item': '57dd336e29bed45d2804a40f',
              '_id': '57dd38fd0febcb5d9dde9731',
              'amount': 3
            },
            {
              'item': '57cdd64a15f5ab268ab86d5e',
              '_id': '57dd38fd0febcb5d9dde9732',
              'amount': 1
            },
            {
              'item': '57cdd64a15f5ab268ab86d5d',
              '_id': '57dd38fd0febcb5d9dde9733',
              'amount': 1
            }
          ],
          '__v': 0
        },
        'step': 'Craft',
        'item': {
          '_id': '57dd3165ec158f5b6b75b43e',
          'name': 'Clear Glass Lens',
          'discount': 0,
          'inStock': 0,
          'soldOnMarket': false,
          'canBeOrderedByUnprivileged': false,
          'gatheringLevel': 0,
          'gatheringJob': 'None',
          'gatheringEffort': 1,
          'priceHQ': 1200,
          'price': 53,
          '__v': 0,
          'lastPriceUpdate': '2016-10-26T13:25:23.455Z',
          'ageMultiplier': 3.25,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [
          {
            '_id': '586c206f25fb900f3f688410',
            'amount': 54,
            'step': 'Gather',
            'item': {
              '_id': '57dd336e29bed45d2804a40f',
              'name': 'Water Shard',
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 1,
              'gatheringJob': 'None',
              'gatheringEffort': 1,
              'priceHQ': 0,
              'price': 178,
              '__v': 0,
              'lastPriceUpdate': '2017-01-01T17:04:08.644Z',
              'ageMultiplier': 52.05,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f688412',
            'amount': 18,
            'step': 'Gather',
            'item': {
              '_id': '57cdd64a15f5ab268ab86d5d',
              'name': 'Silex',
              'gatheringLevel': 27,
              'gatheringJob': 'Miner',
              'gatheringEffort': 1,
              'priceHQ': 403,
              'price': 300,
              '__v': 0,
              'canBeOrderedByUnprivileged': false,
              'soldOnMarket': false,
              'inStock': 0,
              'discount': 0,
              'lastPriceUpdate': '2016-09-26T07:35:41.100Z',
              'ageMultiplier': 3.38,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f688411',
            'amount': 18,
            'recipe': {
              '_id': '57dd391b0febcb5d9dde9734',
              'craftingLevel': 25,
              'craftingJob': 'Alchemist',
              'outputs': [
                {
                  'item': '57cdd64a15f5ab268ab86d5e',
                  '_id': '57dd391b0febcb5d9dde9735',
                  'amount': 1
                }
              ],
              'inputs': [
                {
                  'item': '57dd336e29bed45d2804a40f',
                  '_id': '57dd391b0febcb5d9dde9736',
                  'amount': 2
                },
                {
                  'item': '57dd391b0febcb5d9dde9737',
                  '_id': '57dd391c0febcb5d9dde9739',
                  'amount': 1
                },
                {
                  'item': '57dd391b0febcb5d9dde9738',
                  '_id': '57dd391c0febcb5d9dde973a',
                  'amount': 1
                }
              ],
              '__v': 0
            },
            'step': 'Craft',
            'item': {
              '_id': '57cdd64a15f5ab268ab86d5e',
              'name': 'Natron',
              'gatheringLevel': 0,
              'gatheringJob': 'None',
              'gatheringEffort': 0,
              'priceHQ': 1995,
              'price': 1000,
              '__v': 0,
              'canBeOrderedByUnprivileged': false,
              'soldOnMarket': false,
              'inStock': 0,
              'discount': 0,
              'lastPriceUpdate': '2016-10-02T11:04:29.977Z',
              'ageMultiplier': 8.02,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [
              {
                '_id': '586c206f25fb900f3f688443',
                'amount': 36,
                'step': 'Gather',
                'item': {
                  '_id': '57dd336e29bed45d2804a40f',
                  'name': 'Water Shard',
                  'discount': 0,
                  'inStock': 0,
                  'soldOnMarket': false,
                  'canBeOrderedByUnprivileged': false,
                  'gatheringLevel': 1,
                  'gatheringJob': 'None',
                  'gatheringEffort': 1,
                  'priceHQ': 0,
                  'price': 178,
                  '__v': 0,
                  'lastPriceUpdate': '2017-01-01T17:04:08.644Z',
                  'ageMultiplier': 52.05,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              },
              {
                '_id': '586c206f25fb900f3f688444',
                'amount': 18,
                'step': 'Gather',
                'item': {
                  '_id': '57dd391b0febcb5d9dde9737',
                  'name': 'Effervescent Water',
                  'discount': 0,
                  'inStock': 0,
                  'soldOnMarket': false,
                  'canBeOrderedByUnprivileged': false,
                  'gatheringLevel': 24,
                  'gatheringJob': 'Miner',
                  'gatheringEffort': 1,
                  'priceHQ': 432,
                  'price': 389,
                  '__v': 0,
                  'lastPriceUpdate': '2016-10-08T15:00:50.965Z',
                  'ageMultiplier': 9.01,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              },
              {
                '_id': '586c206f25fb900f3f688445',
                'amount': 18,
                'step': 'Gather',
                'item': {
                  '_id': '57dd391b0febcb5d9dde9738',
                  'name': 'Rock Salt',
                  'discount': 0,
                  'inStock': 0,
                  'soldOnMarket': false,
                  'canBeOrderedByUnprivileged': false,
                  'gatheringLevel': 12,
                  'gatheringJob': 'Miner',
                  'gatheringEffort': 1,
                  'priceHQ': 0,
                  'price': 3,
                  '__v': 0,
                  'lastPriceUpdate': '2016-09-30T12:48:55.507Z',
                  'ageMultiplier': 8.02,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              }
            ],
            'hq': false,
            '__v': 0
          }
        ],
        'hq': false,
        '__v': 0
      },
      cassiaBlockStep,
      {
        '_id': '586c206f25fb900f3f6883fb',
        'amount': 150,
        'recipe': {
          '_id': '57dd347329bed45d2804a493',
          'craftingLevel': 44,
          'craftingJob': 'Blacksmith',
          'outputs': [
            {
              'item': '57dd3069ec158f5b6b75b42f',
              '_id': '57dd347329bed45d2804a494',
              'amount': 1
            }
          ],
          'inputs': [
            {
              'item': '57cda969bfe7852417f888c4',
              '_id': '57dd347329bed45d2804a495',
              'amount': 5
            },
            {
              'item': '57dd347329bed45d2804a496',
              '_id': '57dd347629bed45d2804a497',
              'amount': 1
            }
          ],
          '__v': 0
        },
        'step': 'Craft',
        'item': {
          '_id': '57dd3069ec158f5b6b75b42f',
          'name': 'Cobalt Nails',
          'discount': 0,
          'inStock': 0,
          'soldOnMarket': false,
          'canBeOrderedByUnprivileged': false,
          'gatheringLevel': 0,
          'gatheringJob': 'None',
          'gatheringEffort': 0,
          'priceHQ': 7000,
          'price': 4000,
          '__v': 0,
          'lastPriceUpdate': '2016-09-29T14:47:59.196Z',
          'ageMultiplier': 9.22,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [
          {
            '_id': '586c206f25fb900f3f68841e',
            'amount': 750,
            'step': 'Gather',
            'item': {
              '_id': '57cda969bfe7852417f888c4',
              'name': 'Fire Shard',
              'gatheringLevel': 1,
              'gatheringJob': 'None',
              'gatheringEffort': 1,
              'priceHQ': 0,
              'price': 159,
              '__v': 0,
              'canBeOrderedByUnprivileged': false,
              'soldOnMarket': false,
              'inStock': 0,
              'discount': 0,
              'lastPriceUpdate': '2017-01-01T17:03:30.297Z',
              'ageMultiplier': 94.4,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f68841f',
            'amount': 150,
            'recipe': {
              '_id': '57dd3e130febcb5d9dde9773',
              'craftingLevel': 42,
              'craftingJob': 'Blacksmith',
              'outputs': [
                {
                  'item': '57dd347329bed45d2804a496',
                  '_id': '57dd3e130febcb5d9dde9774',
                  'amount': 1
                }
              ],
              'inputs': [
                {
                  'item': '57cda969bfe7852417f888c4',
                  '_id': '57dd3e130febcb5d9dde9775',
                  'amount': 5
                },
                {
                  'item': '57cda964bfe7852417f888c3',
                  '_id': '57dd3e130febcb5d9dde9776',
                  'amount': 1
                },
                {
                  'item': '57dd3e130febcb5d9dde9777',
                  '_id': '57dd3e140febcb5d9dde9778',
                  'amount': 2
                }
              ],
              '__v': 0
            },
            'step': 'Craft',
            'item': {
              '_id': '57dd347329bed45d2804a496',
              'name': 'Cobalt Ingot',
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 0,
              'gatheringJob': 'None',
              'gatheringEffort': 0,
              'priceHQ': 2115,
              'price': 1899,
              '__v': 0,
              'lastPriceUpdate': '2016-09-30T14:18:56.866Z',
              'ageMultiplier': 9.92,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [
              {
                '_id': '586c206f25fb900f3f68844f',
                'amount': 750,
                'step': 'Gather',
                'item': {
                  '_id': '57cda969bfe7852417f888c4',
                  'name': 'Fire Shard',
                  'gatheringLevel': 1,
                  'gatheringJob': 'None',
                  'gatheringEffort': 1,
                  'priceHQ': 0,
                  'price': 159,
                  '__v': 0,
                  'canBeOrderedByUnprivileged': false,
                  'soldOnMarket': false,
                  'inStock': 0,
                  'discount': 0,
                  'lastPriceUpdate': '2017-01-01T17:03:30.297Z',
                  'ageMultiplier': 94.4,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              },
              {
                '_id': '586c206f25fb900f3f688450',
                'amount': 150,
                'step': 'Gather',
                'item': {
                  '_id': '57cda964bfe7852417f888c3',
                  'name': 'Iron Ore',
                  'gatheringLevel': 14,
                  'gatheringJob': 'Miner',
                  'gatheringEffort': 1,
                  'priceHQ': 900,
                  'price': 18,
                  '__v': 0,
                  'lastPriceUpdate': '2017-01-01T17:04:33.620Z',
                  'ageMultiplier': 29.4,
                  'canBeOrderedByUnprivileged': false,
                  'soldOnMarket': false,
                  'inStock': 0,
                  'discount': 0,
                  'datedObject': false,
                  'availableFromNpc': false,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              },
              {
                '_id': '586c206f25fb900f3f688451',
                'amount': 300,
                'step': 'Gather',
                'item': {
                  '_id': '57dd3e130febcb5d9dde9777',
                  'name': 'Cobalt Ore',
                  'discount': 0,
                  'inStock': 0,
                  'soldOnMarket': false,
                  'canBeOrderedByUnprivileged': false,
                  'gatheringLevel': 47,
                  'gatheringJob': 'Miner',
                  'gatheringEffort': 1,
                  'priceHQ': 900,
                  'price': 590,
                  '__v': 0,
                  'lastPriceUpdate': '2016-10-31T17:25:06.037Z',
                  'ageMultiplier': 18.69,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              }
            ],
            'hq': false,
            '__v': 0
          }
        ],
        'hq': false,
        '__v': 0
      },
      {
        '_id': '586c206f25fb900f3f6883fd',
        'amount': 75,
        'recipe': {
          '_id': '57dd345729bed45d2804a48d',
          'craftingLevel': 42,
          'craftingJob': 'Weaver',
          'outputs': [
            {
              'item': '57dd3069ec158f5b6b75b430',
              '_id': '57dd345729bed45d2804a48e',
              'amount': 1
            }
          ],
          'inputs': [
            {
              'item': '57d05fbe686d280c5a863b33',
              '_id': '57dd345729bed45d2804a48f',
              'amount': 5
            },
            {
              'item': '57d05fe0686d280c5a863b3f',
              '_id': '57dd345729bed45d2804a490',
              'amount': 2
            },
            {
              'item': '57cdd64a15f5ab268ab86d5e',
              '_id': '57dd345729bed45d2804a491',
              'amount': 1
            },
            {
              'item': '57cdbb4c48ce3f24ea87a388',
              '_id': '57dd345729bed45d2804a492',
              'amount': 1
            }
          ],
          '__v': 0
        },
        'step': 'Craft',
        'item': {
          '_id': '57dd3069ec158f5b6b75b430',
          'name': 'Felt Lining',
          'discount': 0,
          'inStock': 0,
          'soldOnMarket': false,
          'canBeOrderedByUnprivileged': false,
          'gatheringLevel': 0,
          'gatheringJob': 'None',
          'gatheringEffort': 0,
          'priceHQ': 5879,
          'price': 4000,
          '__v': 0,
          'lastPriceUpdate': '2016-09-29T15:02:55.951Z',
          'ageMultiplier': 4.93,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [
          {
            '_id': '586c206f25fb900f3f688420',
            'amount': 375,
            'step': 'Gather',
            'item': {
              '_id': '57d05fbe686d280c5a863b33',
              'name': 'Lightning Shard',
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 1,
              'gatheringJob': 'None',
              'gatheringEffort': 1,
              'priceHQ': 0,
              'price': 192,
              '__v': 0,
              'soldOnMarket': false,
              'inStock': 0,
              'discount': 0,
              'lastPriceUpdate': '2017-01-01T17:04:42.478Z',
              'ageMultiplier': 18.32,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f688421',
            'amount': 150,
            'step': 'Gather',
            'item': {
              '_id': '57d05fe0686d280c5a863b3f',
              'name': 'Fleece',
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 1,
              'gatheringJob': 'None',
              'gatheringEffort': 1,
              'priceHQ': 1500,
              'price': 999,
              '__v': 0,
              'soldOnMarket': false,
              'inStock': 0,
              'discount': 0,
              'lastPriceUpdate': '2016-10-02T09:32:16.576Z',
              'ageMultiplier': 8.69,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f688423',
            'amount': 75,
            'step': 'Gather',
            'item': {
              '_id': '57cdbb4c48ce3f24ea87a388',
              'name': 'Grenade Ash',
              'gatheringLevel': 0,
              'gatheringJob': 'Miner',
              'gatheringEffort': 10,
              'priceHQ': 500,
              'price': 280,
              '__v': 0,
              'lastPriceUpdate': '2016-09-26T07:32:11.826Z',
              'ageMultiplier': 11.16,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f688422',
            'amount': 75,
            'recipe': {
              '_id': '57dd391b0febcb5d9dde9734',
              'craftingLevel': 25,
              'craftingJob': 'Alchemist',
              'outputs': [
                {
                  'item': '57cdd64a15f5ab268ab86d5e',
                  '_id': '57dd391b0febcb5d9dde9735',
                  'amount': 1
                }
              ],
              'inputs': [
                {
                  'item': '57dd336e29bed45d2804a40f',
                  '_id': '57dd391b0febcb5d9dde9736',
                  'amount': 2
                },
                {
                  'item': '57dd391b0febcb5d9dde9737',
                  '_id': '57dd391c0febcb5d9dde9739',
                  'amount': 1
                },
                {
                  'item': '57dd391b0febcb5d9dde9738',
                  '_id': '57dd391c0febcb5d9dde973a',
                  'amount': 1
                }
              ],
              '__v': 0
            },
            'step': 'Craft',
            'item': {
              '_id': '57cdd64a15f5ab268ab86d5e',
              'name': 'Natron',
              'gatheringLevel': 0,
              'gatheringJob': 'None',
              'gatheringEffort': 0,
              'priceHQ': 1995,
              'price': 1000,
              '__v': 0,
              'canBeOrderedByUnprivileged': false,
              'soldOnMarket': false,
              'inStock': 0,
              'discount': 0,
              'lastPriceUpdate': '2016-10-02T11:04:29.977Z',
              'ageMultiplier': 8.02,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [
              {
                '_id': '586c206f25fb900f3f688452',
                'amount': 150,
                'step': 'Gather',
                'item': {
                  '_id': '57dd336e29bed45d2804a40f',
                  'name': 'Water Shard',
                  'discount': 0,
                  'inStock': 0,
                  'soldOnMarket': false,
                  'canBeOrderedByUnprivileged': false,
                  'gatheringLevel': 1,
                  'gatheringJob': 'None',
                  'gatheringEffort': 1,
                  'priceHQ': 0,
                  'price': 178,
                  '__v': 0,
                  'lastPriceUpdate': '2017-01-01T17:04:08.644Z',
                  'ageMultiplier': 52.05,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              },
              {
                '_id': '586c206f25fb900f3f688454',
                'amount': 75,
                'step': 'Gather',
                'item': {
                  '_id': '57dd391b0febcb5d9dde9738',
                  'name': 'Rock Salt',
                  'discount': 0,
                  'inStock': 0,
                  'soldOnMarket': false,
                  'canBeOrderedByUnprivileged': false,
                  'gatheringLevel': 12,
                  'gatheringJob': 'Miner',
                  'gatheringEffort': 1,
                  'priceHQ': 0,
                  'price': 3,
                  '__v': 0,
                  'lastPriceUpdate': '2016-09-30T12:48:55.507Z',
                  'ageMultiplier': 8.02,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              },
              {
                '_id': '586c206f25fb900f3f688453',
                'amount': 75,
                'step': 'Gather',
                'item': {
                  '_id': '57dd391b0febcb5d9dde9737',
                  'name': 'Effervescent Water',
                  'discount': 0,
                  'inStock': 0,
                  'soldOnMarket': false,
                  'canBeOrderedByUnprivileged': false,
                  'gatheringLevel': 24,
                  'gatheringJob': 'Miner',
                  'gatheringEffort': 1,
                  'priceHQ': 432,
                  'price': 389,
                  '__v': 0,
                  'lastPriceUpdate': '2016-10-08T15:00:50.965Z',
                  'ageMultiplier': 9.01,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              }
            ],
            'hq': false,
            '__v': 0
          }
        ],
        'hq': false,
        '__v': 0
      },
      {
        '_id': '586c206f25fb900f3f6883f8',
        'amount': 75,
        'recipe': {
          '_id': '57dd332729bed45d2804a3f3',
          'craftingLevel': 16,
          'craftingJob': 'Blacksmith',
          'outputs': [
            {
              'item': '57dd332729bed45d2804a3f4',
              '_id': '57dd332829bed45d2804a3f7',
              'amount': 1
            }
          ],
          'inputs': [
            {
              'item': '57cda969bfe7852417f888c4',
              '_id': '57dd332729bed45d2804a3f5',
              'amount': 1
            },
            {
              'item': '57cda9151a887b23bd8ff879',
              '_id': '57dd332729bed45d2804a3f6',
              'amount': 1
            }
          ],
          '__v': 0
        },
        'step': 'Craft',
        'item': {
          '_id': '57dd332729bed45d2804a3f4',
          'name': 'Iron Nails',
          'discount': 0,
          'inStock': 0,
          'soldOnMarket': false,
          'canBeOrderedByUnprivileged': false,
          'gatheringLevel': 0,
          'gatheringJob': 'None',
          'gatheringEffort': 0,
          'priceHQ': 0,
          'price': 900,
          '__v': 0,
          'lastPriceUpdate': '2016-09-26T08:07:36.942Z',
          'ageMultiplier': 4,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [
          {
            '_id': '586c206f25fb900f3f688424',
            'amount': 75,
            'step': 'Gather',
            'item': {
              '_id': '57cda969bfe7852417f888c4',
              'name': 'Fire Shard',
              'gatheringLevel': 1,
              'gatheringJob': 'None',
              'gatheringEffort': 1,
              'priceHQ': 0,
              'price': 159,
              '__v': 0,
              'canBeOrderedByUnprivileged': false,
              'soldOnMarket': false,
              'inStock': 0,
              'discount': 0,
              'lastPriceUpdate': '2017-01-01T17:03:30.297Z',
              'ageMultiplier': 94.4,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f688425',
            'amount': 75,
            'recipe': {
              '_id': '57cda981bfe7852417f888c5',
              'craftingLevel': 16,
              'craftingJob': 'Blacksmith',
              'outputs': [
                {
                  'item': '57cda9151a887b23bd8ff879',
                  '_id': '57cdb271d1dcaf2448a664d4',
                  'amount': 1
                }
              ],
              'inputs': [
                {
                  'item': '57cda964bfe7852417f888c3',
                  '_id': '57cdb271d1dcaf2448a664d6',
                  'amount': 3
                },
                {
                  'item': '57cda969bfe7852417f888c4',
                  '_id': '57cdb271d1dcaf2448a664d5',
                  'amount': 1
                }
              ],
              '__v': 0
            },
            'step': 'Buy',
            'item': {
              '_id': '57cda9151a887b23bd8ff879',
              'name': 'Iron Ingot',
              'gatheringLevel': 0,
              'gatheringJob': 'Botanist',
              'gatheringEffort': 0,
              'priceHQ': 1999,
              'price': 302,
              '__v': 0,
              'lastPriceUpdate': '2016-09-26T07:31:21.306Z',
              'ageMultiplier': 4,
              'canBeOrderedByUnprivileged': false,
              'soldOnMarket': false,
              'inStock': 0,
              'discount': 0,
              'datedObject': false,
              'availableFromNpc': true,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [
              {
                '_id': '586c206f25fb900f3f688455',
                'amount': 225,
                'step': 'Gather',
                'item': {
                  '_id': '57cda964bfe7852417f888c3',
                  'name': 'Iron Ore',
                  'gatheringLevel': 14,
                  'gatheringJob': 'Miner',
                  'gatheringEffort': 1,
                  'priceHQ': 900,
                  'price': 18,
                  '__v': 0,
                  'lastPriceUpdate': '2017-01-01T17:04:33.620Z',
                  'ageMultiplier': 29.4,
                  'canBeOrderedByUnprivileged': false,
                  'soldOnMarket': false,
                  'inStock': 0,
                  'discount': 0,
                  'datedObject': false,
                  'availableFromNpc': false,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              },
              {
                '_id': '586c206f25fb900f3f688456',
                'amount': 75,
                'step': 'Gather',
                'item': {
                  '_id': '57cda969bfe7852417f888c4',
                  'name': 'Fire Shard',
                  'gatheringLevel': 1,
                  'gatheringJob': 'None',
                  'gatheringEffort': 1,
                  'priceHQ': 0,
                  'price': 159,
                  '__v': 0,
                  'canBeOrderedByUnprivileged': false,
                  'soldOnMarket': false,
                  'inStock': 0,
                  'discount': 0,
                  'lastPriceUpdate': '2017-01-01T17:03:30.297Z',
                  'ageMultiplier': 94.4,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              }
            ],
            'hq': false,
            '__v': 0
          }
        ],
        'hq': false,
        '__v': 0
      },
      {
        '_id': '586c206f25fb900f3f688403',
        'amount': 6,
        'recipe': {
          '_id': '57dd398f0febcb5d9dde973b',
          'craftingLevel': 60,
          'craftingJob': 'Alchemist',
          'outputs': [
            {
              'item': '57dd3165ec158f5b6b75b440',
              '_id': '57dd398f0febcb5d9dde973c',
              'amount': 1
            }
          ],
          'inputs': [
            {
              'item': '57cfbd439567fb3285215691',
              '_id': '57dd398f0febcb5d9dde973d',
              'amount': 2
            },
            {
              'item': '57cfbd969567fb32852156b7',
              '_id': '57dd398f0febcb5d9dde973e',
              'amount': 2
            },
            {
              'item': '57dd398f0febcb5d9dde9740',
              '_id': '57dd39900febcb5d9dde9741',
              'amount': 1
            },
            {
              'item': '57dd398f0febcb5d9dde973f',
              '_id': '57dd39900febcb5d9dde9742',
              'amount': 3
            }
          ],
          '__v': 0
        },
        'step': 'Craft',
        'item': {
          '_id': '57dd3165ec158f5b6b75b440',
          'name': 'Dravanian Down Tree',
          'discount': 0,
          'inStock': 0,
          'soldOnMarket': false,
          'canBeOrderedByUnprivileged': false,
          'gatheringLevel': 0,
          'gatheringJob': 'None',
          'gatheringEffort': 0,
          'priceHQ': 0,
          'price': 307993,
          '__v': 0,
          'lastPriceUpdate': '2016-09-26T08:10:08.470Z',
          'ageMultiplier': 1.96,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [
          {
            '_id': '586c206f25fb900f3f68842b',
            'amount': 12,
            'step': 'Gather',
            'item': {
              '_id': '57cfbd439567fb3285215691',
              'name': 'Lightning Cluster',
              'gatheringLevel': 50,
              'gatheringJob': 'None',
              'gatheringEffort': -45,
              'priceHQ': 0,
              'price': 1450,
              '__v': 0,
              'canBeOrderedByUnprivileged': false,
              'lastPriceUpdate': '2016-09-26T07:45:04.341Z',
              'ageMultiplier': 10.09,
              'soldOnMarket': false,
              'inStock': 0,
              'discount': 0,
              'datedObject': false,
              'availableFromNpc': false,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f68842d',
            'amount': 6,
            'step': 'Gather',
            'item': {
              '_id': '57dd398f0febcb5d9dde9740',
              'name': 'Dravanian Mote',
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 0,
              'gatheringJob': 'None',
              'gatheringEffort': 200,
              'priceHQ': 0,
              'price': 64500,
              '__v': 0,
              'lastPriceUpdate': '2016-09-26T08:14:33.936Z',
              'ageMultiplier': 1.96,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f68842c',
            'amount': 12,
            'step': 'Gather',
            'item': {
              '_id': '57cfbd969567fb32852156b7',
              'name': 'Water Cluster',
              'gatheringLevel': 50,
              'gatheringJob': 'None',
              'gatheringEffort': -45,
              'priceHQ': 0,
              'price': 1500,
              '__v': 0,
              'canBeOrderedByUnprivileged': false,
              'lastPriceUpdate': '2017-01-01T17:05:32.419Z',
              'ageMultiplier': 11.68,
              'soldOnMarket': false,
              'inStock': 0,
              'discount': 0,
              'datedObject': false,
              'availableFromNpc': false,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f68842e',
            'amount': 18,
            'recipe': {
              '_id': '57dd41100febcb5d9dde9783',
              'craftingLevel': 58,
              'craftingJob': 'Alchemist',
              'outputs': [
                {
                  'item': '57dd398f0febcb5d9dde973f',
                  '_id': '57dd41100febcb5d9dde9784',
                  'amount': 1
                }
              ],
              'inputs': [
                {
                  'item': '57dd3c5f0febcb5d9dde9765',
                  '_id': '57dd41100febcb5d9dde9785',
                  'amount': 5
                },
                {
                  'item': '57dd41100febcb5d9dde9787',
                  '_id': '57dd41100febcb5d9dde9789',
                  'amount': 1
                },
                {
                  'item': '57dd41100febcb5d9dde9788',
                  '_id': '57dd41100febcb5d9dde978a',
                  'amount': 3
                },
                {
                  'item': '57dd41100febcb5d9dde9786',
                  '_id': '57dd41100febcb5d9dde978b',
                  'amount': 2
                }
              ],
              '__v': 0
            },
            'step': 'Craft',
            'item': {
              '_id': '57dd398f0febcb5d9dde973f',
              'name': 'Growth Formula Zeta',
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 0,
              'gatheringJob': 'None',
              'gatheringEffort': 0,
              'priceHQ': 18000,
              'price': 18000,
              '__v': 0,
              'lastPriceUpdate': '2016-09-26T08:14:52.944Z',
              'ageMultiplier': 2.68,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [
              {
                '_id': '586c206f25fb900f3f68845e',
                'amount': 54,
                'step': 'Gather',
                'item': {
                  '_id': '57dd41100febcb5d9dde9788',
                  'name': 'Rue',
                  'discount': 0,
                  'inStock': 0,
                  'soldOnMarket': false,
                  'canBeOrderedByUnprivileged': false,
                  'gatheringLevel': 58,
                  'gatheringJob': 'Botanist',
                  'gatheringEffort': 1,
                  'priceHQ': 585,
                  'price': 569,
                  '__v': 0,
                  'lastPriceUpdate': '2016-09-26T08:20:02.104Z',
                  'ageMultiplier': 4.84,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              },
              {
                '_id': '586c206f25fb900f3f68845d',
                'amount': 18,
                'step': 'Gather',
                'item': {
                  '_id': '57dd41100febcb5d9dde9787',
                  'name': 'Dhalmel Saliva',
                  'discount': 0,
                  'inStock': 0,
                  'soldOnMarket': false,
                  'canBeOrderedByUnprivileged': false,
                  'gatheringLevel': 0,
                  'gatheringJob': 'None',
                  'gatheringEffort': 10,
                  'priceHQ': 416,
                  'price': 314,
                  '__v': 0,
                  'lastPriceUpdate': '2016-11-12T20:53:52.211Z',
                  'ageMultiplier': 2.68,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              },
              {
                '_id': '586c206f25fb900f3f68845c',
                'amount': 90,
                'step': 'Gather',
                'item': {
                  '_id': '57dd3c5f0febcb5d9dde9765',
                  'name': 'Water Crystal',
                  'discount': 0,
                  'inStock': 0,
                  'soldOnMarket': false,
                  'canBeOrderedByUnprivileged': false,
                  'gatheringLevel': 30,
                  'gatheringJob': 'None',
                  'gatheringEffort': -27,
                  'priceHQ': 0,
                  'price': 150,
                  '__v': 0,
                  'lastPriceUpdate': '2017-01-01T17:01:41.357Z',
                  'ageMultiplier': 110.12,
                  'datedObject': false,
                  'availableFromNpc': false,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              },
              {
                '_id': '586c206f25fb900f3f68845f',
                'amount': 36,
                'step': 'Gather',
                'item': {
                  '_id': '57dd41100febcb5d9dde9786',
                  'name': 'Red Quartz',
                  'discount': 0,
                  'inStock': 0,
                  'soldOnMarket': false,
                  'canBeOrderedByUnprivileged': false,
                  'gatheringLevel': 58,
                  'gatheringJob': 'Miner',
                  'gatheringEffort': 1,
                  'priceHQ': 11500,
                  'price': 6499,
                  '__v': 0,
                  'lastPriceUpdate': '2016-09-26T08:20:20.007Z',
                  'ageMultiplier': 3.76,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              }
            ],
            'hq': false,
            '__v': 0
          }
        ],
        'hq': false,
        '__v': 0
      },
      {
        '_id': '586c206f25fb900f3f688408',
        'amount': 75,
        'recipe': {
          '_id': '57dd388b0febcb5d9dde9711',
          'craftingLevel': 27,
          'craftingJob': 'Blacksmith',
          'outputs': [
            {
              'item': '57dd3165ec158f5b6b75b438',
              '_id': '57dd388b0febcb5d9dde9712',
              'amount': 1
            }
          ],
          'inputs': [
            {
              'item': '57cda969bfe7852417f888c4',
              '_id': '57dd388b0febcb5d9dde9713',
              'amount': 3
            },
            {
              'item': '57cdbc2615751d255aa73ccb',
              '_id': '57dd388b0febcb5d9dde9714',
              'amount': 1
            }
          ],
          '__v': 0
        },
        'step': 'Craft',
        'item': {
          '_id': '57dd3165ec158f5b6b75b438',
          'name': 'Steel Nails',
          'discount': 0,
          'inStock': 0,
          'soldOnMarket': false,
          'canBeOrderedByUnprivileged': false,
          'gatheringLevel': 0,
          'gatheringJob': 'None',
          'gatheringEffort': 0,
          'priceHQ': 208,
          'price': 130,
          '__v': 0,
          'lastPriceUpdate': '2016-09-26T08:04:03.973Z',
          'ageMultiplier': 4,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [
          {
            '_id': '586c206f25fb900f3f68842f',
            'amount': 225,
            'step': 'Gather',
            'item': {
              '_id': '57cda969bfe7852417f888c4',
              'name': 'Fire Shard',
              'gatheringLevel': 1,
              'gatheringJob': 'None',
              'gatheringEffort': 1,
              'priceHQ': 0,
              'price': 159,
              '__v': 0,
              'canBeOrderedByUnprivileged': false,
              'soldOnMarket': false,
              'inStock': 0,
              'discount': 0,
              'lastPriceUpdate': '2017-01-01T17:03:30.297Z',
              'ageMultiplier': 94.4,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f688430',
            'amount': 75,
            'recipe': {
              '_id': '57cdbbff15751d255aa73cca',
              'craftingLevel': 26,
              'craftingJob': 'Armorer',
              'outputs': [
                {
                  'item': '57cdbc2615751d255aa73ccb',
                  '_id': '57cdbc7615751d255aa73ce1',
                  'amount': 1
                }
              ],
              'inputs': [
                {
                  'item': '57cda964bfe7852417f888c3',
                  '_id': '57cdbc7615751d255aa73ce4',
                  'amount': 2
                },
                {
                  'item': '57cdbb5d15751d255aa73cbf',
                  '_id': '57cdbc7615751d255aa73ce3',
                  'amount': 2
                },
                {
                  'item': '57cdbb4748ce3f24ea87a387',
                  '_id': '57cdbc7615751d255aa73ce2',
                  'amount': 1
                }
              ],
              '__v': 0
            },
            'step': 'Buy',
            'item': {
              '_id': '57cdbc2615751d255aa73ccb',
              'name': 'Steel Ingot',
              'gatheringLevel': 0,
              'gatheringJob': 'None',
              'gatheringEffort': 0,
              'priceHQ': 3699,
              'price': 258,
              '__v': 0,
              'lastPriceUpdate': '2016-10-29T14:00:41.151Z',
              'ageMultiplier': 6.51,
              'canBeOrderedByUnprivileged': false,
              'soldOnMarket': false,
              'inStock': 0,
              'discount': 0,
              'datedObject': false,
              'availableFromNpc': true,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [
              {
                '_id': '586c206f25fb900f3f688462',
                'amount': 75,
                'step': 'Gather',
                'item': {
                  '_id': '57cdbb4748ce3f24ea87a387',
                  'name': 'Bomb Ash',
                  'gatheringLevel': 0,
                  'gatheringJob': 'Miner',
                  'gatheringEffort': 5,
                  'priceHQ': 803,
                  'price': 300,
                  '__v': 0,
                  'lastPriceUpdate': '2016-09-30T13:11:04.533Z',
                  'ageMultiplier': 6.51,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              },
              {
                '_id': '586c206f25fb900f3f688460',
                'amount': 150,
                'step': 'Gather',
                'item': {
                  '_id': '57cda964bfe7852417f888c3',
                  'name': 'Iron Ore',
                  'gatheringLevel': 14,
                  'gatheringJob': 'Miner',
                  'gatheringEffort': 1,
                  'priceHQ': 900,
                  'price': 18,
                  '__v': 0,
                  'lastPriceUpdate': '2017-01-01T17:04:33.620Z',
                  'ageMultiplier': 29.4,
                  'canBeOrderedByUnprivileged': false,
                  'soldOnMarket': false,
                  'inStock': 0,
                  'discount': 0,
                  'datedObject': false,
                  'availableFromNpc': false,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              },
              {
                '_id': '586c206f25fb900f3f688461',
                'amount': 150,
                'step': 'Gather',
                'item': {
                  '_id': '57cdbb5d15751d255aa73cbf',
                  'name': 'Ice Shard',
                  'gatheringLevel': 1,
                  'gatheringJob': 'None',
                  'gatheringEffort': 1,
                  'priceHQ': 0,
                  'price': 189,
                  '__v': 0,
                  'canBeOrderedByUnprivileged': false,
                  'soldOnMarket': false,
                  'inStock': 0,
                  'discount': 0,
                  'lastPriceUpdate': '2017-01-01T17:08:26.007Z',
                  'ageMultiplier': 15.94,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              }
            ],
            'hq': false,
            '__v': 0
          }
        ],
        'hq': false,
        '__v': 0
      },
      {
        '_id': '586c206f25fb900f3f68840c',
        'amount': 9,
        'recipe': {
          '_id': '57dd39bc0febcb5d9dde9743',
          'craftingLevel': 56,
          'craftingJob': 'Blacksmith',
          'outputs': [
            {
              'item': '57dd3165ec158f5b6b75b442',
              '_id': '57dd39bc0febcb5d9dde9744',
              'amount': 1
            }
          ],
          'inputs': [
            {
              'item': '57cdd64a15f5ab268ab86d63',
              '_id': '57dd39bc0febcb5d9dde9747',
              'amount': 4
            },
            {
              'item': '57dd39bc0febcb5d9dde9745',
              '_id': '57dd39bc0febcb5d9dde9748',
              'amount': 5
            },
            {
              'item': '57dd39bc0febcb5d9dde9746',
              '_id': '57dd39bd0febcb5d9dde9749',
              'amount': 1
            }
          ],
          '__v': 0
        },
        'step': 'Craft',
        'item': {
          '_id': '57dd3165ec158f5b6b75b442',
          'name': 'Titanium Ingot',
          'discount': 0,
          'inStock': 0,
          'soldOnMarket': false,
          'canBeOrderedByUnprivileged': false,
          'gatheringLevel': 0,
          'gatheringJob': 'None',
          'gatheringEffort': 0,
          'priceHQ': 9000,
          'price': 7500,
          '__v': 0,
          'lastPriceUpdate': '2016-11-02T18:51:15.640Z',
          'ageMultiplier': 2.71,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [
          {
            '_id': '586c206f25fb900f3f688431',
            'amount': 36,
            'step': 'Gather',
            'item': {
              '_id': '57cdd64a15f5ab268ab86d63',
              'name': 'Cloud Mica',
              'gatheringLevel': 60,
              'gatheringJob': 'Miner',
              'gatheringEffort': 1,
              'priceHQ': 1500,
              'price': 740,
              '__v': 0,
              'canBeOrderedByUnprivileged': false,
              'soldOnMarket': false,
              'inStock': 0,
              'discount': 0,
              'lastPriceUpdate': '2016-10-27T14:01:30.790Z',
              'ageMultiplier': 5.27,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f688432',
            'amount': 45,
            'step': 'Gather',
            'item': {
              '_id': '57dd39bc0febcb5d9dde9745',
              'name': 'Fire Crystal',
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 30,
              'gatheringJob': 'None',
              'gatheringEffort': -27,
              'priceHQ': 0,
              'price': 35,
              '__v': 0,
              'lastPriceUpdate': '2017-01-01T17:01:50.387Z',
              'ageMultiplier': 15.8,
              'datedObject': false,
              'availableFromNpc': false,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f688433',
            'amount': 9,
            'recipe': {
              '_id': '57dd418a0febcb5d9dde978c',
              'craftingLevel': 54,
              'craftingJob': 'Blacksmith',
              'outputs': [
                {
                  'item': '57dd39bc0febcb5d9dde9746',
                  '_id': '57dd418a0febcb5d9dde978d',
                  'amount': 1
                }
              ],
              'inputs': [
                {
                  'item': '57dd39bc0febcb5d9dde9745',
                  '_id': '57dd418a0febcb5d9dde978e',
                  'amount': 4
                },
                {
                  'item': '57cda964bfe7852417f888c3',
                  '_id': '57dd418a0febcb5d9dde978f',
                  'amount': 1
                },
                {
                  'item': '57cdbb4c48ce3f24ea87a388',
                  '_id': '57dd418a0febcb5d9dde9790',
                  'amount': 1
                },
                {
                  'item': '57dd418a0febcb5d9dde9791',
                  '_id': '57dd418c0febcb5d9dde9792',
                  'amount': 5
                }
              ],
              '__v': 0
            },
            'step': 'Craft',
            'item': {
              '_id': '57dd39bc0febcb5d9dde9746',
              'name': 'Titanium Nugget',
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 0,
              'gatheringJob': 'None',
              'gatheringEffort': 0,
              'priceHQ': 11946,
              'price': 4399,
              '__v': 0,
              'lastPriceUpdate': '2016-09-26T08:18:01.675Z',
              'ageMultiplier': 2.85,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [
              {
                '_id': '586c206f25fb900f3f688463',
                'amount': 36,
                'step': 'Gather',
                'item': {
                  '_id': '57dd39bc0febcb5d9dde9745',
                  'name': 'Fire Crystal',
                  'discount': 0,
                  'inStock': 0,
                  'soldOnMarket': false,
                  'canBeOrderedByUnprivileged': false,
                  'gatheringLevel': 30,
                  'gatheringJob': 'None',
                  'gatheringEffort': -27,
                  'priceHQ': 0,
                  'price': 35,
                  '__v': 0,
                  'lastPriceUpdate': '2017-01-01T17:01:50.387Z',
                  'ageMultiplier': 15.8,
                  'datedObject': false,
                  'availableFromNpc': false,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              },
              {
                '_id': '586c206f25fb900f3f688464',
                'amount': 9,
                'step': 'Gather',
                'item': {
                  '_id': '57cda964bfe7852417f888c3',
                  'name': 'Iron Ore',
                  'gatheringLevel': 14,
                  'gatheringJob': 'Miner',
                  'gatheringEffort': 1,
                  'priceHQ': 900,
                  'price': 18,
                  '__v': 0,
                  'lastPriceUpdate': '2017-01-01T17:04:33.620Z',
                  'ageMultiplier': 29.4,
                  'canBeOrderedByUnprivileged': false,
                  'soldOnMarket': false,
                  'inStock': 0,
                  'discount': 0,
                  'datedObject': false,
                  'availableFromNpc': false,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              },
              {
                '_id': '586c206f25fb900f3f688465',
                'amount': 9,
                'step': 'Gather',
                'item': {
                  '_id': '57cdbb4c48ce3f24ea87a388',
                  'name': 'Grenade Ash',
                  'gatheringLevel': 0,
                  'gatheringJob': 'Miner',
                  'gatheringEffort': 10,
                  'priceHQ': 500,
                  'price': 280,
                  '__v': 0,
                  'lastPriceUpdate': '2016-09-26T07:32:11.826Z',
                  'ageMultiplier': 11.16,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              },
              {
                '_id': '586c206f25fb900f3f688466',
                'amount': 45,
                'step': 'Gather',
                'item': {
                  '_id': '57dd418a0febcb5d9dde9791',
                  'name': 'Titanium Ore',
                  'discount': 0,
                  'inStock': 0,
                  'soldOnMarket': false,
                  'canBeOrderedByUnprivileged': false,
                  'gatheringLevel': 55,
                  'gatheringJob': 'Miner',
                  'gatheringEffort': 3,
                  'priceHQ': 12999,
                  'price': 900,
                  '__v': 0,
                  'lastPriceUpdate': '2016-09-29T15:49:24.486Z',
                  'ageMultiplier': 6.25,
                  'datedObject': false,
                  'availableFromNpc': false,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              }
            ],
            'hq': false,
            '__v': 0
          }
        ],
        'hq': false,
        '__v': 0
      },
      holyCedarLumberStep,
      {
        '_id': '586c206f25fb900f3f68840a',
        'amount': 150,
        'recipe': {
          '_id': '57dd38a40febcb5d9dde9715',
          'craftingLevel': 56,
          'craftingJob': 'Carpenter',
          'outputs': [
            {
              'item': '57dd3165ec158f5b6b75b43a',
              '_id': '57dd38a40febcb5d9dde9716',
              'amount': 1
            }
          ],
          'inputs': [
            {
              'item': '57dd337c29bed45d2804a418',
              '_id': '57dd38a40febcb5d9dde9717',
              'amount': 5
            },
            {
              'item': '57dd3088ec158f5b6b75b433',
              '_id': '57dd38a40febcb5d9dde9718',
              'amount': 1
            },
            {
              'item': '57dd38a40febcb5d9dde9719',
              '_id': '57dd38a50febcb5d9dde971a',
              'amount': 2
            }
          ],
          '__v': 0
        },
        'step': 'Craft',
        'item': {
          '_id': '57dd3165ec158f5b6b75b43a',
          'name': 'Hallowed Chestnut Lumber',
          'discount': 0,
          'inStock': 0,
          'soldOnMarket': false,
          'canBeOrderedByUnprivileged': false,
          'gatheringLevel': 0,
          'gatheringJob': 'None',
          'gatheringEffort': 0,
          'priceHQ': 7900,
          'price': 5000,
          '__v': 0,
          'lastPriceUpdate': '2016-10-02T11:36:54.188Z',
          'ageMultiplier': 8.37,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [
          {
            '_id': '586c206f25fb900f3f68843a',
            'amount': 750,
            'step': 'Gather',
            'item': {
              '_id': '57dd337c29bed45d2804a418',
              'name': 'Wind Crystal',
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 30,
              'gatheringJob': 'None',
              'gatheringEffort': -27,
              'priceHQ': 0,
              'price': 249,
              '__v': 0,
              'lastPriceUpdate': '2017-01-01T17:01:07.089Z',
              'ageMultiplier': 144.17,
              'datedObject': false,
              'availableFromNpc': false,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f68843c',
            'amount': 300,
            'recipe': {
              '_id': '57dd3c5f0febcb5d9dde9763',
              'craftingLevel': 56,
              'craftingJob': 'Alchemist',
              'outputs': [
                {
                  'item': '57dd38a40febcb5d9dde9719',
                  '_id': '57dd3c5f0febcb5d9dde9764',
                  'amount': 1
                }
              ],
              'inputs': [
                {
                  'item': '57dd3c5f0febcb5d9dde9765',
                  '_id': '57dd3c600febcb5d9dde9768',
                  'amount': 5
                },
                {
                  'item': '57dd3c5f0febcb5d9dde9767',
                  '_id': '57dd3c600febcb5d9dde9769',
                  'amount': 2
                },
                {
                  'item': '57dd3c5f0febcb5d9dde9766',
                  '_id': '57dd3c600febcb5d9dde976a',
                  'amount': 2
                }
              ],
              '__v': 0
            },
            'step': 'Craft',
            'item': {
              '_id': '57dd38a40febcb5d9dde9719',
              'name': 'Hallowed Water',
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 0,
              'gatheringJob': 'None',
              'gatheringEffort': 0,
              'priceHQ': 990,
              'price': 1900,
              '__v': 0,
              'lastPriceUpdate': '2016-10-15T21:14:51.853Z',
              'ageMultiplier': 15.63,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [
              {
                '_id': '586c206f25fb900f3f688469',
                'amount': 1500,
                'step': 'Gather',
                'item': {
                  '_id': '57dd3c5f0febcb5d9dde9765',
                  'name': 'Water Crystal',
                  'discount': 0,
                  'inStock': 0,
                  'soldOnMarket': false,
                  'canBeOrderedByUnprivileged': false,
                  'gatheringLevel': 30,
                  'gatheringJob': 'None',
                  'gatheringEffort': -27,
                  'priceHQ': 0,
                  'price': 150,
                  '__v': 0,
                  'lastPriceUpdate': '2017-01-01T17:01:41.357Z',
                  'ageMultiplier': 110.12,
                  'datedObject': false,
                  'availableFromNpc': false,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              },
              {
                '_id': '586c206f25fb900f3f68846a',
                'amount': 600,
                'step': 'Gather',
                'item': {
                  '_id': '57dd3c5f0febcb5d9dde9767',
                  'name': 'Abalathian Mistletoe',
                  'discount': 0,
                  'inStock': 0,
                  'soldOnMarket': false,
                  'canBeOrderedByUnprivileged': false,
                  'gatheringLevel': 58,
                  'gatheringJob': 'Botanist',
                  'gatheringEffort': 1,
                  'priceHQ': 5800,
                  'price': 3370,
                  '__v': 0,
                  'lastPriceUpdate': '2017-01-02T23:12:12.156Z',
                  'ageMultiplier': 28.16,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              },
              {
                '_id': '586c206f25fb900f3f68846b',
                'amount': 600,
                'step': 'Gather',
                'item': {
                  '_id': '57dd3c5f0febcb5d9dde9766',
                  'name': 'Abalathian Spring Water',
                  'discount': 0,
                  'inStock': 0,
                  'soldOnMarket': false,
                  'canBeOrderedByUnprivileged': false,
                  'gatheringLevel': 57,
                  'gatheringJob': 'Miner',
                  'gatheringEffort': 1,
                  'priceHQ': 1106,
                  'price': 998,
                  '__v': 0,
                  'lastPriceUpdate': '2016-09-26T08:18:18.326Z',
                  'ageMultiplier': 28.16,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              }
            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f68843b',
            'amount': 150,
            'recipe': {
              '_id': '57dd349e29bed45d2804a498',
              'craftingLevel': 54,
              'craftingJob': 'Carpenter',
              'outputs': [
                {
                  'item': '57dd3088ec158f5b6b75b433',
                  '_id': '57dd349e29bed45d2804a499',
                  'amount': 1
                }
              ],
              'inputs': [
                {
                  'item': '57dd337c29bed45d2804a418',
                  '_id': '57dd349e29bed45d2804a49a',
                  'amount': 4
                },
                {
                  'item': '57dd3165ec158f5b6b75b43f',
                  '_id': '57dd349e29bed45d2804a49b',
                  'amount': 5
                }
              ],
              '__v': 0
            },
            'step': 'Craft',
            'item': {
              '_id': '57dd3088ec158f5b6b75b433',
              'name': 'Dark Chestnut Lumber',
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 0,
              'gatheringJob': 'None',
              'gatheringEffort': 0,
              'priceHQ': 4840,
              'price': 3000,
              '__v': 0,
              'lastPriceUpdate': '2016-10-19T20:01:03.726Z',
              'ageMultiplier': 13.77,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [
              {
                '_id': '586c206f25fb900f3f688468',
                'amount': 750,
                'step': 'Gather',
                'item': {
                  '_id': '57dd3165ec158f5b6b75b43f',
                  'name': 'Dark Chestnut Log',
                  'discount': 0,
                  'inStock': 0,
                  'soldOnMarket': false,
                  'canBeOrderedByUnprivileged': false,
                  'gatheringLevel': 54,
                  'gatheringJob': 'Botanist',
                  'gatheringEffort': 2,
                  'priceHQ': 850,
                  'price': 400,
                  '__v': 0,
                  'lastPriceUpdate': '2016-11-05T12:57:44.607Z',
                  'ageMultiplier': 60.91,
                  'datedObject': false,
                  'availableFromNpc': false,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              },
              {
                '_id': '586c206f25fb900f3f688467',
                'amount': 600,
                'step': 'Gather',
                'item': {
                  '_id': '57dd337c29bed45d2804a418',
                  'name': 'Wind Crystal',
                  'discount': 0,
                  'inStock': 0,
                  'soldOnMarket': false,
                  'canBeOrderedByUnprivileged': false,
                  'gatheringLevel': 30,
                  'gatheringJob': 'None',
                  'gatheringEffort': -27,
                  'priceHQ': 0,
                  'price': 249,
                  '__v': 0,
                  'lastPriceUpdate': '2017-01-01T17:01:07.089Z',
                  'ageMultiplier': 144.17,
                  'datedObject': false,
                  'availableFromNpc': false,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              }
            ],
            'hq': false,
            '__v': 0
          }
        ],
        'hq': false,
        '__v': 0
      },
      {
        '_id': '586c206f25fb900f3f68840d',
        'amount': 3,
        'recipe': {
          '_id': '57dd39ca0febcb5d9dde974a',
          'craftingLevel': 56,
          'craftingJob': 'Weaver',
          'outputs': [
            {
              'item': '57dd3165ec158f5b6b75b444',
              '_id': '57dd39ca0febcb5d9dde974b',
              'amount': 1
            }
          ],
          'inputs': [
            {
              'item': '57dd38a40febcb5d9dde9719',
              '_id': '57dd39ca0febcb5d9dde974e',
              'amount': 2
            },
            {
              'item': '57dd39ca0febcb5d9dde974c',
              '_id': '57dd39ca0febcb5d9dde974f',
              'amount': 5
            },
            {
              'item': '57dd39ca0febcb5d9dde974d',
              '_id': '57dd39cb0febcb5d9dde9750',
              'amount': 1
            }
          ],
          '__v': 0
        },
        'step': 'Craft',
        'item': {
          '_id': '57dd3165ec158f5b6b75b444',
          'name': 'Hallowed Ramie Cloth',
          'discount': 0,
          'inStock': 0,
          'soldOnMarket': false,
          'canBeOrderedByUnprivileged': false,
          'gatheringLevel': 0,
          'gatheringJob': 'None',
          'gatheringEffort': 0,
          'priceHQ': 5999,
          'price': 5900,
          '__v': 0,
          'lastPriceUpdate': '2016-09-26T08:13:36.955Z',
          'ageMultiplier': 1.89,
          'unspoiledNodeTime': {
            'duration': 60
          }
        },
        'inputs': [
          {
            '_id': '586c206f25fb900f3f68843e',
            'amount': 15,
            'step': 'Gather',
            'item': {
              '_id': '57dd39ca0febcb5d9dde974c',
              'name': 'Lightning Crystal',
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 30,
              'gatheringJob': 'None',
              'gatheringEffort': -27,
              'priceHQ': 0,
              'price': 70,
              '__v': 0,
              'lastPriceUpdate': '2016-11-02T14:45:18.447Z',
              'ageMultiplier': 9.07,
              'datedObject': false,
              'availableFromNpc': false,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [

            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f68843d',
            'amount': 6,
            'recipe': {
              '_id': '57dd3c5f0febcb5d9dde9763',
              'craftingLevel': 56,
              'craftingJob': 'Alchemist',
              'outputs': [
                {
                  'item': '57dd38a40febcb5d9dde9719',
                  '_id': '57dd3c5f0febcb5d9dde9764',
                  'amount': 1
                }
              ],
              'inputs': [
                {
                  'item': '57dd3c5f0febcb5d9dde9765',
                  '_id': '57dd3c600febcb5d9dde9768',
                  'amount': 5
                },
                {
                  'item': '57dd3c5f0febcb5d9dde9767',
                  '_id': '57dd3c600febcb5d9dde9769',
                  'amount': 2
                },
                {
                  'item': '57dd3c5f0febcb5d9dde9766',
                  '_id': '57dd3c600febcb5d9dde976a',
                  'amount': 2
                }
              ],
              '__v': 0
            },
            'step': 'Craft',
            'item': {
              '_id': '57dd38a40febcb5d9dde9719',
              'name': 'Hallowed Water',
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 0,
              'gatheringJob': 'None',
              'gatheringEffort': 0,
              'priceHQ': 990,
              'price': 1900,
              '__v': 0,
              'lastPriceUpdate': '2016-10-15T21:14:51.853Z',
              'ageMultiplier': 15.63,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [
              {
                '_id': '586c206f25fb900f3f68846c',
                'amount': 30,
                'step': 'Gather',
                'item': {
                  '_id': '57dd3c5f0febcb5d9dde9765',
                  'name': 'Water Crystal',
                  'discount': 0,
                  'inStock': 0,
                  'soldOnMarket': false,
                  'canBeOrderedByUnprivileged': false,
                  'gatheringLevel': 30,
                  'gatheringJob': 'None',
                  'gatheringEffort': -27,
                  'priceHQ': 0,
                  'price': 150,
                  '__v': 0,
                  'lastPriceUpdate': '2017-01-01T17:01:41.357Z',
                  'ageMultiplier': 110.12,
                  'datedObject': false,
                  'availableFromNpc': false,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              },
              {
                '_id': '586c206f25fb900f3f68846e',
                'amount': 12,
                'step': 'Gather',
                'item': {
                  '_id': '57dd3c5f0febcb5d9dde9766',
                  'name': 'Abalathian Spring Water',
                  'discount': 0,
                  'inStock': 0,
                  'soldOnMarket': false,
                  'canBeOrderedByUnprivileged': false,
                  'gatheringLevel': 57,
                  'gatheringJob': 'Miner',
                  'gatheringEffort': 1,
                  'priceHQ': 1106,
                  'price': 998,
                  '__v': 0,
                  'lastPriceUpdate': '2016-09-26T08:18:18.326Z',
                  'ageMultiplier': 28.16,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              },
              {
                '_id': '586c206f25fb900f3f68846d',
                'amount': 12,
                'step': 'Gather',
                'item': {
                  '_id': '57dd3c5f0febcb5d9dde9767',
                  'name': 'Abalathian Mistletoe',
                  'discount': 0,
                  'inStock': 0,
                  'soldOnMarket': false,
                  'canBeOrderedByUnprivileged': false,
                  'gatheringLevel': 58,
                  'gatheringJob': 'Botanist',
                  'gatheringEffort': 1,
                  'priceHQ': 5800,
                  'price': 3370,
                  '__v': 0,
                  'lastPriceUpdate': '2017-01-02T23:12:12.156Z',
                  'ageMultiplier': 28.16,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              }
            ],
            'hq': false,
            '__v': 0
          },
          {
            '_id': '586c206f25fb900f3f68843f',
            'amount': 3,
            'recipe': {
              '_id': '57dd3b910febcb5d9dde9751',
              'craftingLevel': 54,
              'craftingJob': 'Weaver',
              'outputs': [
                {
                  'item': '57dd39ca0febcb5d9dde974d',
                  '_id': '57dd3b910febcb5d9dde9752',
                  'amount': 1
                }
              ],
              'inputs': [
                {
                  'item': '57dd39ca0febcb5d9dde974c',
                  '_id': '57dd3b910febcb5d9dde9753',
                  'amount': 4
                },
                {
                  'item': '57dd3b910febcb5d9dde9754',
                  '_id': '57dd3b930febcb5d9dde9756',
                  'amount': 1
                },
                {
                  'item': '57dd3b910febcb5d9dde9755',
                  '_id': '57dd3b930febcb5d9dde9757',
                  'amount': 2
                }
              ],
              '__v': 0
            },
            'step': 'Craft',
            'item': {
              '_id': '57dd39ca0febcb5d9dde974d',
              'name': 'Ramie Cloth',
              'discount': 0,
              'inStock': 0,
              'soldOnMarket': false,
              'canBeOrderedByUnprivileged': false,
              'gatheringLevel': 0,
              'gatheringJob': 'None',
              'gatheringEffort': 0,
              'priceHQ': 20899,
              'price': 8000,
              '__v': 0,
              'lastPriceUpdate': '2016-09-26T08:15:11.126Z',
              'ageMultiplier': 1.89,
              'unspoiledNodeTime': {
                'duration': 60
              }
            },
            'inputs': [
              {
                '_id': '586c206f25fb900f3f68846f',
                'amount': 12,
                'step': 'Gather',
                'item': {
                  '_id': '57dd39ca0febcb5d9dde974c',
                  'name': 'Lightning Crystal',
                  'discount': 0,
                  'inStock': 0,
                  'soldOnMarket': false,
                  'canBeOrderedByUnprivileged': false,
                  'gatheringLevel': 30,
                  'gatheringJob': 'None',
                  'gatheringEffort': -27,
                  'priceHQ': 0,
                  'price': 70,
                  '__v': 0,
                  'lastPriceUpdate': '2016-11-02T14:45:18.447Z',
                  'ageMultiplier': 9.07,
                  'datedObject': false,
                  'availableFromNpc': false,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [

                ],
                'hq': false,
                '__v': 0
              },
              {
                '_id': '586c206f25fb900f3f688470',
                'amount': 3,
                'recipe': {
                  '_id': '57dd3bd90febcb5d9dde9758',
                  'craftingLevel': 32,
                  'craftingJob': 'Weaver',
                  'outputs': [
                    {
                      'item': '57dd3b910febcb5d9dde9754',
                      '_id': '57dd3bd90febcb5d9dde9759',
                      'amount': 1
                    }
                  ],
                  'inputs': [
                    {
                      'item': '57d05fbe686d280c5a863b33',
                      '_id': '57dd3bd90febcb5d9dde975a',
                      'amount': 3
                    },
                    {
                      'item': '57dd3bd90febcb5d9dde975b',
                      '_id': '57dd3bda0febcb5d9dde975c',
                      'amount': 2
                    }
                  ],
                  '__v': 0
                },
                'step': 'Buy',
                'item': {
                  '_id': '57dd3b910febcb5d9dde9754',
                  'name': 'Linen Yarn',
                  'discount': 0,
                  'inStock': 0,
                  'soldOnMarket': false,
                  'canBeOrderedByUnprivileged': false,
                  'gatheringLevel': 0,
                  'gatheringJob': 'None',
                  'gatheringEffort': 0,
                  'priceHQ': 2000,
                  'price': 186,
                  '__v': 0,
                  'lastPriceUpdate': '2016-09-26T08:19:24.843Z',
                  'ageMultiplier': 1.89,
                  'datedObject': false,
                  'availableFromNpc': true,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [
                  {
                    '_id': '586c207025fb900f3f688472',
                    'amount': 9,
                    'step': 'Gather',
                    'item': {
                      '_id': '57d05fbe686d280c5a863b33',
                      'name': 'Lightning Shard',
                      'canBeOrderedByUnprivileged': false,
                      'gatheringLevel': 1,
                      'gatheringJob': 'None',
                      'gatheringEffort': 1,
                      'priceHQ': 0,
                      'price': 192,
                      '__v': 0,
                      'soldOnMarket': false,
                      'inStock': 0,
                      'discount': 0,
                      'lastPriceUpdate': '2017-01-01T17:04:42.478Z',
                      'ageMultiplier': 18.32,
                      'unspoiledNodeTime': {
                        'duration': 60
                      }
                    },
                    'inputs': [

                    ],
                    'hq': false,
                    '__v': 0
                  },
                  {
                    '_id': '586c207025fb900f3f688473',
                    'amount': 6,
                    'step': 'Gather',
                    'item': {
                      '_id': '57dd3bd90febcb5d9dde975b',
                      'name': 'Flax',
                      'discount': 0,
                      'inStock': 0,
                      'soldOnMarket': false,
                      'canBeOrderedByUnprivileged': false,
                      'gatheringLevel': 31,
                      'gatheringJob': 'Botanist',
                      'gatheringEffort': 1,
                      'priceHQ': 500,
                      'price': 700,
                      '__v': 0,
                      'lastPriceUpdate': '2016-09-30T13:06:37.833Z',
                      'ageMultiplier': 4.04,
                      'unspoiledNodeTime': {
                        'duration': 60
                      }
                    },
                    'inputs': [

                    ],
                    'hq': false,
                    '__v': 0
                  }
                ],
                'hq': false,
                '__v': 0
              },
              {
                '_id': '586c206f25fb900f3f688471',
                'amount': 6,
                'recipe': {
                  '_id': '57dd3be40febcb5d9dde975d',
                  'craftingLevel': 54,
                  'craftingJob': 'Weaver',
                  'outputs': [
                    {
                      'item': '57dd3b910febcb5d9dde9755',
                      '_id': '57dd3be50febcb5d9dde975e',
                      'amount': 1
                    }
                  ],
                  'inputs': [
                    {
                      'item': '57dd39ca0febcb5d9dde974c',
                      '_id': '57dd3be50febcb5d9dde975f',
                      'amount': 4
                    },
                    {
                      'item': '57dd3bd90febcb5d9dde975b',
                      '_id': '57dd3be50febcb5d9dde9760',
                      'amount': 2
                    },
                    {
                      'item': '57dd3be50febcb5d9dde9761',
                      '_id': '57dd3be50febcb5d9dde9762',
                      'amount': 3
                    }
                  ],
                  '__v': 0
                },
                'step': 'Craft',
                'item': {
                  '_id': '57dd3b910febcb5d9dde9755',
                  'name': 'Ramie Thread',
                  'discount': 0,
                  'inStock': 0,
                  'soldOnMarket': false,
                  'canBeOrderedByUnprivileged': false,
                  'gatheringLevel': 0,
                  'gatheringJob': 'None',
                  'gatheringEffort': 0,
                  'priceHQ': 10000,
                  'price': 4500,
                  '__v': 0,
                  'lastPriceUpdate': '2016-10-12T08:03:07.638Z',
                  'ageMultiplier': 2.19,
                  'unspoiledNodeTime': {
                    'duration': 60
                  }
                },
                'inputs': [
                  {
                    '_id': '586c207025fb900f3f688474',
                    'amount': 24,
                    'step': 'Gather',
                    'item': {
                      '_id': '57dd39ca0febcb5d9dde974c',
                      'name': 'Lightning Crystal',
                      'discount': 0,
                      'inStock': 0,
                      'soldOnMarket': false,
                      'canBeOrderedByUnprivileged': false,
                      'gatheringLevel': 30,
                      'gatheringJob': 'None',
                      'gatheringEffort': -27,
                      'priceHQ': 0,
                      'price': 70,
                      '__v': 0,
                      'lastPriceUpdate': '2016-11-02T14:45:18.447Z',
                      'ageMultiplier': 9.07,
                      'datedObject': false,
                      'availableFromNpc': false,
                      'unspoiledNodeTime': {
                        'duration': 60
                      }
                    },
                    'inputs': [

                    ],
                    'hq': false,
                    '__v': 0
                  },
                  {
                    '_id': '586c207025fb900f3f688475',
                    'amount': 12,
                    'step': 'Gather',
                    'item': {
                      '_id': '57dd3bd90febcb5d9dde975b',
                      'name': 'Flax',
                      'discount': 0,
                      'inStock': 0,
                      'soldOnMarket': false,
                      'canBeOrderedByUnprivileged': false,
                      'gatheringLevel': 31,
                      'gatheringJob': 'Botanist',
                      'gatheringEffort': 1,
                      'priceHQ': 500,
                      'price': 700,
                      '__v': 0,
                      'lastPriceUpdate': '2016-09-30T13:06:37.833Z',
                      'ageMultiplier': 4.04,
                      'unspoiledNodeTime': {
                        'duration': 60
                      }
                    },
                    'inputs': [

                    ],
                    'hq': false,
                    '__v': 0
                  },
                  {
                    '_id': '586c207025fb900f3f688476',
                    'amount': 18,
                    'step': 'Gather',
                    'item': {
                      '_id': '57dd3be50febcb5d9dde9761',
                      'name': 'Stalk of Ramie',
                      'discount': 0,
                      'inStock': 0,
                      'soldOnMarket': false,
                      'canBeOrderedByUnprivileged': false,
                      'gatheringLevel': 54,
                      'gatheringJob': 'Botanist',
                      'gatheringEffort': 1,
                      'priceHQ': 1000,
                      'price': 355,
                      '__v': 0,
                      'lastPriceUpdate': '2016-09-26T08:16:18.964Z',
                      'ageMultiplier': 2.97,
                      'unspoiledNodeTime': {
                        'duration': 60
                      }
                    },
                    'inputs': [

                    ],
                    'hq': false,
                    '__v': 0
                  }
                ],
                'hq': false,
                '__v': 0
              }
            ],
            'hq': false,
            '__v': 0
          }
        ],
        'hq': false,
        '__v': 0
      }
    ],
    'hq': false,
    '__v': 0
  }

  var project3 = {
    'tree': projectMogwallTree,
    'stock': [
      {
        'item': {
          '_id': '57dd337c29bed45d2804a418',
          'name': 'Wind Crystal'
        },
        '_id': '586c23a425fb900f3f6884f6',
        'hq': false,
        'amount': 3300
      },
      {
        'item': {
          '_id': '57dd300eec158f5b6b75b42c',
          'name': 'Cedar Log'
        },
        '_id': '586c2c43c3071e0fe962da69',
        'hq': false,
        'amount': 5
      }
    ]
  }

  var project4 = {
    'tree': projectMogwallTree,
    'stock': [
      {
        'item': {
          '_id': '57dd337c29bed45d2804a418',
          'name': 'Wind Crystal'
        },
        '_id': '586c23a425fb900f3f6884f6',
        'hq': false,
        'amount': 78
      },
      {
        'item': {
          '_id': '57dd300eec158f5b6b75b42c',
          'name': 'Cedar Log'
        },
        '_id': '586c2c43c3071e0fe962da69',
        'hq': false,
        'amount': 374
      }
    ]
  }

  it('case where cedar logs where calculated wrongly', function (done) {
    $projectAnalyzerService.getProjectMaterialList(project3).then(function (result) {
      expect(result.gatherList['57dd300eec158f5b6b75b42cNQ']).toBeDefined()
      expect(result.gatherList['57dd300eec158f5b6b75b42cNQ'].outstanding).toBe(1125 - 5)

      done()
    })

    $scope.$digest()
  })

  it('case where cedar logs where calculated wrongly2', function (done) {
    $projectAnalyzerService.getProjectMaterialList(project4).then(function (result) {
      expect(result.gatherList['57dd300eec158f5b6b75b42cNQ']).toBeDefined()
      expect(result.gatherList['57dd300eec158f5b6b75b42cNQ'].outstanding).toBe(1125 - 374)

      done()
    })

    $scope.$digest()
  })

  var project5 = {
    'tree': projectMogwallTree,
    'stock': [
      {
        'item': {
          '_id': '57dd337c29bed45d2804a418',
          'name': 'Wind Crystal'
        },
        '_id': '586c23a425fb900f3f6884f6',
        'hq': false,
        'amount': 50
      },
      {
        'item': {
          '_id': '57dd300eec158f5b6b75b42c',
          'name': 'Cedar Log'
        },
        '_id': '586c2c43c3071e0fe962da69',
        'hq': false,
        'amount': 200
      }
    ]
  }

  it('check if the separate cedar lumber step is fine', function (done) {
    var projectData = $projectAnalyzerService.createBaseProjectData(project5)

    var maxLumberSteps = $projectAnalyzerService.getMaxCraftableSteps($.extend(true, {}, cedarLumberStep), projectData)

    $projectAnalyzerService.analyzeStep($.extend(true, {}, cedarLumberStep), projectData)
    .then(function () {
      expect(projectData.gatherList['57dd337c29bed45d2804a418NQ']).toBeDefined()
      expect(projectData.gatherList['57dd337c29bed45d2804a418NQ'].outstanding).toBe(225 - 50)
      expect(projectData.gatherList['57dd300eec158f5b6b75b42cNQ']).toBeDefined()
      expect(projectData.gatherList['57dd300eec158f5b6b75b42cNQ'].outstanding).toBe(375 - 200)

      return $projectAnalyzerService.analyzeStep($.extend(true, {}, holyCedarLumberStep), projectData)
    }).then(function () {
      expect(projectData.gatherList['57dd337c29bed45d2804a418NQ']).toBeDefined()
      expect(projectData.gatherList['57dd337c29bed45d2804a418NQ'].outstanding).toBe(450 + 450 + 225 - 50)
      expect(projectData.gatherList['57dd300eec158f5b6b75b42cNQ']).toBeDefined()
      expect(projectData.gatherList['57dd300eec158f5b6b75b42cNQ'].outstanding).toBe(750 + 375 - 200)

      done()
    }).catch(function () {
      fail('i cought something here')
    })

    $scope.$digest()
  })

  var project6 = {
    'tree': projectMogwallTree,
    'stock': [
      {
        'item': {
          '_id': '57dd3165ec158f5b6b75b43c',
          'name': 'Cassia Block'
        },
        '_id': '586e454534bdde22e730a6ed',
        'hq': false,
        'amount': 32
      }, {
        'item': {
          '_id': '57dd3cb10febcb5d9dde9770',
          'name': 'Cassia Log'
        },
        '_id': '586d4637c3071e0fe962dc3a',
        'hq': false,
        'amount': 12
      }, {
        'item': {
          '_id': '57cfbd439567fb328521568f',
          'name': 'Wind Cluster'
        },
        '_id': '586c23d525fb900f3f6884fa',
        'hq': false,
        'amount': 60
      }, {
        'item': {
          '_id': '57dd38e50febcb5d9dde9722',
          'name': 'Ice Cluster'
        },
        '_id': '586c23da25fb900f3f6884fc',
        'hq': false,
        'amount': 30
      }, {
        'item': {
          '_id': '57dd3cb10febcb5d9dde976f',
          'name': 'Hardened Sap'
        },
        '_id': '586d7641c3071e0fe962dc88',
        'hq': false,
        'amount': 36
      }, {
        'item': {
          '_id': '57dd38e50febcb5d9dde9724',
          'name': 'Astral Oil'
        },
        '_id': '586d40eac3071e0fe962dbf9',
        'hq': false,
        'amount': 4
      }, {
        'item': {
          '_id': '57dd38e50febcb5d9dde9723',
          'name': 'Dawnborne Aethersand'
        },
        '_id': '586cee3dc3071e0fe962db5d',
        'hq': false,
        'amount': 4
      }
    ]
  }

  it('check for craftable cassia', function (done) {
    var projectData = $projectAnalyzerService.createBaseProjectData(project6)
    $projectAnalyzerService.analyzeStep($.extend(true, {}, projectMogwallTree), projectData)
    .then(function (result) {
      expect(_.find(projectData.craftableSteps, function (step) { return step.step.item._id == '57dd38e50febcb5d9dde9725' }).step.amount).toBe(4)

      done()
    }).catch(function () {
      fail('caught something')
    })

    $scope.$digest()
  })

  it('check for craftable cassia isolated step', function (done) {
    var projectData = $projectAnalyzerService.createBaseProjectData(project6)
    $projectAnalyzerService.analyzeStep($.extend(true, {}, cassiaBlockStep), projectData)
    .then(function (result) {
      expect(_.find(projectData.craftableSteps, function (step) { return step.step.item._id == '57dd38e50febcb5d9dde9725' }).step.amount).toBe(4)

      done()
    }).catch(function () {
      fail('caught something')
    })

    $scope.$digest()
  })
})
