const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const uniqid = require('uniqid');

const GameService = require('./services/game.service');

let games = [];
let queue = [];

/*=========================================*/
/*============ EMITTER METHODS ============*/
/*=========================================*/
const updateClientsViewTimers = (game) => {
  game.player1Socket.emit(
      'game.timer',
      GameService.send.forPlayer.gameTimer('player:1', game.gameState)
  );
  game.player2Socket.emit(
      'game.timer',
      GameService.send.forPlayer.gameTimer('player:2', game.gameState)
  );
};

const updateClientsViewDecks = (game) => {
  setTimeout(() => {
    game.player1Socket.emit(
        'game.deck.view-state',
        GameService.send.forPlayer.deckViewState('player:1', game.gameState)
    );
    game.player2Socket.emit(
        'game.deck.view-state',
        GameService.send.forPlayer.deckViewState('player:2', game.gameState)
    );
  }, 200);
};

const updateClientsViewChoices = (game) => {
  setTimeout(() => {
    game.player1Socket.emit(
        'game.choices.view-state',
        GameService.send.forPlayer.choicesViewState('player:1', game.gameState)
    );
    game.player2Socket.emit(
        'game.choices.view-state',
        GameService.send.forPlayer.choicesViewState('player:2', game.gameState)
    );
  }, 200);
};

const updateClientsViewGrid = (game) => {
  setTimeout(() => {
    game.player1Socket.emit(
        'game.grid.view-state',
        GameService.send.forPlayer.gridViewState('player:1', game.gameState)
    );
    game.player2Socket.emit(
        'game.grid.view-state',
        GameService.send.forPlayer.gridViewState('player:2', game.gameState)
    );
  }, 200);
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
    socket.emit(
        'queue.added',
        GameService.send.forPlayer.viewQueueState()
    );
  }
};

const createGame = (player1Socket, player2Socket) => {
  const newGame = GameService.init.gameState();
  newGame.idGame = uniqid();
  newGame.player1Socket = player1Socket;
  newGame.player2Socket = player2Socket;

  games.push(newGame);
  const gameIndex = GameService.utils.findGameIndexById(
      games,
      newGame.idGame
  );

  // Notifie le démarrage
  newGame.player1Socket.emit(
      'game.start',
      GameService.send.forPlayer.viewGameState('player:1', newGame)
  );
  newGame.player2Socket.emit(
      'game.start',
      GameService.send.forPlayer.viewGameState('player:2', newGame)
  );

  // Émissions initiales
  updateClientsViewTimers(newGame);
  updateClientsViewDecks(newGame);
  updateClientsViewGrid(newGame);

  // Timer de jeu
  const gameInterval = setInterval(() => {
    const game = games[gameIndex];
    game.gameState.timer--;

    updateClientsViewTimers(game);

    if (game.gameState.timer === 0) {
      // Changement de tour
      game.gameState.currentTurn =
          game.gameState.currentTurn === 'player:1'
              ? 'player:2'
              : 'player:1';
      game.gameState.timer = GameService.timer.getTurnDuration();
      game.gameState.deck = GameService.init.deck();
      game.gameState.choices = GameService.init.choices();
      game.gameState.grid = GameService.grid.resetcanBeCheckedCells(
          game.gameState.grid
      );

      updateClientsViewTimers(game);
      updateClientsViewDecks(game);
      updateClientsViewChoices(game);
      updateClientsViewGrid(game);
    }
  }, 1000);

  // Nettoyage à la déconnexion
  player1Socket.on('disconnect', () => clearInterval(gameInterval));
  player2Socket.on('disconnect', () => clearInterval(gameInterval));
};

const leftQueue = (socket) => {
  queue = queue.filter((s) => s.id !== socket.id);
  socket.emit(
      'queue.left',
      GameService.send.forPlayer.viewQueueStateLeave()
  );
};

