import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFonts } from 'expo-font';
import { Chewy_400Regular } from '@expo-google-fonts/chewy';
import { SocketContext } from "@/contexts/socket.context";


const OpponentScore = () => {
  const socket = useContext(SocketContext);

  const [score, setScore] = useState(0);

  useEffect(() => {
    const handleScore = ({ opponentScore }) => {
      setScore(opponentScore);
    };
    socket.on("game.score", handleScore);

    return () => {
      socket.off("game.score", handleScore);
    };
  }, [socket]);

  useFonts({
    Chewy_400Regular
  });

  const opponentScoreValueStyle = score === 0
    ? styles.scoreRed
    : styles.scoreGreen;

  return (
    <View style={ styles.opponentScoreContainer }>
      <Text style={ styles.opponentScore }>
        Score :
        <Text style={ [styles.scoreValue, opponentScoreValueStyle] }>
          { ` ${ score }` }
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  opponentScoreContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  opponentScore: {
    fontSize: 12,
    color: "#E66E15",
    fontFamily: "Chewy_400Regular",
    fontWeight: "bold",
    letterSpacing: 1.2
  },
  scoreValue: {
    width: 30,
    textAlign: "center",
    display: "inline-block"
  },
  scoreGreen: {
    color: "#8AB70E",
    fontWeight: "bold"
  },
  scoreRed: {
    color: "#FF0000",
    fontWeight: "bold"
  }
});

export default OpponentScore;
