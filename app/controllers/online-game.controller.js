import React, { useContext, useEffect, useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useFonts } from 'expo-font';
import { Chewy_400Regular } from '@expo-google-fonts/chewy';

import { SocketContext } from '../contexts/socket.context';

import Board from "../components/board/board.component";


export default function OnlineGameController() {
  useFonts({
    Chewy_400Regular
  });

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
                Leave queue
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
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#24282C"
  },
  paragraph: {
    color: "#6B6F73",
    fontSize: 16,
    fontWeight: "bold"
  },
  buttonContainer: {
    margin: 20
  },
  customButton: {
    alignItems: "center",
    width: 130,
    marginVertical: 10,
    paddingVertical: 10,
    backgroundColor: "#13171A",
    borderWidth: 1,
    borderColor: "#FF0000",
    borderRadius: 25,
    elevation: 6,
    ...(Platform.OS === "web"
      ? {
          boxShadow: "5px 5px 6px rgba(0, 0, 0, 0.4)"
        }
      : {
          shadowColor: "#000",
          shadowOffset: {
            width: 5,
            height: 5
          },
          shadowOpacity: 0.4,
          shadowRadius: 6
        }
    )
  },
  buttonText: {
    fontSize: 17,
    color: "#6B6F73",
    fontFamily: "Chewy_400Regular",
    fontWeight: "bold",
    letterSpacing: 1
  }
});
