const TURN_DURATION = 60;
const GET_END_TURN_DURATION = 20;

const DECK_INIT = {
  dices: [
    { id: 1, value: '', locked: true },
    { id: 2, value: '', locked: true },
    { id: 3, value: '', locked: true },
    { id: 4, value: '', locked: true },
    { id: 5, value: '', locked: true },
  ],
  rollsCounter: 1,
  rollsMaximum: 3
};

const GAME_INIT = {
  gameState: {
    currentTurn: 'player:1',
    timer: TURN_DURATION,
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
      const game = { ...GAME_INIT };
      game['gameState']['timer'] = TURN_DURATION;
      game['gameState']['deck'] = { ...DECK_INIT };
      return game;
    },

    deck: () => {
      return { ...DECK_INIT };
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

      deckViewState: (playerKey, gameState) => {
        const deckViewState = {
            displayPlayerDeck: gameState.currentTurn === playerKey,
            displayOpponentDeck: gameState.currentTurn !== playerKey,
            displayRollButton: gameState.deck.rollsCounter <= gameState.deck.rollsMaximum,
            rollsCounter: gameState.deck.rollsCounter,
            rollsMaximum: gameState.deck.rollsMaximum,
            dices: gameState.deck.dices
        };
        return deckViewState;
      },

      viewQueueState: () => {
        return {
          inQueue: true,
          inGame: false,
        };
      },

      viewQueueStateLeave: () => {
        return {
            inQueue: false,
            inGame: false,
        };
      },

      gameTimer: (playerKey, gameState) => {
        const playerTimer = gameState.currentTurn === playerKey ? gameState.timer : 0;
        const opponentTimer = gameState.currentTurn === playerKey ? 0 : gameState.timer;

        return { playerTimer: playerTimer, opponentTimer: opponentTimer };
      },

      deckViewState: (playerKey, gameState) => {
        const deckViewState = {
            displayPlayerDeck: gameState.currentTurn === playerKey,
            displayOpponentDeck: gameState.currentTurn !== playerKey,
            displayRollButton: gameState.deck.rollsCounter <= gameState.deck.rollsMaximum,
            rollsCounter: gameState.deck.rollsCounter,
            rollsMaximum: gameState.deck.rollsMaximum,
            dices: gameState.deck.dices
        };
        return deckViewState;
      },
    }
  },
  timer: {
    getTurnDuration: () => {
      return TURN_DURATION;
    },

    getEndTurnDuration: () => {
      return GET_END_TURN_DURATION;
    }
  },
  dices: {
    roll: (dicesToRoll) => {
      const rolledDices = dicesToRoll.map(dice => {
        if (dice.value === "") {
          // Si la valeur du dé est vide, alors on le lance en mettant le flag locked à false
          const newValue = String(Math.floor(Math.random() * 6) + 1);
          return {
            id: dice.id,
            value: newValue,
            locked: false
          };
        }
        else if (!dice.locked) {
          // Si le dé n'est pas verrouillé et possède déjà une valeur, alors on le relance
          const newValue = String(Math.floor(Math.random() * 6) + 1);
          return {
            ...dice,
            value: newValue
          };
        }
        else {
          // Si le dé est verrouillé ou a déjà une valeur mais le flag locked est true, on le laisse tel quel
          return dice;
        }
      });
      return rolledDices;
    },

    lockEveryDice: (dicesToLock) => {
      const lockedDices = dicesToLock.map(dice => ({
        ...dice,
        locked: true
      }));
      return lockedDices;
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

    findGameIndexBySocketId: (games, socketId) => {
      for (let i = 0; i < games.length; i++) {
        if (games[i].player1Socket.id === socketId || games[i].player2Socket.id === socketId) {
          return i;
        }
      }
      return -1;
    },

    findDiceIndexByDiceId: (dices, idDice) => {
      for (let i = 0; i < dices.length; i++) {
        if (dices[i].id === idDice) {
          return i;
        }
      }
      return -1;
    }
  },
}

module.exports = GameService;
