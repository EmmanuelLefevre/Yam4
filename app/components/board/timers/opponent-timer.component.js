import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { SocketContext } from '../../../contexts/socket.context';


const OpponentTimer = () => {
  const socket = useContext(SocketContext);
  const [opponentTimer, setOpponentTimer] = useState(0);

  useEffect(() => {

    socket.on("game.timer", (data) => {
      setOpponentTimer(data['opponentTimer'])
    });

  }, []);
  return (
    <View style={ styles.opponentTimerContainer }>
      <Text style={ styles.opponentTimer }>
        Timer : <Text style={ styles.opponentTimerValue }>{ opponentTimer }</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  opponentTimerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  opponentTimer: {
    color: "#E66E15",
    fontSize: 14,
    fontWeight: 'bold'
  },
  opponentTimerValue: {
    color: "#15A9E6"
  }
})

export default OpponentTimer;
