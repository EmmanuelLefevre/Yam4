import React, { useContext, useEffect, useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFonts } from 'expo-font';
import { Chewy_400Regular } from '@expo-google-fonts/chewy';

import { SocketContext } from '@/contexts/socket.context';
import Board from "@/components/board/board.component";

export default function OnlineGameController({ navigation }) {
  useFonts({ Chewy_400Regular });

  const socket = useContext(SocketContext);

  const [inQueue, setInQueue] = useState(false);
  const [inGame, setInGame] = useState(false);
  const [idOpponent, setIdOpponent] = useState(null);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });

  // --- useEffect principal : queue / start / leave ---
  useEffect(() => {
    if (!socket) return;

    console.log('[emit][queue.join]:', socket.id);
    socket.emit("queue.join");
    setInQueue(false);
    setInGame(false);

    socket.on('queue.added', (data) => {
      console.log('[listen][queue.added]:', data);
      setInQueue(data.inQueue);
      setInGame(data.inGame);
    });

    socket.on('queue.left', (data) => {
      console.log('[listen][queue.left]:', data);
      setInQueue(data.inQueue);
      setInGame(data.inQueue);
      navigation.navigate("HomeScreen");
    });

    socket.on('game.start', (data) => {
      console.log('[listen][game.start]:', data);
      setInQueue(data.inQueue);
      setInGame(data.inGame);
      setIdOpponent(data.idOpponent);
    });

    return () => {
      socket.off('queue.added');
      socket.off('queue.left');
      socket.off('game.start');
    };
  }, [socket, navigation]);

  // --- useEffect secondaire : réception des scores ---
  useEffect(() => {
    if (!socket) return;

    const onScore = ({ player1Score, player2Score }) => {
      setScores({ player1: player1Score, player2: player2Score });
    };

    socket.on("game.score", onScore);
    return () => {
      socket.off("game.score", onScore);
    };
  }, [socket]);

  const leftQueue = () => {
    console.log('[emit][queue.leave]:', socket.id);
    socket.emit("queue.leave");
  };

  return (
      <View style={styles.container}>
        {/* État initial / pas de connexion */}
        {!inQueue && !inGame && (
            <Text style={styles.paragraph}>
              Waiting for server data...
            </Text>
        )}

        {/* En file d’attente */}
        {inQueue && (
            <>
              <Text style={styles.paragraph}>
                Waiting for another player...
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.customButton} onPress={leftQueue}>
                  <Text style={styles.buttonText}>Leave queue</Text>
                </TouchableOpacity>
              </View>
            </>
        )}

        {/* En jeu */}
        {inGame && (
            <>
              {/* Affichage des scores */}
              <View style={styles.scoresContainer}>
                <Text style={styles.paragraph}>Your score: {scores.player1}</Text>
                <Text style={[styles.paragraph, styles.opponentScore]}>
                  Opponent: {scores.player2}
                </Text>
              </View>

              {/* Plateau de jeu */}
              <Board />
            </>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#24282C",
  },
  paragraph: {
    color: "#6B6F73",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Chewy_400Regular",
  },
  buttonContainer: {
    margin: 20,
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
        ? { boxShadow: "5px 5px 6px rgba(0, 0, 0, 0.4)" }
        : {
          shadowColor: "#000",
          shadowOffset: { width: 5, height: 5 },
          shadowOpacity: 0.4,
          shadowRadius: 6,
        }),
  },
  buttonText: {
    fontSize: 17,
    color: "#6B6F73",
    fontFamily: "Chewy_400Regular",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  scoresContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  opponentScore: {
    marginLeft: 24,
  },
});
