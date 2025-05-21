const GameService = require('../../backend/services/game.service');

// Helper : compter les occurrences de chaque valeur de dé
function getValueCounts(dices) {
  return dices.reduce((acc, d) => {
    const v = d.value;
    acc[v] = (acc[v] || 0) + 1;
    return acc;
  }, {});
}

// Helper : trouver la plus longue ligne pour un joueur
function findLongestLine(grid, playerKey) {
  const directions = [
    [[0,1],[0,-1]],
    [[1,0],[-1,0]],
    [[1,1],[-1,-1]],
    [[1,-1],[-1,1]],
  ];
  let max = 0, bestId = null;

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const cell = grid[r][c];
      if (cell.owner !== playerKey) continue;
      directions.forEach(pair => {
        let count = 1;
        pair.forEach(([dr,dc]) => {
          let rr = r + dr, cc = c + dc;
          while (grid[rr] && grid[rr][cc] && grid[rr][cc].owner === playerKey) {
            count++;
            rr += dr; cc += dc;
          }
        });
        if (count > max) {
          max = count;
          bestId = cell.id;
        }
      });
    }
  }
  return { length: max, id: bestId };
}

module.exports = {
  /**
   * Choix des dés à relancer (true = relancer, false = lock)
   */
  chooseDiceToRoll(dices, rollsCounter, grid, gameState, playerKey) {
    // 1) On détermine la cible
    const target = this.chooseCombination(
      gameState.choices.availableChoices,
      grid,
      gameState,
      playerKey
    );

    // par défaut, on relance tout
    const reroll = dices.map(() => true);
    if (!target) {
      return reroll;
    }

    // 2) On prépare le tableau de relance / verrouillage
    switch (true) {
      // BrelanX -> lock tous les dés de valeur X
      case /^brelan[1-6]$/.test(target): {
        const val = target.slice(-1);
        return dices.map(d => d.value !== val);
      }

      // Full -> lock triple + paire
      case target === 'full': {
        const counts = getValueCounts(dices);
        let tripleValue = null, pairValue = null;
        Object.entries(counts).forEach(([v,c]) => {
          if (c >= 3) tripleValue = v;
          else if (c >= 2) pairValue = v;
        });
        return dices.map(d =>
          !(d.value === tripleValue || d.value === pairValue)
        );
      }

      // Suite -> lock sur la plus longue suite
      case target === 'suite': {
        const vals = dices.map(d => parseInt(d.value)).sort((a,b) => a-b);
        let bestRun = [vals[0]], currRun = [vals[0]];
        for (let i = 1; i < vals.length; i++) {
          if (vals[i] === currRun[currRun.length-1] ||
            vals[i] === currRun[currRun.length-1] + 1) {
            currRun.push(vals[i]);
          }
          else {
            currRun = [vals[i]];
          }
          if (currRun.length > bestRun.length) bestRun = [...currRun];
        }
        return dices.map(d =>
            !bestRun.includes(parseInt(d.value))
        );
      }

      // Yam -> lock toutes les valeurs les plus fréquentes
      case target === 'yam': {
        const counts = getValueCounts(dices);
        const maxCount = Math.max(...Object.values(counts));
        const topVals = Object.keys(counts).filter(v => counts[v] === maxCount);
        return dices.map(d =>
          !topVals.includes(d.value)
        );
      }

      // ≤8 -> on garde tout tel quel (pas de verrouillage)
      case target === 'moinshuit': {
        return dices.map(() => false);
      }

      // Déf/ Sec / autres -> on relance tout
      default:
        return reroll;
    }
  },

  /**
   * Choix de la combinaison à valider
   */
  chooseCombination(availableChoices, grid, gameState, playerKey) {
    // 1) Sec immédiat si dispo (après un premier jet)
    if (gameState.deck.rollsCounter === 1) {
      if (availableChoices.find(c => c.id === 'sec')) return 'sec';
    }

    // 2) Menace adverse
    const oppKey = playerKey === 'player:1' ? 'player:2' : 'player:1';
    const oppLine = findLongestLine(grid, oppKey);
    if (oppLine.length >= 4 && availableChoices.find(c => c.id === oppLine.id)) {
      return oppLine.id;
    }

    // 3) Opportunité de gagner
    const myLine = findLongestLine(grid, playerKey);
    if (myLine.length >= 4 && availableChoices.find(c => c.id === myLine.id)) {
      return myLine.id;
    }

    // 4) Greedy sur points
    const priority = ['yam','suite','carre','full'];
    for (let v = 6; v >= 1; v--) priority.push('brelan'+v);
    priority.push('moinshuit');
    for (let id of priority) {
      if (availableChoices.find(c => c.id === id)) return id;
    }

    // fallback
    return availableChoices[0]?.id || null;
  },

  /**
   * Choix de la case où poser
   */
  chooseCellToPlace(idSelectedChoice, grid, gameState, playerKey) {
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        const cell = grid[r][c];
        if (cell.canBeChecked) return [r, c];
      }
    }
    return null;
  }
};
