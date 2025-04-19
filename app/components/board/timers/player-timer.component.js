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

  return (
    <View style={ styles.playerTimerContainer }>
      <Text style={ styles.playerTimer }>
        Timer : <Text style={ styles.playerTimerValue }>{ playerTimer }</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  playerTimerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  playerTimer: {
    color: "#E66E15",
    fontSize: 14,
    fontWeight: 'bold'
  },
  playerTimerValue: {
    color: "#15A9E6"
  }
})

export default PlayerTimer;
