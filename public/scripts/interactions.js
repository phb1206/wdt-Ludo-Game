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

    socket.onmessage = function (event) {
        let incomingMsg = JSON.parse(event.data);

        //set player type
        if (incomingMsg.type == Messages.T_PLAYER_TYPE) {
          gs.setPlayerType(incomingMsg.data); //should be "A" or "B"
            
            if(incomingMsg.data == "A"){
                window.alert("You are RED");
                document.querySelector(".turn h1").className="red";
                document.querySelector(".turn h1").innerHTML="";
            }
            else{
                window.alert("You are BLUE");
                document.querySelector(".turn h1").className="blue";
                document.querySelector(".turn h1").innerHTML="";
            }
        }
        
        //player turn
        if (incomingMsg.type == Messages.O_PLAYER_TURN.type) {
          dice.rolled = false;
            console.log("YOUR TURN")
          document.querySelector(".turn h1").innerHTML="YOUR TURN";
        }
    }
  
    socket.onerror = function () { };
    
})(); //execute immediately