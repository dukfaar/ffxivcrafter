'use strict'

angular.module('mean.ffxivCrafter').factory('PublicProjectService', PublicProjectService)
PublicProjectService.$inject = [
  'socket', '$http', '_', 'projectAnalyzerService', 'ProjectService',
  'MeanUser', '$rootScope']

function PublicProjectService (
  socket, $http, _, projectAnalyzerService, ProjectService,
  MeanUser, $rootScope) {
  var data = {
    projectList: [],
    unfilteredProjectList: [],
    projectData: {}
  }

  updateList()

  var updateTimeout = null

  socket.on('project stock changed', projectStockChangedListener)

  //socket.on('project stock changed', projectChangeListener)
  socket.on('project step data changed', projectChangeListener)
  socket.on('project data changed', projectDataChangeListener)
  socket.on('project deleted', projectChangeListener)
  socket.on('new project created', projectChangeListener)

  $rootScope.$on('userservice refetched user', projectChangeListener)

  return data

  function triggerRecalc () {
    data.projectData = {}
    projectAnalyzerService.updateMaterialList(data.projectList, data.projectData)
    .then(function () {
      $rootScope.$emit('analyzed project data changed', {projectList: data.projectList, projectData: data.projectData})
    })
  }

  function updateList () {
    $http.get('api/project/public')
        .then(function (response) {
          data.unfilteredProjectList = response.data
          data.projectList = _.reject(response.data, function (p) { return ProjectService.isHiddenFromOverview(p, MeanUser.user) })

          triggerRecalc()
        })
  }

  function checkAndSetUpdateTimeout () {
    if (updateTimeout) {
      clearTimeout(updateTimeout)
    }

    updateTimeout = setTimeout(function () {
      updateTimeout = null
      updateList()
    }, 500)
  }

  function projectChangeListener (ev, data) {
    checkAndSetUpdateTimeout()
  }

  function projectDataChangeListener (ev, projectId) {
    if (_.find(data.unfilteredProjectList, p => p._id === projectId)) {
      checkAndSetUpdateTimeout()
    }
  }

  function projectStockChangedListener (stockChange) {
    let project = _.find(data.unfilteredProjectList, p => p._id === stockChange.projectId)
    if(!project) {
      updateList()
      return
    }
    let stockItem = _.find(project.stock, i => { return (i.item._id === stockChange.item && i.hq === stockChange.hq) })

    if (stockItem) {
      stockItem.amount += Number.parseInt(stockChange.amount)

      triggerRecalc()
    } else {
      updateList()
    }
  }
}
