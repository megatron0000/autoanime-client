'use strict';

angular.module('myApp.updateAnimeModal', ['ngRoute'])

.controller('UpdateAnimeModalController',
  ['ErrorAlertService', 'SocketService', 'restUrl', '$http', '$scope', 'animeInfo', 'close',
    function (ErrorAlertService, SocketService, restUrl, $http, $scope, animeInfo, close) {
      window.$('#updateAnimeModal').on('hidden.bs.modal', function () {
        close(false);
      });

      const socket = SocketService();
      $scope.serverKeys = [];
      $scope.isCreateMode = animeInfo ? false : true;
      $scope.animeInfo = animeInfo || {title: '', active: false, serverMap: {}};
      $scope.formDisabled = true;

      $http.get(restUrl + '/servers').then(function (res) {
        const servers = res.data;
        servers.forEach(function (serv) {
          $scope.animeInfo.serverMap[serv] = $scope.animeInfo.serverMap[serv] || null;
        });
        $scope.serverKeys = Object.keys($scope.animeInfo.serverMap);
        $scope.formDisabled = false;
      });


      function socketCallback(err) {
        if (err) {
          ErrorAlertService.alert(err);
        }
      }

      $scope.submitForm = function () {
        console.log('anime info: %o', $scope.animeInfo);
        socket.emit('anime create/update request', $scope.animeInfo, socketCallback);
      };

      $scope.deleteAnime = function() {
        socket.emit('anime delete request', $scope.animeInfo.title, socketCallback);
        window.$('#updateAnimeModal').modal('hide');
      }

    }]
);

