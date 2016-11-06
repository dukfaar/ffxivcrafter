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

  it('should exist', function() {
    expect($projectAnalyzerService).toBeDefined()
  })

  it('returns the price of an item of a non-meta step', function() {
    expect($projectAnalyzerService.itemPrice(ironOreNQGatheringStep)).toBe(18)
    expect($projectAnalyzerService.itemPrice(ironOreHQGatheringStep)).toBe(148)
  })

  it('returns the price of a non-meta step', function() {
    expect($projectAnalyzerService.stepPrice(ironOreNQGatheringStep)).toBe(18*6)
    expect($projectAnalyzerService.stepPrice(ironOreHQGatheringStep)).toBe(148*6)
  })

  it('calculates the required gathering and crafting of a project', function(done) {
    $projectAnalyzerService.getProjectMaterialList(project1).then(function(result) {
      expect(result.revenue).toBe(68*2)
      expect(result.profit).toBe(68*2*0.95-2*100)
      expect(result.relativeProfit).toBe(((68*2*0.95-2*100)/(2*100))*100)

      expect(result.gatherList['ironOreItemNQ']).toBeDefined()
      expect(result.gatherList['ironOreItemNQ'].outstanding).toBe(6)

      done()
    })

    $scope.$digest()
  })

  var project2 = {
    tree: ironIngotNQCraftingStep,
    stock: [{amount:4, hq: false, item: ironOreItem}]
  }

  it('calculates the required gathering and crafting of a project with items in stock', function(done) {
    $projectAnalyzerService.getProjectMaterialList(project2).then(function(result) {
      expect(result.revenue).toBe(68*2)
      expect(result.profit).toBe(68*2*0.95-2*100)
      expect(result.relativeProfit).toBe(((68*2*0.95-2*100)/(2*100))*100)

      expect(result.gatherList['ironOreItemNQ']).toBeDefined()
      expect(result.gatherList['ironOreItemNQ'].outstanding).toBe(2)

      done()
    })

    $scope.$digest()
  })
})
