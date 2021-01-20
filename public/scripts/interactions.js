/* constructor of game state */
function GameState(socket) {
  this.playerType = null;

  this.getPlayerType = function () {
    return this.playerType;
  };

  this.setPlayerType = function (p) {
    this.playerType = p;
  };
}

//set everything up, including the WebSocket
(function setup() {
    var socket = new WebSocket(Setup.WEB_SOCKET_URL);

    /*
    * the GameState object coordinates everything
    */

    var gs = new GameState(socket);
    
    socket.onopen = function () {
        socket.send(Messages.CONNECT_ME);
    };

    socket.onmessage = function (event) {
        let incomingMsg = JSON.parse(event.data);

        //set player type
        if (incomingMsg.type == Messages.T_PLAYER_TYPE) {
          gs.setPlayerType(incomingMsg.data); //should be "A" or "B"
        }   
    }
  
    socket.onerror = function () { };
    
})(); //execute immediately