/*============================================*/
/*============ SOCKET MANAGEMENT ============*/
/*============================================*/
io.on('connection', (socket) => {
  console.log(`[${socket.id}] socket connected`);

  socket.on('queue.join', () => {
    console.log(`[${socket.id}] new player in queue`);
    newPlayerInQueue(socket);
  });

  socket.on('queue.leave', () => {
    console.log(`[${socket.id}] leaving queue`);
    leftQueue(socket);
  });

  socket.on('game.dices.roll', () => {
    const gameIndex = GameService.utils.findGameIndexBySocketId(
        games,
        socket.id
    );
    const game = games[gameIndex];

    if (game.gameState.deck.rollsCounter < game.gameState.deck.rollsMaximum - 1) {
      game.gameState.deck.dices = GameService.dices.roll(
          game.gameState.deck.dices
      );
      game.gameState.deck.rollsCounter++;

      const dices = game.gameState.deck.dices;
      const isDefi = false;
      const isSec = game.gameState.deck.rollsCounter === 1;

      game.gameState.choices.availableChoices = GameService.choices.findCombinations(
          dices,
          isDefi,
          isSec
      );

      updateClientsViewDecks(game);
      updateClientsViewChoices(game);
    } else {
      game.gameState.deck.dices = GameService.dices.roll(
          game.gameState.deck.dices
      );
      game.gameState.deck.rollsCounter++;
      game.gameState.deck.dices = GameService.dices.lockEveryDice(
          game.gameState.deck.dices
      );

      const dices = game.gameState.deck.dices;
      const isDefi = Math.random() < 0.15;
      const isSec = false;

      game.gameState.choices.availableChoices = GameService.choices.findCombinations(
          dices,
          isDefi,
          isSec
      );

      game.gameState.timer = GameService.timer.getEndTurnDuration();

      updateClientsViewTimers(game);
      updateClientsViewDecks(game);
      updateClientsViewChoices(game);
    }
  });

  socket.on('game.dices.lock', (idDice) => {
    const gameIndex = GameService.utils.findGameIndexBySocketId(
        games,
        socket.id
    );
    const game = games[gameIndex];
    const idx = GameService.utils.findDiceIndexByDiceId(
        game.gameState.deck.dices,
        idDice
    );

    game.gameState.deck.dices[idx].locked = !game.gameState.deck.dices[idx].locked;
    updateClientsViewDecks(game);
  });

  socket.on('game.choices.selected', (data) => {
    const gameIndex = GameService.utils.findGameIndexBySocketId(
        games,
        socket.id
    );
    const game = games[gameIndex];
    game.gameState.choices.idSelectedChoice = data.choiceId;
    game.gameState.grid = GameService.grid.resetcanBeCheckedCells(
        game.gameState.grid
    );
    game.gameState.grid = GameService.grid.updateGridAfterSelectingChoice(
        data.choiceId,
        game.gameState.grid
    );

    updateClientsViewChoices(game);
    updateClientsViewGrid(game);
  });

  socket.on('game.grid.selected', (data) => {
    // 1) Récupère la partie et capture le joueur ACTIF
    const gameIndex = GameService.utils.findGameIndexBySocketId(
        games,
        socket.id
    );
    const game = games[gameIndex];
    const currentPlayer = game.gameState.currentTurn;

    // 2) Pose du jeton pour CE joueur
    game.gameState.grid = GameService.grid.resetcanBeCheckedCells(
        game.gameState.grid
    );
    game.gameState.grid = GameService.grid.selectCell(
        data.cellId,
        data.rowIndex,
        data.cellIndex,
        currentPlayer,
        game.gameState.grid
    );

    // 3) Calcul du score + détection de victoire
    const { points, win } = GameService.calculateScore(
        data.rowIndex,
        data.cellIndex,
        currentPlayer,
        game.gameState.grid
    );

    // 4) Attribution des points au bon joueur
    if (currentPlayer === 'player:1') {
      game.gameState.player1Score += points;
    } else {
      game.gameState.player2Score += points;
    }

    // 5) Notification des scores à chaque client
    [game.player1Socket, game.player2Socket].forEach((sock) => {
      sock.emit('game.score', {
        player1Score: game.gameState.player1Score,
        player2Score: game.gameState.player2Score,
      });
    });

    // 6) Fin de partie immédiate si 5 alignés
    if (win) {
      clearInterval(game.gameInterval);
      games.splice(gameIndex, 1);
      const winner = currentPlayer;
      const loser = winner === 'player:1' ? 'player:2' : 'player:1';
      [game.player1Socket, game.player2Socket].forEach((sock) => {
        sock.emit('game.over', {
          winner,
          loser,
          player1Score: game.gameState.player1Score,
          player2Score: game.gameState.player2Score,
        });
      });
      return;
    }

    // 7) Passage au tour suivant
    game.gameState.currentTurn =
        currentPlayer === 'player:1' ? 'player:2' : 'player:1';

    // 8) Reset timer, deck, choix
    game.gameState.timer = GameService.timer.getTurnDuration();
    game.gameState.deck = GameService.init.deck();
    game.gameState.choices = GameService.init.choices();

    // 9) Réémission des vues mises à jour
    updateClientsViewTimers(game);
    updateClientsViewDecks(game);
    updateClientsViewChoices(game);
    updateClientsViewGrid(game);
  });

  socket.on('disconnect', (reason) => {
    console.log(`[${socket.id}] socket disconnected - ${reason}`);
  });
});

/*========================================*/
/*============ SERVER METHODS ============*/
/*========================================*/
app.get('/', (req, res) => res.sendFile('index.html'));
http.listen(3000, () => {
  console.log('listening on *:3000');
});
