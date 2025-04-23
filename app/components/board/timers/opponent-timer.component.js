import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useFonts } from 'expo-font';
import { Chewy_400Regular } from '@expo-google-fonts/chewy';

import { SocketContext } from '../../../contexts/socket.context';


const OpponentTimer = () => {
  useFonts({
    Chewy_400Regular
  });

  const socket = useContext(SocketContext);
  const [opponentTimer, setOpponentTimer] = useState(0);

  useEffect(() => {
    socket.on("game.timer", (data) => {
      setOpponentTimer(data['opponentTimer'])
    });

  }, []);

  const timerValueStyle = opponentTimer < 15
    ? styles.opponentTimerRed
    : styles.opponentTimerGreen;

  return (
    <View style={ styles.opponentTimerContainer }>
      <Text style={ styles.opponentTimer }>
        Timer : <Text style={ timerValueStyle }>{ opponentTimer }</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  opponentTimerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  opponentTimer: {
    fontSize: 14,
    color: "#E66E15",
    fontFamily: "Chewy_400Regular",
    fontWeight: "bold",
    letterSpacing: 1.2
  },
  opponentTimerGreen: {
    color: "#8AB70E",
    fontWeight: "bold"
  },
  opponentTimerRed: {
    color: "#FF0000",
    fontWeight: "bold"
  }
})

export default OpponentTimer;
