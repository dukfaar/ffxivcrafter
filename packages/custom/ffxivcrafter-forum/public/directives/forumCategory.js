'use strict'

angular.module('mean.ffxivCrafter_forum').directive('forumCategory', function () {
  return {
    templateUrl: '/ffxivCrafter_forum/views/category.html',
    scope: {
      categoryId: '=categoryId'
    },
    controller: function ($scope, $q, _, ForumCategory, socket, ForumThread, ForumPost, $mdDialog, MeanUser, $location) {
      $scope.allowed = function (perm) {
        return MeanUser.acl.allowed && MeanUser.acl.allowed.indexOf(perm) != -1
      }

      $scope.category = ForumCategory.get({id: $scope.categoryId})
      $scope.subCategories = ForumCategory.query({parent: $scope.categoryId})
      $scope.threads = ForumThread.query({category: $scope.categoryId, sort: 'lastUpdate'})
      $scope.canEditCategory = canEditCategory
      $scope.updateCategory = updateCategory

      $scope.threadOrderFunction = function (thread) {
        return new Date(thread.lastUpdate)
      }

      function canEditCategory () {
        return $scope.allowed('admin') || $scope.allowed('forum moderator')
      }

      function updateCategory () {
        ForumCategory.update({id: $scope.categoryId}, $scope.category)
      }

      function creationListener (newThread) {
        if (newThread.category === $scope.categoryId) {
          ForumThread.query({category: $scope.categoryId})
          .$promise.then(function (data) {
            $scope.threads = data
          })
        }
      }

      socket.auto('ForumThread created', creationListener, $scope)

      function DialogController ($scope, $mdDialog) {
        $scope.data = {
          post: {
            text: ''
          }
        }

        $scope.hide = function () {
          $mdDialog.hide()
        }
        $scope.cancel = function () {
          $mdDialog.cancel()
        }
        $scope.save = function () {
          $mdDialog.hide($scope.data)
        }
      }

      $scope.createSubCategoryDialog = function () {
        $mdDialog.show({
          templateUrl: 'ffxivCrafter_forum/views/newCategoryDialog.html',
          parent: angular.element(document.body),
          clickOutsideToClose: true,
          controller: DialogController
        }).then(function (data) {
          var newCategory = new ForumCategory(data)
          newCategory.parent = $scope.categoryId
          newCategory.creator = MeanUser.user
          newCategory.$save().then(function () {
            $scope.subCategories = ForumCategory.query({parent: $scope.categoryId})
          })
        }, function () {
        })
      }

      $scope.deleteCategoryDialog = function () {
        $mdDialog.show($mdDialog.confirm()
          .title('Delete category')
          .textContent('Do you really want to delete this category.')
          .ok('Please do it!')
          .cancel('Hell no!')
        ).then(function() {
          ForumCategory.delete({id: $scope.categoryId}).$promise
          .then(function () {
            $location.path('/forum/category/' + $scope.category.parent)
          })
        }, function() {
        })
      }

      $scope.createThreadDialog = function () {
        $mdDialog.show({
          templateUrl: 'ffxivCrafter_forum/views/newThreadDialog.html',
          parent: angular.element(document.body),
          clickOutsideToClose: true,
          controller: DialogController
        }).then(function (data) {
          var newThread = new ForumThread(data.thread)
          newThread.category = $scope.categoryId
          newThread.creator = MeanUser.user
          newThread.$save().then(function () {
            $scope.threads = ForumThread.query({category: $scope.categoryId})

            var newPost = new ForumPost(data.post)
            newPost.thread = newThread._id
            newPost.creator = MeanUser.user
            newPost.$save()
          })
        }, function () {
        })
      }
    }
  }
})
