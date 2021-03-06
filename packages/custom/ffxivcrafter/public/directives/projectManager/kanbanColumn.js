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

      $scope.cards = []

      function assignCardOrder() {
        _.forEach($scope.cards,function (card, index) {
          if(card.order === null || card.order === undefined) {
            card.order = index
            KanbanCard.update({id: card._id}, card)
          }
        })
      }

      function assignCardOrderByIndex() {
        _.forEach($scope.cards,function (card, index) {
          if(card.order !== index) {
            card.order = index
            KanbanCard.update({id: card._id}, card)
          }
        })
      }

      function sortCards() {
        $scope.cards = _.sortBy($scope.cards, function(card) {
          return (card.order !== null && card.order !== undefined)?card.order:card._id
        })
      }

      function orderScopeCards() {
        sortCards()
        assignCardOrder()
      }

      function getAndOrderCards() {
        $scope.cards = getCards()
        $scope.cards.$promise.then(function(cards) {
          orderScopeCards()
        })
      }

      if (localStorageService.get('editKanbanColumns') === null) localStorageService.set('editKanbanColumns', false)

      $scope.editKanbanColumns = localStorageService.get('editKanbanColumns')

      getAndOrderCards()

      $scope.addCardToColumn = function (column) {
        var newCard = new KanbanCard({title: 'New Card', column: column._id, order: $scope.cards.length})
        newCard.$save()
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
        card.column = $scope.column._id
        card.order = index
        KanbanCard.update({id: card._id}, card)
        return true
      }

      socket.on('KanbanColumn updated', function (data) {
        if(data._id === $scope.column._id) {
          _.assign($scope.column, data)
          $scope.$digest()
        }
      })

      socket.on('KanbanCard created', function (data) {
        if(data.column === $scope.column._id)
          getAndOrderCards()
      })

      function removeCardFromArrayAndReindex(id) {
        _.remove($scope.cards, function(card) { return card._id === id })
        assignCardOrderByIndex()
      }

      socket.on('KanbanCard deleted', function (data) {
        removeCardFromArrayAndReindex(data)
      })

      function updateCard (data) {
        var cardInThisColumn = _.find($scope.cards, function (card) { return card._id === data._id })

        //card removed?
        if(cardInThisColumn && $scope.column._id !== data.column) {
          removeCardFromArrayAndReindex(data._id)
        }

        //card added
        if(!cardInThisColumn && $scope.column._id === data.column) {
          _.forEach($scope.cards, function(card) {
            if (card.order >= data.order) {
              card.order++
            }
          })
          $scope.cards.push(data)
          sortCards()
          assignCardOrderByIndex()
        }

        if(cardInThisColumn && data.column === $scope.column._id)
          //card was in this column and it still is
          if(cardInThisColumn.order > data.order) {
            for(let i = data.order; i < cardInThisColumn.order; i++) {
              $scope.cards[i].order++

              KanbanCard.update({id: $scope.cards[i]._id}, $scope.cards[i])
            }
          }

          //moved down
          else if(cardInThisColumn.order < data.order) {
            for(let i = cardInThisColumn.order + 1; i < data.order; i++) {
              $scope.cards[i].order--

              KanbanCard.update({id: $scope.cards[i]._id}, $scope.cards[i])
            }
          }

          _.assign(cardInThisColumn, data)
          sortCards()

          $scope.$digest()
      }

      var updateCardTimeout = null

      socket.on('KanbanCard updated', function (data) {
        if(updateCardTimeout) clearTimeout(updateCardTimeout)
        updateCardTimeout = setTimeout(() => {
          updateCard(data)
          updateCardTimeout = null
        }, 300)
      })
    }
  }
})
