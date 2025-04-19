import React from "react";
import { StyleSheet, View } from 'react-native';

import Choices from './choices/choices.component';
import Grid from './grid/grid.component';
import OpponentDeck from './decks/opponent-deck.component';
import OpponentInfos from './infos/opponent-infos.component';
import OpponentScore from './scores/opponent-score.component';
import OpponentTimer from './timers/opponent-timer.component';
import PlayerDeck from './decks/player-deck.component';
import PlayerInfos from './infos/player-infos.component';
import PlayerScore from './scores/player-score.component';
import PlayerTimer from './timers/player-timer.component';


const Board = ({ gameViewState}) => {
  return (
    <View style={ styles.container }>

      <View style={ [styles.row, { height: '10%' }] }>
        <OpponentInfos />
        <View style={ styles.opponentTimerScoreContainer }>
          <OpponentTimer />
          <OpponentScore />
        </View>
      </View>

      <View style={ [styles.row, { height: '15%' }] }>
        <OpponentDeck />
      </View>

      <View style={ [styles.row, { height: '40%' }] }>
        <Grid />
        <Choices />
      </View>

      <View style={ [styles.row, { height: '25%' }] }>
        <PlayerDeck />
      </View>

      <View style={ [styles.row, { height: '10%' }] }>
        <PlayerInfos />
        <View style={ styles.playerTimerScoreContainer }>
          <PlayerTimer />
          <PlayerScore />
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  },
  row: {
    height: 20,
    flexDirection: 'row',
    width: '100%'
  },
  playerTimerScoreContainer: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 2,
    borderColor: "#E66E15"
  },
  opponentTimerScoreContainer: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: "#E66E15"
  }
});

export default Board;
