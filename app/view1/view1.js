'use strict';

angular.module('myApp.view1', ['ngRoute', 'angularModalService', 'myApp.errorAlertService'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Controller'
        });
    }])

    /**
     * List of animes controller
     */
    .controller('View1Controller', ['ErrorAlertService', 'ModalService', 'SocketService', '$scope',
        function (ErrorAlertService, ModalService, SocketService, $scope) {

            const socket = SocketService();
            $scope.animes = [];
            $scope.filtersShowInactive = false;
            $scope.filtersShowTail = false;
            $scope.displayLimits = {};
            $scope.lastWatched = {};

            socket.emit('anime list request');
            socket.on('anime list data', function (data) {
                $scope.animes = data;
                console.log('anime data: %o', data);
                $scope.animes
                    .forEach(anime => {
                        $scope.displayLimits[anime.title] = $scope.displayLimits[anime.title] || 20

                        const eps = anime.episodes;
                        $scope.lastWatched[anime.title] = -1;
                        for (var i = 0; i < eps.length; i++) {
                            if (eps[i].watched && eps[i].number > $scope.lastWatched[anime.title]) {
                                $scope.lastWatched[anime.title] = eps[i].number
                            }
                        }
                    })

                $scope.$digest();
            });

            $scope.openAnimeUpdateModal = function (animeInfo) {
                ModalService.showModal({
                    templateUrl: "update-anime-modal/update-anime-modal.html",
                    controller: "UpdateAnimeModalController",
                    inputs: {
                        animeInfo: animeInfo
                    }
                }).then(function (modal) {
                    //it's a bootstrap element, use 'modal' to show it
                    modal.element.modal();
                });
            };

            $scope.openEpisodeInfoModal = function (episodeInfo) {
                ModalService.showModal({
                    templateUrl: "episode-info-modal/episode-info-modal.html",
                    controller: "EpisodeInfoModalController",
                    inputs: {
                        episodeInfo: episodeInfo
                    }
                }).then(function (modal) {
                    //it's a bootstrap element, use 'modal' to show it
                    modal.element.modal();
                });
            };

            $scope.linkRescan = function (anime) {
                socket.emit('link rescan request', anime, function () {
                    // do nothing
                })
            };

            $scope.episodeFilter = (anime) => function (ep, index, eps) {
                if ($scope.filtersShowTail) {
                    return true;
                }
                return ep.number >= $scope.lastWatched[anime.title] &&
                    (ep.number - $scope.lastWatched[anime.title]) < $scope.displayLimits[anime.title];
            };

            alert('Usar animeron !');

        }])

    .controller('SocketCallbackWaitingController', ['SocketService', '$scope', function (SocketService, $scope) {
        $scope.counter = 0;
        var alertAction = 'hide';
        var alert = window.$('#waitingForSocketCbAlert');
        alert.on('shown.bs.collapse', function () {
            alert.collapse(alertAction);
        });
        alert.on('hidden.bs.collapse', function () {
            alert.collapse(alertAction);
        });
        SocketService.wrap(
            function () {
                alert.collapse('show');
                alertAction = 'show';
                $scope.counter++;
            },
            function () {
                $scope.counter--;
                if ($scope.counter === 0) {
                    alert.collapse('hide');
                    alertAction = 'hide';
                }
                $scope.$apply();
            }
        );
    }])

    .controller('CreateServerController', ['$scope', 'SocketService', 'ErrorAlertService',
        function ($scope, SocketService, ErrorAlertService) {
            const socket = SocketService();
            $scope.createServerInput = '';

            $scope.submitServerCreateForm = function () {
                socket.emit('server create request', $scope.createServerInput, function (err) {
                    console.log('err: %o', err);
                    err ? ErrorAlertService.alert(err) : null;
                });

                $scope.createServerInput = '';
            };
        }]
    )

    .controller('DeleteServerController', ['$scope', 'SocketService', 'ErrorAlertService',
        function ($scope, SocketService, ErrorAlertService) {
            const socket = SocketService();
            $scope.deleteServerInput = '';

            $scope.submitServerDeleteForm = function () {
                socket.emit('server delete request', $scope.deleteServerInput, function (err) {
                    console.log('err: %o', err);
                    err ? ErrorAlertService.alert(err) : null;
                });

                $scope.deleteServerInput = '';
            };

        }]
    );
