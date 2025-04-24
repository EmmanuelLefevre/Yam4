import React from "react";
import { ImageBackground, StyleSheet, View } from 'react-native';

import opponentImage from '../../assets/img/4680.jpg';
import playerImage from '../../assets/img/gg.jpg';

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

      <View style={ [styles.row, { height: '8%' }] }>
        <OpponentInfos />
        <View style={ styles.opponentTimerScoreContainer }>
          <OpponentTimer />
          <OpponentScore />
        </View>
      </View>

      <ImageBackground
        source={ opponentImage }
        style={ [styles.row, { height: '13%' }] }
        imageStyle={ styles.opponentBackgroundImage }
        resizeMode="cover">
        <OpponentDeck />
      </ImageBackground>

      <View style={ [styles.row, { height: '42%' }] }>
        <Grid />
        <Choices />
      </View>

      <ImageBackground
        source={ playerImage }
        style={ [styles.row, { height: '29%' }] }
        imageStyle={ styles.playerBackgroundImage }
        resizeMode="cover">
        <PlayerDeck />
      </ImageBackground>

      <View style={ [styles.row, { height: '8%' }] }>
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
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "100%"
  },
  row: {
    flexDirection: "row",
    width: "100%"
  },
  opponentBackgroundImage: {
    width: "100%",
    height: "100%"
  },
  playerBackgroundImage: {
    width: "100%",
    height: "100%"
  },
  playerTimerScoreContainer: {
    flex: 2,
    flexDirection: "column",
    justifyContent: "center",
    borderTopWidth: 2,
    borderColor: "#E66E15"
  },
  opponentTimerScoreContainer: {
    flex: 2,
    flexDirection: "column",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderColor: "#E66E15"
  }
});

export default Board;
