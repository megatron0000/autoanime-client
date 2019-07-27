'use strict';

angular.module('myApp.errorAlertModal', ['ngRoute'])

.controller('ErrorAlertModalController', ['$scope', 'error', 'close', function ($scope, error, close) {
  $scope.error = error;
  window.$('#errorAlertModal').on('hidden.bs.modal', function () {
    close(false);
  });
}]);

