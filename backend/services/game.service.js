const GAME_INIT = {
  gameState: {
    currentTurn: 'player:1',
    timer: 60,
    player1Score: 0,
    player2Score: 0,
    grid: [],
    choices: {},
    deck: {}
  }
}

const GameService = {

  init: {
    gameState: () => {
      return GAME_INIT;
    },
  },
  send: {
    forPlayer: {
      viewGameState: (playerKey, game) => {
        return {
          inQueue: false,
          inGame: true,
          idPlayer: (playerKey === 'player:1') ? game.player1Socket.id : game.player2Socket.id,
          idOpponent: (playerKey === 'player:1') ? game.player2Socket.id : game.player1Socket.id
        };
      },

      viewQueueState: () => {
        return {
          inQueue: true,
          inGame: false
        };
      }
    }
  },
  utils: {
    findGameIndexById: (games, idGame) => {
      for (let i = 0; i < games.length; i++) {
        if (games[i].idGame === idGame) {
          return i;
        }
      }
      return -1;
    },
  }
}

module.exports = GameService;
