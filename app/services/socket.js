'use strict';

angular.module('myApp.socketService', [])

.factory('SocketService', ['socketsUrl', function (socketsUrl) {

  /**
   *
   * @type {Array<{onEmit?: Function, onResponse?: Function}>}
   */
  const wrappers = [];

  function SocketService() {
    const out = io(socketsUrl);
    const oldEmit = out.emit;
    out.emit = function () {
      const cb = arguments[arguments.length - 1];
      if (typeof cb === 'function') {
        wrappers.forEach(function (wrapper) {
          try {
            wrapper.onEmit.apply(window, arguments);
          } catch (e) {
          }
        });
        arguments[arguments.length - 1] = function () {
          wrappers.forEach(function (wrapper) {
            try {
              wrapper.onResponse.apply(window, arguments);
            } catch (e) {
            }
          });
          cb.apply(window, arguments);
        }
      }
      return oldEmit.apply(out, arguments);
    };
    return out;
  }

  /**
   * When socket.emit(...) is called with a callback, adds interceptors to emit, calling onEmit when
   * socket.emit is called and onResponse when the callback is called internally
   * @param onEmit {Function=}
   * @param onResponse {Function=}
   */
  SocketService.wrap = function (onEmit, onResponse) {
    wrappers.push({onEmit: onEmit, onResponse: onResponse});
  };

  return SocketService;

}]);
