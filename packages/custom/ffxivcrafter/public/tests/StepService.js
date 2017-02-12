'use strict'

describe('StepService', function () {
  beforeEach(module('mean.ffxivCrafter'))
  beforeEach(module(function ($provide) {
    $provide.value('MeanUser', {
      user: {
        minerLevel: 60,
        botanistLevel: 60,
        botanistFolklore: {
          'dravania': true
        },
        weaverLevel: 60,
        weaverMaster: [ false, true ]
      }
    })
  }))

  var StepService = null

  beforeEach(inject(function (_StepService_) {
    StepService = _StepService_
  }))

  describe('canHarvest', function () {
    it('exists', function (done) {
      expect(StepService.canHarvest).toBeDefined()
      done()
    })

    it('user is able to harvest a lowlevel item', function (done) {
      expect(StepService.canHarvest({
        item: {
          gatheringJob: 'Miner',
          gatheringLevel: 6
        }
      })).toBe(true)
      done()
    })

    it('user is unable to harvest an item to high of a level', function (done) {
      expect(StepService.canHarvest({
        item: {
          gatheringJob: 'Miner',
          gatheringLevel: 999
        }
      })).toBe(false)
      done()
    })

    it('user is able to harvest an item of the same level', function (done) {
      expect(StepService.canHarvest({
        item: {
          gatheringJob: 'Miner',
          gatheringLevel: 60
        }
      })).toBe(true)
      done()
    })

    it('user is able to harvest some dravanian botanist folklore node', function (done) {
      expect(StepService.canHarvest({
        item: {
          gatheringJob: 'Botanist',
          gatheringLevel: 60,
          unspoiledNodeTime: {
            folkloreNeeded: 'dravania'
          }
        }
      })).toBe(true)
      done()
    })

    it('user is unable to harvest some dravanian miner folklorenode', function (done) {
      expect(StepService.canHarvest({
        item: {
          gatheringJob: 'Miner',
          gatheringLevel: 60,
          unspoiledNodeTime: {
            folkloreNeeded: 'dravania'
          }
        }
      })).toBe(false)
      done()
    })

    it('user can always gather items that have no gatheringjob', function (done) {
      expect(StepService.canHarvest({
        item: {
          gatheringJob: 'None'
        }
      })).toBe(true)
      done()
    })

    it('user should never be able to harvest anything with an unknown job (like FC)', function (done) {
      expect(StepService.canHarvest({
        item: {
          gatheringJob: 'FC'
        }
      })).toBe(false)
      done()
    })
  })

  describe('canCraft', function () {
    it('exists', function (done) {
      expect(StepService.canCraft).toBeDefined()
      done()
    })

    it('user can craft items below his level', function (done) {
      expect(StepService.canCraft({
        step: {
          recipe: {
            craftingJob: 'Weaver',
            craftingLevel: 13,
            masterbook: 0
          }
        }
      })).toBe(true)
      done()
    })

    it('user can not craft items above his level', function (done) {
      expect(StepService.canCraft({
        step: {
          recipe: {
            craftingJob: 'Weaver',
            craftingLevel: 9999,
            masterbook: 0
          }
        }
      })).toBe(false)
      done()
    })

    it('user can craft items below his level that requires his mastery', function (done) {
      expect(StepService.canCraft({
        step: {
          recipe: {
            craftingJob: 'Weaver',
            craftingLevel: 13,
            masterbook: 2
          }
        }
      })).toBe(true)
      done()
    })

    it('user can not craft items below his level that he has no mastery for', function (done) {
      expect(StepService.canCraft({
        step: {
          recipe: {
            craftingJob: 'Weaver',
            craftingLevel: 13,
            masterbook: 1
          }
        }
      })).toBe(false)
      done()
    })
  })
})
