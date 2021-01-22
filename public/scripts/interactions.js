/* constructor of game state */
function GameState(socket) {
  this.playerType = null;
  this.diceValue = 0;
  this.diceRolled = false;
  this.turn = null;
  this.playerAScore = 0;
  this.playerBScore = 0;

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
        document.querySelector(".turn h1").className=(gs.turn=="A" ? "red" : "green")
        document.querySelector(".turn h1").innerHTML=(gs.turn==gs.playerType ? "Your Turn" : gs.turn=="A" ? "Red' Turn" : "Green's Turn")
        for (const token of tokens) {
            token.element.classList.remove("movable")
        }
    }

    function scorePoint(id, player){
        for (let token of tokens) {
            if (token.id == id) {
                token.path[token.pos].removeChild(token.element)
                const scoreMessage = {
                    "type": Messages.T_SCORE_POINT,
                    "playerType": player,
                }
                socket.send(JSON.stringify(scoreMessage))
                return
            }
        }
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
            if (token.pos+gs.diceValue>55) scorePoint(token.id, gs.playerType)
            else move(token.id, gs.diceValue)
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

        if (incomingMsg.type == Messages.O_SCORE_POINT.type) {
            if (incomingMsg.playerType=="A"){
                document.querySelectorAll("#playerA img")[gs.playerAScore].classList.remove("notActive")
                playerAScore++;
                if (playerAScore==4) {
                    const gameOver = {
                        "type": messages.T_GAME_OVER,
                        "data": "RED WON"
                    }
                    socket.send(gameOver)
                }
            }else {
                document.querySelectorAll("#playerB img")[gs.playerBScore].classList.remove("notActive")
                playerBScore++;
                if (playerBScore==4) {
                    const gameOver = {
                        "type": messages.T_GAME_OVER,
                        "data": "GREEN WON"
                    }
                    socket.send(gameOver)
                }
            }
        }

        if (incomingMsg.type == Messages.O_GAME_OVER.type) {
            window.alert(incomingMsg.data);
            document.querySelector(".turn h1").innerHTML=incomingMsg.data
            gs=null
        }

        if (incomingMsg.type == Messages.O_START_GAME.type) {
            gs.turn=incomingMsg.data
            endTurn()
        }
    }
  
    socket.onerror = function () { };
    
})(); //execute immediately