const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  transports: ['websocket'],    // on n’utilise que WebSocket
  pingInterval: 10000,          // envoi d’un ping toutes les 10 s
  pingTimeout: 600000,          // 10 minutes avant de déclarer timeout
  cors: {
    origin: '*',                // pour le dev en local
    methods: ['GET', 'POST']
  }
});
var uniqid = require('uniqid');

const GameService = require('./services/game.service');


/*========================================================*/
/*============ CONSTANTS AND GLOBAL VARIABLES ============*/
/*========================================================*/
let games = [];
let queue = [];


/*=========================================*/
/*============ EMITTER METHODS ============*/
/*=========================================*/
const updateClientsViewTimers = (game) => {
  game.player1Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:1', game.gameState));
  game.player2Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:2', game.gameState));
};

const updateClientsViewDecks = (game) => {
  setTimeout(() => {
    game.player1Socket.emit('game.deck.view-state', GameService.send.forPlayer.deckViewState('player:1', game.gameState));
    game.player2Socket.emit('game.deck.view-state', GameService.send.forPlayer.deckViewState('player:2', game.gameState));
  }, 200);
};

const updateClientsViewChoices = (game) => {
  setTimeout(() => {
    game.player1Socket.emit('game.choices.view-state', GameService.send.forPlayer.choicesViewState('player:1', game.gameState));
    game.player2Socket.emit('game.choices.view-state', GameService.send.forPlayer.choicesViewState('player:2', game.gameState));
  }, 200);
}

const updateClientsViewScores = (game) => {
  const {player1Score, player2Score} = game.gameState;
  game.player1Socket.emit('game.score', {playerScore: player1Score, opponentScore: player2Score,});
  game.player2Socket.emit('game.score', {playerScore: player2Score, opponentScore: player1Score,});
};

const updateClientsViewGrid = (game) => {
  game.player1Socket.emit('game.grid.view-state', GameService.send.forPlayer.gridViewState('player:1', game.gameState));
  game.player2Socket.emit('game.grid.view-state', GameService.send.forPlayer.gridViewState('player:2', game.gameState));
};
const updateClientsViewState = (game) => {
  game.player1Socket.emit("game.state", game.gameState);
  game.player2Socket.emit("game.state", game.gameState);
};

/*======================================*/
/*============ GAME METHODS ============*/
/*======================================*/
const newPlayerInQueue = (socket) => {

  queue.push(socket);

  if (queue.length >= 2) {
    const player1Socket = queue.shift();
    const player2Socket = queue.shift();
    createGame(player1Socket, player2Socket);
  } else {
    socket.emit('queue.added', GameService.send.forPlayer.viewQueueState());
  }
};

const createGame = (player1Socket, player2Socket) => {
  const newGame = GameService.init.gameState();



  newGame['idGame'] = uniqid();
  newGame['player1Socket'] = player1Socket;
  newGame['player2Socket'] = player2Socket;

  games.push(newGame);

  const gameIndex = GameService.utils.findGameIndexById(games, newGame.idGame);

  const state1 = GameService.send.forPlayer.viewGameState('player:1', games[gameIndex]);
  state1.playerKey = 'player:1';                          // ← sa clé
  state1.botKey    = 'player:2';                          // ← la clé du bot
  state1.idPlayer  = games[gameIndex].player1Socket.id;   // ← son socket.id
  games[gameIndex].player1Socket.emit('game.start', state1);

  // Pour le joueur 2 (le bot stub)
  const state2 = GameService.send.forPlayer.viewGameState('player:2', games[gameIndex]);
  state2.playerKey = 'player:2';                          // ← sa clé (BOT)
  state2.botKey    = 'player:1';                          // ← la clé du vrai joueur
  state2.idPlayer  = games[gameIndex].player2Socket.id;   // ← "BOT"
  games[gameIndex].player2Socket.emit('game.start', state2);

  games[gameIndex].player2Socket.emit('game.start', state2);
  games[gameIndex].gameState.grid = GameService.grid.resetcanBeCheckedCells(games[gameIndex].gameState.grid);

  updateClientsViewScores(games[gameIndex])
  updateClientsViewTimers(games[gameIndex]);
  updateClientsViewDecks(games[gameIndex]);
  updateClientsViewGrid(games[gameIndex]);
  updateClientsViewState(games[gameIndex]);

  const gameInterval = setInterval(() => {
    games[gameIndex].gameState.timer--;

    updateClientsViewTimers(games[gameIndex]);

    if (games[gameIndex].gameState.timer === 0) {
      games[gameIndex].gameState.currentTurn = games[gameIndex].gameState.currentTurn === 'player:1' ? 'player:2' : 'player:1';
      games[gameIndex].gameState.timer = GameService.timer.getTurnDuration();
      games[gameIndex].gameState.deck = GameService.init.deck();
      games[gameIndex].gameState.choices = GameService.init.choices();
      games[gameIndex].gameState.grid = GameService.grid.resetcanBeCheckedCells(games[gameIndex].gameState.grid);


      updateClientsViewScores(games[gameIndex])
      updateClientsViewTimers(games[gameIndex]);
      updateClientsViewDecks(games[gameIndex]);
      updateClientsViewChoices(games[gameIndex]);
      updateClientsViewGrid(games[gameIndex])
      updateClientsViewState(games[gameIndex]);
    }

    games[gameIndex].player1Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:1', games[gameIndex].gameState));
    games[gameIndex].player2Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:2', games[gameIndex].gameState));
  }, 1000);

  games[gameIndex].gameInterval = gameInterval;

};

const leftQueue = (socket) => {
  queue.shift(socket);
  socket.emit('queue.left', GameService.send.forPlayer.viewQueueStateLeave());
}


