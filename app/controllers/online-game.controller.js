import React, { useEffect, useState, useContext } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

import { SocketContext } from '../contexts/socket.context';


export default function OnlineGameController() {

  const socket = useContext(SocketContext);

  const [inQueue, setInQueue] = useState(false);
  const [inGame, setInGame] = useState(false);
  const [idOpponent, setIdOpponent] = useState(null);

  useEffect(() => {
    console.log('[emit][queue.join]:', socket.id);
    socket.emit("queue.join");
    setInQueue(false);
    setInGame(false);

    socket.on('queue.added', (data) => {
      console.log('[listen][queue.added]:', data);
      setInQueue(data['inQueue']);
      setInGame(data['inGame']);
    });

    socket.on('queue.left', (data) => {
      console.log('[listen][queue.left]:', data);
      setInQueue(data['inQueue']);
      setInGame(data['inQueue']);
      navigation.navigate("HomeScreen");
    });

    socket.on('game.start', (data) => {
      console.log('[listen][game.start]:', data);
      setInQueue(data['inQueue']);
      setInGame(data['inGame']);
      setIdOpponent(data['idOpponent']);
    });
  }, []);

  const leftQueue = () => {
    console.log('[emit][queue.leave]:', socket.id);
    socket.emit("queue.leave");
  };

  return (
    <View style={ styles.container }>
      {!inQueue && !inGame && (
        <>
          <Text style={styles.paragraph}>
            Waiting for server datas...
          </Text>
        </>
      )}

      {inQueue && (
        <>
          <Text style={ styles.paragraph }>
            Waiting for another player...
          </Text>
          <View style={ styles.buttonContainer }>
            <Button title="Quitter la file d'attente" onPress={ leftQueue } color="#d9534f" />
          </View>
        </>
      )}

      {inGame && (
        <>
          <Text style={ styles.paragraph }>
            Game found !
          </Text>
          <Text style={ styles.paragraph }>
            Player - { socket.id } -
          </Text>
          <Text style={ styles.paragraph }>
            - vs -
          </Text>
          <Text style={ styles.paragraph }>
            Player - { idOpponent } -
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: '100%',
    height: '100%',
  },
  paragraph: {
    fontSize: 16,
  },
  buttonContainer: {
    margin: 20
  }
});
