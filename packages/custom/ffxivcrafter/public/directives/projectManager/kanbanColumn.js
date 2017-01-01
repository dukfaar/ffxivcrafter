'use strict'

angular.module('mean.ffxivCrafter').directive('kanbanColumn', function () {
  return {
    templateUrl: '/ffxivCrafter/views/projectManager/kanbanColumn.html',
    scope: {
      column: '=columnData'
    },
    controller: function ($scope, Global, $http, $timeout, $q, _, KanbanCard, KanbanColumn, $mdToast, socket, $mdDialog, localStorageService) {
      function getCards () {
        return KanbanCard.query({column: $scope.column._id})
      }

      if (localStorageService.get('editKanbanColumns') === null) localStorageService.set('editKanbanColumns', false)

      $scope.editKanbanColumns = localStorageService.get('editKanbanColumns')

      $scope.cards = getCards()

      $scope.addCardToColumn = function (column) {
        var newCard = new KanbanCard({name: 'New Card', column: column._id})
        newCard.$save()
        $scope.cards = getCards()
      }

      $scope.updateCard = function (card) {
        KanbanCard.update({id: card._id}, card)
      }

      $scope.updateColumn = function (column) {
        KanbanColumn.update({id: column._id}, column)
      }

      $scope.deleteColumn = function (column) {
        if ($scope.cards.length === 0) {
          KanbanColumn.delete({id: column._id})
        } else {
          $mdToast.show(
            $mdToast.simple()
            .textContent('Column is not empty, please remove all cards before deletion')
            .position('bottom right')
            .highlightClass('md-accent')
          )
        }
      }

      $scope.editCard = function (card) {
        $mdDialog.show({
          templateUrl: 'ffxivCrafter/views/projectManager/editCardDialog.html',
          parent: angular.element(document.body),
          controller: 'EditKanbanCardDialogController',
          clickOutsideToClose: true,
          locals: {
            card: $.extend({},card)
          }
        }).then(function (card) {
          $scope.updateCard(card)
        })

      }

      $scope.deleteCard = function (card) {
        KanbanCard.delete({id: card._id})
      }

      $scope.cardDropped = function(event, index, card, external, type) {
        if(card.column != $scope.column._id) {
          card.column = $scope.column._id
          KanbanCard.update({id: card._id}, card)
          return true
        } else {
          return false
        }
      }

      socket.on('KanbanColumn updated', function (data) {
        if(data._id == $scope.column._id) {
          _.assign($scope.column, data)
          $scope.$digest()
        }
      })

      socket.on('KanbanCard created', function (data) {
        if(data.column == $scope.column._id)
          $scope.cards = getCards()
      })

      socket.on('KanbanCard deleted', function (data) {
        if(data.column == $scope.column._id)
          $scope.cards = getCards()
      })

      socket.on('KanbanCard updated', function (data) {
        var cardInThisColumn = _.find($scope.cards, function (card) { return card._id == data._id })

        if(cardInThisColumn && $scope.column._id != data.column) {
          //card was removed from this column
          $scope.cards = getCards()
        }

        if(!cardInThisColumn && $scope.column._id == data.column) {
          //card is new in this column
          $scope.cards = getCards()
        }

        if(cardInThisColumn && data.column == $scope.column._id)
          //card was in this column and it still is
          _.assign(_.find($scope.cards, function (card) { return card._id == data._id }), data)

          $scope.$digest()
      })
    }
  }
})
