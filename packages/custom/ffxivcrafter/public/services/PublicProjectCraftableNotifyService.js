'use strict'

angular.module('mean.ffxivCrafter').factory('PublicProjectCraftableNotifyService',
  [ '$rootScope', 'StepService', 'NotificationSettingsService', '_',
    '$translate', 'webNotification', 'PublicProjectService',
    function ($rootScope, StepService, NotificationSettingsService, _,
    $translate, webNotification, PublicProjectService) {
      var oldProjectData = {}

      function toArray (obj) {
        return Object.keys(obj).map(function (key) {
          return obj[key]
        })
      }

      function getCraftArrayFromProjectData (project, projectData) {
        return _.filter(_.filter(toArray(projectData[project._id].craftableSteps), StepService.canCraft), function (g) { return Math.floor(g.step.amount) > 0 })
      }

      function checkForCraftableChanges (projectList, newProjectData) {
        if (NotificationSettingsService.enabled.craftable && !_.isEmpty(oldProjectData)) {
          _.forEach(projectList, function (project) {
            var newCraftArray = getCraftArrayFromProjectData(project, newProjectData)
            var oldCraftArray = getCraftArrayFromProjectData(project, oldProjectData)

            _.forEach(newCraftArray, function (newCraft) {
              var oldCraft = _.find(oldCraftArray, function (c) { return newCraft.step.step._id === c.step.step._id })

              if (!oldCraft) {
                if (Math.floor(newCraft.step.amount) > 0) {
                  $translate('notification.craftable.new', {project: project.name, item: newCraft.step.item.name, amount: Math.floor(newCraft.step.amount)}).then(function (notificationText) {
                    webNotification.showNotification('New craftable items', {
                      body: notificationText,
                      autoClose: 10000
                    })
                  })
                }
              } else {
                if (Math.floor(newCraft.step.amount) > Math.floor(oldCraft.step.amount)) {
                  $translate('notification.craftable.more', {project: project.name, item: newCraft.step.item.name, amount: Math.floor(newCraft.step.amount) - Math.floor(oldCraft.step.amount)}).then(function (notificationText) {
                    webNotification.showNotification('More craftable items', {
                      body: notificationText,
                      autoClose: 10000
                    })
                  })
                }
              }
            })
          })
        }
      }

      $rootScope.$on('analyzed project data changed', function (event, args) {
        checkForCraftableChanges(args.projectList, args.projectData)
        oldProjectData = _.extend({}, args.projectData, true)
      })

      return {
      }
    }
  ]
)
