/* 
 game statistics "tracker".
*/

var gameStatus = {
  since: Date.now() /* since we keep it simple and in-memory, keep track of when this object was created */,
  gamesInitialized: 0 /* number of games initialized for game id */,
  gamesOngoing: 0 /* number of games ongoing */,
  playersOnline: 0 /* number of players online */,
  gamesCompleted: 0 /* number of games successfully completed */
};

module.exports = gameStatus;