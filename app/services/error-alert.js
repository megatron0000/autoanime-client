'use strict';

angular.module('myApp.errorAlertService', [
  'angularModalService'
])

.service('ErrorAlertService', ['ModalService', function (ModalService) {
  this.alert = function (err) {
    ModalService.showModal({
      templateUrl: "error-alert-modal/error-alert-modal.html",
      controller: "ErrorAlertModalController",
      inputs: {
        error: err
      }
    }).then(function (modal) {
      //it's a bootstrap element, use 'modal' to show it
      console.log(modal);
      modal.element.modal();
      modal.close.then(function (result) {
        console.log(result);
      });
    });
  }
}]);
