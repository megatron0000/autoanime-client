'use strict';

angular.module('myApp.episodeInfoModal', ['ngRoute'])

.controller('EpisodeInfoModalController',
  ['ErrorAlertService', 'SocketService', '$scope', 'episodeInfo', 'close',
    /**
     *
     * @param ErrorAlertService
     * @param SocketService
     * @param $scope
     * @param animeTitle
     * @param episodeInfo {{number: number animeTitle: string watched?: boolean urls: {server: string url: string}[]}}
     * @param close
     */
    function (ErrorAlertService, SocketService, $scope, episodeInfo, close) {
      window.$('#episodeInfoModal').on('hidden.bs.modal', function () {
        close(false);
      });
      $scope.episodeInfo = episodeInfo;
      const socket = SocketService();

      function socketCallback(err, data) {
        if (err) {
          console.log(err);
          return ErrorAlertService.alert(err);
        }
        // data is only supplied on "link rescan request"
        if (data) {
          $scope.episodeInfo.urls = data;
          $scope.$digest();
        }
      }

      $scope.changeWatchStatus = function () {
        $scope.episodeInfo.watched = !$scope.episodeInfo.watched;
        socket.emit('episode watch/unwatch request', {
          number: episodeInfo.number,
          watched: episodeInfo.watched,
          animeTitle: episodeInfo.animeTitle
        }, socketCallback);
      };

      $scope.rescanLinks = function() {
        socket.emit('link rescan request', {
          animeTitle: $scope.episodeInfo.animeTitle,
          episodeNumber: $scope.episodeInfo.number
        }, socketCallback);
      };

    }]
);

