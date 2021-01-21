(function(exports) {
  /*
   * Client to server: game is complete, the winner is ...
   */
  exports.T_GAME_WON_BY = "GAME-WON-BY";
  exports.O_GAME_WON_BY = {
    type: exports.T_GAME_WON_BY,
    data: null
  };

  /*
   * Server to client: abort game (e.g. if second player exited the game)
   */
  exports.O_GAME_ABORTED = {
    type: "GAME-ABORTED"
  };
  exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED);

  /*
   * Server to client: set as player A
   */
  exports.T_PLAYER_TYPE = "PLAYER-TYPE";
  exports.O_PLAYER_A = {
    type: exports.T_PLAYER_TYPE,
    data: "A"
  };
  exports.S_PLAYER_A = JSON.stringify(exports.O_PLAYER_A);

  /*
   * Server to client: set as player B
   */
  exports.O_PLAYER_B = {
    type: exports.T_PLAYER_TYPE,
    data: "B"
  };
  exports.S_PLAYER_B = JSON.stringify(exports.O_PLAYER_B);

  /*
   * Player to server: ask for dice roll
   */
  exports.T_ROLL_DICE = "ROLL_DICE";
  exports.O_ROLL_DICE = {
    type: exports.T_ROLL_DICE
  };
  exports.S_ROLL_DICE = JSON.stringify(exports.O_ROLL_DICE);

  exports.T_DICE_ROLLED = "DICE_ROLLED";
  exports.O_DICE_ROLLED = {
    type: exports.T_DICE_ROLLED,
    data: null
  };

  /*
   * Player to server: moved token position
   */

  exports.T_TOKEN_MOVE = "TOKEN_MOVE";
  exports.O_TOKEN_MOVE = {
    type: exports.T_TOKEN_MOVE,
    tokenID: null
  };
  //exports.S_TARGET_WORD does not exist, as we always need to fill the data property

      /*
   * Server to Client: Your Turn
   */
  exports.T_END_TURN = "END_TURN"
  exports.O_END_TURN = {
    type: exports.T_END_TURN
  };
  exports.S_END_TURN = JSON.stringify(exports.O_END_TURN);

  exports.T_START_GAME = "START_GAME"
  exports.O_START_GAME = {
    type: exports.T_START_GAME,
    data: null
  };

  exports.T_SCORE_POINT = "SCORE_POINT"
  exports.O_SCORE_POINT = {
    type: exports.T_SCORE_POINT,
    playerType: null
  };

  /*
   * Server to Player A & B: game over with result won/loss
   */
  exports.T_GAME_OVER = "GAME-OVER";
  exports.O_GAME_OVER = {
    type: exports.T_GAME_OVER,
    data: null
  };
})(typeof exports === "undefined" ? (this.Messages = {}) : exports);
//if exports is undefined, we are on the client; else the server