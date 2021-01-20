(function(exports) {
  exports.MAX_ALLOWED_ROLL = 1; /* Maximum number of rolls with dice */
  exports.MAX_ALLOWED_MOVE = 1; /* Maximum number of movements for each turn */
  exports.WEB_SOCKET_URL = "ws://localhost:3000"; /* WebSocket URL */
})(typeof exports === "undefined" ? (this.Setup = {}) : exports);