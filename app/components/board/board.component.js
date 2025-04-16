import React from "react";
import { View, Text, StyleSheet } from 'react-native';

import OpponentDeck from './decks/opponent-deck.component';
import OpponentInfos from './infos/opponent-infos.component';
import OpponentScore from './scores/opponent-score.component';
import OpponentTimer from './timers/opponent-timer.component';
import PlayerDeck from './decks/player-deck.component';
import PlayerInfos from './infos/player-infos.component';
import PlayerScore from './scores/player-score.component';
import PlayerTimer from './timers/player-timer.component';


const Grid = () => {
  return (
    <View style={ styles.gridContainer }>
      <Text>Grid</Text>
    </View>
  );
};

const Choices = () => {
  return (
    <View style={ styles.choicesContainer }>
      <Text>Choices</Text>
    </View>
  );
};

const Board = ({ gameViewState}) => {
  return (
    <View style={ styles.container }>
      <View style={ [styles.row, { height: '5%' }] }>
        <OpponentInfos />
        <View style={ styles.opponentTimerScoreContainer }>
          <OpponentTimer />
          <OpponentScore />
        </View>
      </View>
      <View style={ [styles.row, { height: '25%' }] }>
        <OpponentDeck />
      </View>
      <View style={ [styles.row, { height: '40%' }] }>
        <Grid />
        <Choices />
      </View>
      <View style={ [styles.row, { height: '25%' }] }>
        <PlayerDeck />
      </View>
      <View style={ [styles.row, { height: '5%' }] }>
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
    height: '100%',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 1,
    borderColor: 'black',
  },
  playerTimerScoreContainer: {
    width: 100,
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "lightgrey"
  },
  opponentTimerScoreContainer: {
    width: 100,
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "lightgrey"
  },
  gridContainer: {
    flex: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: 'black',
  },
  choicesContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Board;
