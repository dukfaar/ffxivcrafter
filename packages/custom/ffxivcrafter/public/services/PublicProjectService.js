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
      function projectChangeListener (ev, data) {
        if (updateTimeout) {
          clearTimeout(updateTimeout)
        }

        updateTimeout = setTimeout(function () {
          updateTimeout = null
          updateList()
        }, 500)
      }

      socket.on('project stock changed', projectChangeListener)
      socket.on('project step data changed', projectChangeListener)
      socket.on('project data changed', projectChangeListener)
      socket.on('project deleted', projectChangeListener)
      socket.on('new project created', projectChangeListener)

      $rootScope.$on('userservice refetched user', projectChangeListener)

      return data
    }
  ])
