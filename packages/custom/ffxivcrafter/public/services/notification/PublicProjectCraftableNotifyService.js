'use strict'

angular.module('mean.ffxivCrafter').factory('PublicProjectCraftableNotifyService',
  [ '$rootScope', 'StepService', 'NotificationSettingsService', '_',
    '$translate', 'webNotification', 'PublicProjectService', '$q',
    function ($rootScope, StepService, NotificationSettingsService, _,
    $translate, webNotification, PublicProjectService, $q) {
      var oldProjectData = {}
      var newProjectData = {}

      function toArray (obj) {
        return Object.keys(obj).map(function (key) {
          return obj[key]
        })
      }

      function getCraftArrayFromProjectData (project, projectData) {
        if(!projectData[project._id]) return []

        return _.filter(_.filter(toArray(projectData[project._id].craftableSteps), StepService.canCraft), function (g) { return Math.floor(g.step.amount) > 0 })
      }

      function sendNotification (texts) {
        webNotification.showNotification(texts[0], {
          body: texts[1],
          autoClose: 10000
        })
      }

      function checkProjectForChanges (project) {
        var newCraftArray = getCraftArrayFromProjectData(project, newProjectData)
        var oldCraftArray = getCraftArrayFromProjectData(project, oldProjectData)

        if (oldCraftArray === undefined) return

        _.forEach(newCraftArray, function (newCraft) {
          var oldCraft = _.find(oldCraftArray, function (c) { return newCraft.step.step._id === c.step.step._id })

          if (!oldCraft) {
            if (Math.floor(newCraft.step.amount) > 0) {
              $q.all([
                $translate('notification.craftable.new.title'),
                $translate('notification.craftable.new.text', {project: project.name, item: newCraft.step.item.name, amount: Math.floor(newCraft.step.amount)})
              ])
              .then(sendNotification)
            }
          } else {
            if (Math.floor(newCraft.step.amount) > Math.floor(oldCraft.step.amount)) {
              $q.all([
                $translate('notification.craftable.more.title'),
                $translate('notification.craftable.more.text', {project: project.name, item: newCraft.step.item.name, amount: Math.floor(newCraft.step.amount) - Math.floor(oldCraft.step.amount)})
              ])
              .then(sendNotification)
            }
          }
        })
      }

      function checkForCraftableChanges (projectList, _newProjectData) {
        newProjectData = _newProjectData

        if (NotificationSettingsService.enabled.craftable && !_.isEmpty(oldProjectData)) {
          _.forEach(projectList, checkProjectForChanges)
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
