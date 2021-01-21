/* constructor of game state */
function GameState(socket) {
  this.playerType = null;
  this.diceValue = 0;
  this.diceRolled = false;
  this.turn = "B";

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

    function endTurn(){
        if (gs.turn=="A") gs.turn="B"
        else if (gs.turn=="B") gs.turn="A"
        gs.diceRolled = false
        for (const token of tokens) {
            token.element.classList.remove("movable")
        }
        console.log(gs.turn)
    }

    document.querySelector(".dice").querySelector("#roll").addEventListener("click", function () {
        if (gs.diceRolled) return
        if (gs.playerType!=gs.turn) return

        console.log("rolling")

        const rollDice = {
            "type": Messages.T_ROLL_DICE,
            "playerType": gs.playerType
        }
        socket.send(Messages.S_ROLL_DICE)
        console.log("roll_sent")
    });

    document.querySelector(".dice").querySelector("#pass").addEventListener("click", function () {
        if (!gs.diceRolled) return
        socket.send(Messages.S_END_TURN)
        endTurn()
    })

    for (const token of tokens) {
        token.element.addEventListener("click", function (){

            if (this.classList[2]!="movable" || gs.playerType!==gs.turn) return
            const moveMessage = {
                "type": Messages.T_TOKEN_MOVE,
                "tokenID": token.id,
            }
            socket.send(JSON.stringify(moveMessage))
            move(token.id, gs.diceValue)
            socket.send(Messages.S_END_TURN)
            endTurn()
        })
    }


    socket.onmessage = function (event  ) {
        let incomingMsg = (JSON.parse(event.data))
        console.log(incomingMsg)

        //set player type
        if (incomingMsg.type == Messages.T_PLAYER_TYPE) {
          gs.setPlayerType(incomingMsg.data); //should be "A" or "B"
            
            if(incomingMsg.data == "A"){
                window.alert("You are RED");
            }
            else{
                window.alert("You are GREEN");
            }
        }

        if (incomingMsg.type == Messages.T_DICE_ROLLED.type) {
            gs.diceValue=incomingMsg.data
            gs.diceRolled=true;
            document.querySelector(".dice").querySelector("h1").innerHTML = gs.diceValue
            movable(gs.turn, gs.diceValue)
        }

        if (incomingMsg.type == Messages.O_TOKEN_MOVE.type) {
            move(incomingMsg.tokenID, gs.diceValue)
        }

        if (incomingMsg.type == Messages.O_END_TURN.type) {
            endTurn()
        }
    }
  
    socket.onerror = function () { };
    
})(); //execute immediately