import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { SocketContext } from '../contexts/socket.context';

import Board from "../components/board/board.component";


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
            <TouchableOpacity
              style={ styles.customButton }
              onPress={ leftQueue }>
              <Text style={ styles.buttonText }>
                Quitter la file d'attente
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {inGame && (
        <>
          <Board/>
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
  },
  customButton: {
    alignItems: 'center',
    width: 190,
    marginVertical: 10,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#FF0000',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 15,
    color: '#FF0000',
    fontWeight: "bold",
  },
});
