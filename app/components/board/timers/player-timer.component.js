import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { SocketContext } from '../../../contexts/socket.context';


const PlayerTimer = () => {
  const socket = useContext(SocketContext);
  const [playerTimer, setPlayerTimer] = useState(0);

  useEffect(() => {
    socket.on("game.timer", (data) => {
      setPlayerTimer(data['playerTimer'])
    });
  }, []);

  const timerValueStyle = playerTimer < 15
    ? styles.playerTimerRed
    : styles.playerTimerGreen;

  return (
    <View style={ styles.playerTimerContainer }>
      <Text style={ styles.playerTimer }>
        Timer : <Text style={ timerValueStyle }>{ playerTimer }</Text>
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
    color: "#E66E15",
    fontSize: 14,
    fontWeight: "bold"
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
