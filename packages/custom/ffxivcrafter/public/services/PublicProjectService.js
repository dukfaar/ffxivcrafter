'use strict'

angular.module('mean.ffxivCrafter').factory('PublicProjectService',
  [ 'socket', '$http', '_', 'projectAnalyzerService', 'ProjectService',
    'MeanUser', '$rootScope',
    function (socket, $http, _, projectAnalyzerService, ProjectService,
      MeanUser, $rootScope) {
      var data = {
        projectList: [],
        projectData: {}
      }

      function updateList () {
        $http.get('api/project/public')
        .then(function (response) {
          data.projectList = _.reject(response.data, function (p) { return ProjectService.isHiddenFromOverview(p, MeanUser.user) })

          data.projectData = {}
          projectAnalyzerService.updateMaterialList(data.projectList, data.projectData)
          .then(function () {
            $rootScope.$emit('analyzed project data changed', {projectList: data.projectList, projectData: data.projectData})
          })
        })
      }

      updateList()

      var updateTimeout = null
      function projectStockChangeListener (ev, data) {
        if (updateTimeout) {
          clearTimeout(updateTimeout)
        }

        updateTimeout = setTimeout(function () {
          updateTimeout = null
          updateList()
        }, 500)
      }

      var stepDateUpdateTimeout = null
      function projectStepDataChangeListener (ev, data) {
        if (stepDateUpdateTimeout) {
          clearTimeout(stepDateUpdateTimeout)
        }

        stepDateUpdateTimeout = setTimeout(function () {
          stepDateUpdateTimeout = null
          updateList()
        }, 500)
      }

      socket.on('project stock changed', projectStockChangeListener)
      socket.on('project step data changed', projectStepDataChangeListener)

      return data
    }
  ])
