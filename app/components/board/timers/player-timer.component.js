import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useFonts } from 'expo-font';
import { Chewy_400Regular } from '@expo-google-fonts/chewy';

import { SocketContext } from '../../../contexts/socket.context';


const PlayerTimer = () => {
  useFonts({
    Chewy_400Regular
  });

  const socket = useContext(SocketContext);
  const [playerTimer, setPlayerTimer] = useState(0);

  useEffect(() => {
    socket.on("game.timer", (data) => {
      setPlayerTimer(data['playerTimer'])
    });
  }, []);

  const playerTimerValueStyle = playerTimer < 15
    ? styles.playerTimerRed
    : styles.playerTimerGreen;

  return (
    <View style={ styles.playerTimerContainer }>
      <Text style={ styles.playerTimer }>
        Timer :
        <Text style={[ playerTimerValueStyle, styles.timerValue ]}>
          { ` ${ playerTimer }` }
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  playerTimerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  playerTimer: {
    fontSize: 12,
    color: "#E66E15",
    fontFamily: "Chewy_400Regular",
    fontWeight: "bold",
    letterSpacing: 1.2
  },
  timerValue: {
    width: 30,
    textAlign: "center",
    display: "inline-block"
  },
  playerTimerGreen: {
    color: "#8AB70E",
    fontWeight: "bold"
  },
  playerTimerRed: {
    color: "#FF0000",
    fontWeight: "bold"
  }
})

export default PlayerTimer;
