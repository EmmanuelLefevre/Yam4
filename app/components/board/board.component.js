import React from "react";
import { Image, ImageBackground, StyleSheet, View } from 'react-native';

import opponentImage from '@/assets/img/opponent_image.jpg';
import playerImage from '@/assets/img/player_image.jpg';

import Choices from "@/components/board/choices/choices.component";
import Grid from "@/components/board/grid/grid.component";
import OpponentDeck from "@/components/board/decks/opponent-deck.component";
import OpponentInfos from "@/components/board/infos/opponent-infos.component";
import OpponentScore from "@/components/board/scores/opponent-score.component";
import OpponentTimer from "@/components/board/timers/opponent-timer.component";
import PlayerDeck from "@/components/board/decks/player-deck.component";
import PlayerInfos from "@/components/board/infos/player-infos.component";
import PlayerScore from "@/components/board/scores/player-score.component";
import PlayerTimer from "@/components/board/timers/player-timer.component";


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

      <View style={ [styles.row, styles.opponentBackgroundImage, { height: '13%' }] }>
        <Image
          source={ opponentImage }
          style={ styles.opponentImage }
          resizeMode="cover"/>
        <OpponentDeck />
      </View>

      <View style={ [styles.row, { height: '42%' }] }>
        <Grid />
        <Choices />
      </View>

      <ImageBackground
        source={ playerImage }
        style={ [styles.row, { height: '29%' }] }
        imageStyle={ styles.playerBackgroundImage }
        resizeMode="stretch">
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
    position: "relative",
    overflow: "hidden"
  },
  opponentImage: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "230%",
    opacity: 0.9
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
