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
    gamesOngoing: gameStatus.gamesOngoing,
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

var currentGame = new Game(gameStatus.gamesOngoing++);
var connectionID = 0; //each websocket receives a unique ID

wss.on("connection", function connection(ws) {
  /*
   * two-player game: every two players are added to the same game
   */
  let con = ws;
  con.id = connectionID++;
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

  /*
   * once we have two players, there is no way back;
   * a new game object is created;
   * if a player now leaves, the game is aborted (player is not preplaced)
   */
  if (currentGame.hasTwoConnectedPlayers()) {
    currentGame = new Game(gameStatus.gamesOngoing++);
  }
    
});

server.listen(port);    