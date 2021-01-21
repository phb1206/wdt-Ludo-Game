var express = require("express");
var http = require("http");
var websocket = require("ws");

var indexRouter = require("./routes/index");
var messages = require("./public/scripts/messages");

var port = process.argv[2];
var app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

var gameStatus = require("./statTracker");
var Game = require("./connect");

app.get("/", (req, res) => {
  res.render("splash.ejs", {
    gamesInitialized: gameStatus.gamesInitialized,
    playersOnline: gameStatus.playersOnline,
    gamesCompleted: gameStatus.gamesCompleted
  });
});

app.get("/game", indexRouter);



var server = http.createServer(app);
const wss = new websocket.Server({ server });

var websockets = {}; //property: websocket, value: game

/*
 * regularly clean up the websockets object
 */
setInterval(function() {
  for (let i in websockets) {
    if (Object.prototype.hasOwnProperty.call(websockets,i)) {
      let gameObj = websockets[i];
      //if the gameObj has a final status, the game is complete/aborted
      if (gameObj.finalStatus != null) {
        delete websockets[i];
      }
    }
  }
}, 50000);

var currentGame = new Game(gameStatus.gamesInitialized++);
var connectionID = 0; //each websocket receives a unique ID

wss.on("connection", function connection(ws) {
    gameStatus.playersOnline++;
  /*
   * two-player game: every two players are added to the same game
   */
  let con = ws;
  connectionID++;
  con.id = connectionID;
  let playerType = currentGame.addPlayer(con);
  websockets[con.id] = currentGame;

  console.log(
    "Player %s placed in game %s as %s",
    con.id,
    currentGame.id,
    playerType
  );


    /*
   * inform the client about its assigned player type
   */
  con.send(playerType == "A" ? messages.S_PLAYER_A : messages.S_PLAYER_B);


  /*if (playerType == "B" && currentGame.getWord() != null) {
    let msg = messages.O_TARGET_WORD;
    msg.data = currentGame.getWord();
    con.send(JSON.stringify(msg));
  }*/

  /*
   * once we have two players, there is no way back;
   * a new game object is created;
   * if a player now leaves, the game is aborted (player is not preplaced)
   */
  if (currentGame.hasTwoConnectedPlayers()) {
    let msg = {
      "type": messages.T_START_GAME,
      "data": (Math.floor(Math.random() * 2)==0? "A" : "B")
    }
    currentGame.playerA.send(JSON.stringify(msg))
    currentGame.playerB.send(JSON.stringify(msg))
    currentGame = new Game(gameStatus.gamesInitialized++);
  }
    
  /*
   * message coming in from a player:
   *  1. determine the game object
   *  2. determine the opposing player OP
   *  3. send the message to OP
   */

  con.on("message", function incoming(message) {
    let oMsg = JSON.parse(message);

    let gameObj = websockets[con.id];
    let isPlayerA = gameObj.playerA == con ? true : false;

    if (oMsg.type == messages.T_ROLL_DICE) {
      const dice = {
        "type": exports.T_DICE_ROLLED,
        "data": Math.floor(Math.random() * 6 + 1)
      }

      gameObj.playerA.send(JSON.stringify(dice))
      gameObj.playerB.send(JSON.stringify(dice))
    }

    if (oMsg.type == messages.T_SCORE_POINT) {
      if (gameObj.hasTwoConnectedPlayers()) {
        gameObj.playerA.send(message);
        gameObj.playerB.send(message);
      }
    }
    if (oMsg.type == messages.T_GAME_OVER) {
      if (gameObj.hasTwoConnectedPlayers()) {
        gameObj.playerA.send(message);
        gameObj.playerB.send(message);
        gameObj.playerA.close();
        gameObj.playerA = null;
        gameObj.playerB.close();
        gameObj.playerB = null;
      }
    }

    if (isPlayerA) {
      if (oMsg.type == messages.T_TOKEN_MOVE || oMsg.type == messages.T_END_TURN) {
        if (gameObj.hasTwoConnectedPlayers()) {
          gameObj.playerB.send(message);
        }
      }
    }else {
      if (oMsg.type == messages.T_TOKEN_MOVE || oMsg.type == messages.T_END_TURN) {
        if (gameObj.hasTwoConnectedPlayers()) {
          gameObj.playerA.send(message);
        }
      }
    }
  })

  con.on("close", function(code) {
    /*
     * code 1001 means almost always closing initiated by the client;
     * source: https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
     */
    console.log(con.id + " disconnected ...");
      gameStatus.playersOnline--;

    if (code == "1001") {
      /*
       * if possible, abort the game; if not, the game is already completed
       */
      let gameObj = websockets[con.id];

      if (gameObj.isValidTransition(gameObj.gameState, "ABORTED")) {
        gameObj.setStatus("ABORTED");

        const gameOver = {
          "type": messages.T_GAME_OVER,
          "data": "ABORTED"
        }

        /*
         * determine whose connection remains open;
         * close it
         */
        try {
          gameObj.playerA.send(JSON.stringify(gameOver))
          gameObj.playerA.close();
          gameObj.playerA = null;
        } catch (e) {
          console.log("Player A closing: " + e);
        }

        try {
          gameObj.playerB.send(JSON.stringify(message))
          gameObj.playerB.close();
          gameObj.playerB = null;
        } catch (e) {
          console.log("Player B closing: " + e);
        }
      }
    }
  });   
});

server.listen(port);