/*============================================*/
/*============ SOCKETS MANAGEMENT ============*/
/*============================================*/
io.on('connection', socket => {
  console.log(`[${socket.id}] socket connected`);



  socket.on('queue.join', () => {
    console.log(`[${socket.id}] new player in queue `);
    newPlayerInQueue(socket);
  });

  socket.on('queue.leave', () => {
    console.log(`Player [${socket.id}] want to leave the queue`);
    leftQueue(socket);
  });

  socket.on('disconnect', reason => {
    console.log(`[${socket.id}] socket disconnected - ${reason}`);
  });

  socket.on("vs-bot.start", () => {
    const botStub = { id: "BOT", emit: (e,d) => socket.emit(e,d) };
    createGame(socket, botStub);
  });

  socket.on('game.dices.roll', () => {
    const idx   = GameService.utils.findGameIndexBySocketId(games, socket.id);
    const game  = games[idx];
    const state = game.gameState;
    const deck  = state.deck;

    if (deck.rollsCounter < deck.rollsMaximum - 1) {
      deck.dices        = GameService.dices.roll(deck.dices);
      deck.rollsCounter += 1;
      const isSec = deck.rollsCounter === 1

      let combos = GameService.choices.findCombinations(
          deck.dices,
          /* isDefi */ false,
          /* isSec  */ isSec
      );

      if (deck.rollsCounter === 2 && combos.length === 0) {
        combos = [{ id: 'defi', value: 'Défi' }];
      }

      state.choices.availableChoices = combos;

      updateClientsViewDecks(game);
      updateClientsViewChoices(game);
      updateClientsViewTimers(game);
      updateClientsViewState(game);
      return;
    }

    deck.dices        = GameService.dices.roll(deck.dices);
    deck.rollsCounter += 1;
    deck.dices        = GameService.dices.lockEveryDice(deck.dices);

    let combos = [];

    if (state.choices.isChallenge) {
      const all = GameService.choices.findCombinations(deck.dices, true, false);
      const success = all.some(c =>
          !c.id.startsWith('brelan') && c.id !== 'moinshuit'
      );
      if (success) {
        combos = [{ id: 'defi', value: 'Défi' }];
      } else {
        combos = [];
      }
    } else {
      combos = GameService.choices.findCombinations(deck.dices, false, false);
    }

    state.choices.availableChoices = combos;
    state.timer = combos.length === 0
        ? 5
        : GameService.timer.getEndTurnDuration();

    updateClientsViewDecks(game);
    updateClientsViewChoices(game);
    updateClientsViewTimers(game);
    updateClientsViewState(game);
  });

  socket.on('game.dices.lock', (idDice) => {
    const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
    const indexDice = GameService.utils.findDiceIndexByDiceId(games[gameIndex].gameState.deck.dices, idDice);

    games[gameIndex].gameState.deck.dices[indexDice].locked = !games[gameIndex].gameState.deck.dices[indexDice].locked;

    updateClientsViewDecks(games[gameIndex]);
  });

  socket.on('game.choices.selected', ({ choiceId }) => {
    const idx   = GameService.utils.findGameIndexBySocketId(games, socket.id);
    const game  = games[idx];
    const state = game.gameState;

    state.choices.idSelectedChoice = choiceId;
    state.choices.isChallenge = (choiceId === 'defi');
    state.choices.isSec = (choiceId === 'sec')
    state.grid = GameService.grid.resetcanBeCheckedCells(state.grid);
    state.grid = GameService.grid.updateGridAfterSelectingChoice(
        choiceId,
        state.grid,
        state.currentTurn
    );

    updateClientsViewChoices(game);
    updateClientsViewGrid(game);
    updateClientsViewState(game);
  });


  socket.on('game.grid.selected', ({idCell, rowIndex, cellIndex}) => {
    const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
    const game = games[gameIndex];
    const state     = game.gameState;
    const playerKey = (socket.id === game.player1Socket.id) ? 'player:1' : 'player:2';

    state.grid = GameService.grid.selectCell(
        idCell,
        rowIndex,
        cellIndex,
        playerKey,
        state.grid
    );

    state.choices.isChallenge = false;

    const { points, win } = GameService.calculateScore(
        rowIndex,
        cellIndex,
        playerKey,
        state.grid
    );
    if (playerKey === 'player:1') state.player1Score += points;
    else                           state.player2Score += points;


    updateClientsViewGrid(game);
    updateClientsViewScores(game);
    updateClientsViewState(game);


    const totalPlaced = state.grid.flat().filter(c => c.owner === playerKey).length;
    if (win || totalPlaced >= 12) {
      const p1 = game.gameState.player1Score;
      const p2 = game.gameState.player2Score;
      const winner =
          p1 > p2 ? game.player1Socket.id
              : p2 > p1 ? game.player2Socket.id
                  : null;


      game.player1Socket.emit('game.end', {player1Score: p1, player2Score: p2, winner});
      game.player2Socket.emit('game.end', {player1Score: p1, player2Score: p2, winner});
      clearInterval(games[gameIndex].gameInterval);
      return;
    }
    state.currentTurn = playerKey === 'player:1' ? 'player:2' : 'player:1';
    state.timer       = GameService.timer.getTurnDuration();
    state.deck        = GameService.init.deck();
    state.choices     = GameService.init.choices();
    state.grid        = GameService.grid.resetcanBeCheckedCells(state.grid);

    updateClientsViewTimers(game);
    updateClientsViewDecks(game);
    updateClientsViewChoices(game);
    updateClientsViewGrid(game);
    updateClientsViewState(game);
  });
});


/*========================================*/
/*============ SERVER METHODS ============*/
/*========================================*/
app.get('/', (req, res) => res.sendFile('index.html'));

http.listen(3000, function () {
  console.log('listening on *:3000');
});
