const TURN_DURATION = 60;
const GET_END_TURN_DURATION = 15;

const DECK_INIT = {
  dices: [
    { id: 1, value: '', locked: true },
    { id: 2, value: '', locked: true },
    { id: 3, value: '', locked: true },
    { id: 4, value: '', locked: true },
    { id: 5, value: '', locked: true },
  ],
  rollsCounter: 0,
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

const CHOICES_INIT = {
  isDefi: false,
  isSec: false,
  idSelectedChoice: null,
  availableChoices: [],
  isChallenge: false,
};

const ALL_COMBINATIONS = [
  { value: 'Brelan 1', id: 'brelan1' },
  { value: 'Brelan 2', id: 'brelan2' },
  { value: 'Brelan 3', id: 'brelan3' },
  { value: 'Brelan 4', id: 'brelan4' },
  { value: 'Brelan 5', id: 'brelan5' },
  { value: 'Brelan 6', id: 'brelan6' },
  { value: 'Full', id: 'full' },
  { value: 'Carré', id: 'carre' },
  { value: 'Yam', id: 'yam' },
  { value: 'Suite', id: 'suite' },
  { value: '≤8', id: 'moinshuit' },
  { value: 'Sec', id: 'sec' },
  { value: 'Défi', id: 'defi' }
];

const GRID_INIT = [
  [
    { viewContent: '1', id: 'brelan1', owner: null, canBeChecked: false },
    { viewContent: '3', id: 'brelan3', owner: null, canBeChecked: false },
    { viewContent: 'Défi', id: 'defi', owner: null, canBeChecked: false },
    { viewContent: '4', id: 'brelan4', owner: null, canBeChecked: false },
    { viewContent: '6', id: 'brelan6', owner: null, canBeChecked: false },
  ],
  [
    { viewContent: '2', id: 'brelan2', owner: null, canBeChecked: false },
    { viewContent: 'Carré', id: 'carre', owner: null, canBeChecked: false },
    { viewContent: 'Sec', id: 'sec', owner: null, canBeChecked: false },
    { viewContent: 'Full', id: 'full', owner: null, canBeChecked: false },
    { viewContent: '5', id: 'brelan5', owner: null, canBeChecked: false },
  ],
  [
    { viewContent: '≤8', id: 'moinshuit', owner: null, canBeChecked: false },
    { viewContent: 'Full', id: 'full', owner: null, canBeChecked: false },
    { viewContent: 'Yam', id: 'yam', owner: null, canBeChecked: false },
    { viewContent: 'Défi', id: 'defi', owner: null, canBeChecked: false },
    { viewContent: 'Suite', id: 'suite', owner: null, canBeChecked: false },
  ],
  [
    { viewContent: '6', id: 'brelan6', owner: null, canBeChecked: false },
    { viewContent: 'Sec', id: 'sec', owner: null, canBeChecked: false },
    { viewContent: 'Suite', id: 'suite', owner: null, canBeChecked: false },
    { viewContent: '≤8', id: 'moinshuit', owner: null, canBeChecked: false },
    { viewContent: '1', id: 'brelan1', owner: null, canBeChecked: false },
  ],
  [
    { viewContent: '3', id: 'brelan3', owner: null, canBeChecked: false },
    { viewContent: '2', id: 'brelan2', owner: null, canBeChecked: false },
    { viewContent: 'Carré', id: 'carre', owner: null, canBeChecked: false },
    { viewContent: '5', id: 'brelan5', owner: null, canBeChecked: false },
    { viewContent: '4', id: 'brelan4', owner: null, canBeChecked: false },
  ]
];


const GameService = {
  init: {
    gameState: () => {
      const game = { ...GAME_INIT };
      game['gameState']['timer'] = TURN_DURATION;
      game['gameState']['deck'] = { ...DECK_INIT };
      game['gameState']['choices'] = { ...CHOICES_INIT };
      game['gameState']['grid'] = [ ...GRID_INIT ];
      return game;
    },

    deck: () => {
      return { ...DECK_INIT };
    },

    choices: () => {
      return { ...CHOICES_INIT };
    },

    grid: () => {
      return { ...GRID_INIT };
    }
  },
  send: {
    forPlayer: {
      viewGameState: (playerKey, game) => {
        const gs = game.gameState;
        return {
          inQueue: false,
          inGame:  true,
          gameState: gs,
          deck: gs.deck,
          choices: gs.choices,
          grid: gs.grid,
          playerTimer: gs.currentTurn === playerKey ? gs.timer : 0,
          opponentTimer: gs.currentTurn === playerKey ? 0      : gs.timer,
          playerScore: playerKey === 'player:1' ? gs.player1Score : gs.player2Score,
          opponentScore: playerKey === 'player:1' ? gs.player2Score : gs.player1Score,
        };
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
          displayRollButton: gameState.deck.rollsCounter <= gameState.deck.rollsMaximum - 1,
          rollsCounter: gameState.deck.rollsCounter,
          rollsMaximum: gameState.deck.rollsMaximum,
          dices: gameState.deck.dices
        };
        return deckViewState;
      },

      choicesViewState: (playerKey, gameState) => {
        const filteredChoices = gameState.choices.availableChoices.filter(choice =>
            gameState.grid.some(row =>
                row.some(cell => cell.owner === null && cell.id === choice.id)
            )
        );

        const idSelected = filteredChoices.some(c => c.id === gameState.choices.idSelectedChoice)
            ? gameState.choices.idSelectedChoice
            : null;

        return {
          displayChoices: true,
          canMakeChoice: playerKey === gameState.currentTurn,
          idSelectedChoice: idSelected,
          availableChoices: filteredChoices
        };
      },

      gridViewState: (playerKey, gameState) => {
        return {
          displayGrid: true,
          canSelectCells: (playerKey === gameState.currentTurn) && (gameState.choices.availableChoices.length > 0),
          grid: gameState.grid,
          isChallenge: gameState.choices.isChallenge
        };
      }
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
  choices: {
    findCombinations: (dices, isDefi, isSec) => {
      const availableCombinations = [];
      const allCombinations = ALL_COMBINATIONS;

      const counts = Array(7).fill(0);

      let hasPair = false;
      let threeOfAKindValue = null;
      let hasThreeOfAKind =  false;
      let hasFourOfAKind = false;
      let hasFiveOfAKind = false;
      let hasStraight = false;
      let sum = 0;

      for (let i = 0; i < dices.length; i++) {
        const diceValue = parseInt(dices[i].value);
        counts[diceValue]++;
        sum += diceValue;
      }

      for (let i = 1; i <= 6; i++) {
        if (counts[i] === 2) {
          hasPair = true;
        }
        else if (counts[i] === 3) {
          threeOfAKindValue = i;
          hasThreeOfAKind = true;
        }
        else if (counts[i] === 4) {
          threeOfAKindValue = i;
          hasThreeOfAKind = true;
          hasFourOfAKind = true;
        }
        else if (counts[i] === 5) {
          threeOfAKindValue = i;
          hasThreeOfAKind = true;
          hasFourOfAKind = true;
          hasFiveOfAKind = true;
        }
      }

      const sortedValues = dices.map(dice => parseInt(dice.value)).sort((a, b) => a - b);

      hasStraight = sortedValues.every((value, index) => index === 0 || value === sortedValues[index - 1] + 1);

      const isLessThanEqual8 = sum <= 8;

      allCombinations.forEach(combination => {
        if (
          (combination.id.includes('brelan') && hasThreeOfAKind && parseInt(combination.id.slice(-1)) === threeOfAKindValue) ||
          (combination.id === 'full' && hasPair && hasThreeOfAKind) ||
          (combination.id === 'carre' && hasFourOfAKind) ||
          (combination.id === 'yam' && hasFiveOfAKind) ||
          (combination.id === 'suite' && hasStraight) ||
          (combination.id === 'moinshuit' && isLessThanEqual8) ||
          (combination.id === 'defi' && isDefi)
        ) {
          availableCombinations.push(combination);
        }
      });

      const notOnlyBrelan = availableCombinations.some(combination => !combination.id.includes('brelan'));

      if (isSec && availableCombinations.length > 0 && notOnlyBrelan) {
        availableCombinations.push(allCombinations.find(combination => combination.id === 'sec'));
      }

      return availableCombinations;
    },
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
  grid: {
    resetcanBeCheckedCells: (grid) => {
      const updatedGrid = grid.map(row => row.map(cell => {
        return { ...cell, canBeChecked: false };
      }));
      return updatedGrid;
    },

    updateGridAfterSelectingChoice: (idSelectedChoice, grid) => {
      if (idSelectedChoice === 'defi') {
        return grid.map(row =>
            row.map(cell => ({
              ...cell,
              canBeChecked: cell.id === 'defi' && cell.owner === null
            }))
        );
      }

      return grid.map(row =>
          row.map(cell => ({
            ...cell,
            canBeChecked:
                cell.id === idSelectedChoice &&
                cell.owner === null
          }))
      );
    },

    selectCell: (idCell, rowIndex, cellIndex, currentTurn, grid) => {
      const updatedGrid = grid.map((row, rowIndexParsing) => row.map((cell, cellIndexParsing) => {
        if ((cell.id === idCell) && (rowIndexParsing === rowIndex) && (cellIndexParsing === cellIndex)) {
          return { ...cell, owner: currentTurn };
        }
        else {
          return cell;
        }
      }));

      return updatedGrid;
    },

    isAnyCombinationAvailableOnGridForPlayer: (gameState) => {
      const currentTurn = gameState.currentTurn;
      const grid = gameState.grid;
      const availableChoices = gameState.choices.availableChoices;

      for (let row of grid) {
        for (let cell of row) {
          if (cell.owner === null) {
            for(let combination of availableChoices){
              if (cell.id === combination.id) {
                return true;
              }
            }
          }
        }
      }

      return false;
    }
  },
  calculateScore: (rowIndex, cellIndex, currentPlayer, grid) => {
    const directions = [
      [[0, 1], [0, -1]],
      [[1, 0], [-1, 0]],
      [[1, 1], [-1, -1]],
      [[1, -1], [-1, 1]],
    ];
    let totalPoints = 0;
    let win = false;

    directions.forEach(dirPair => {
      let count = 1;
      dirPair.forEach(([dR, dC]) => {
        let r = rowIndex + dR;
        let c = cellIndex + dC;
        while (
            grid[r] &&
            grid[r][c] &&
            grid[r][c].owner === currentPlayer
            ) {
          count++;
          r += dR;
          c += dC;
        }
      });

      if (count >= 5) {
        win = true;
      } else if (count === 4) {
        totalPoints += 2;
      } else if (count === 3) {
        totalPoints += 1;
      }

    });

    return { points: totalPoints, win };
  },
}

module.exports = GameService;
