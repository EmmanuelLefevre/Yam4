import { StyleSheet, Text, View } from "react-native";

import { useFonts } from 'expo-font';
import { Chewy_400Regular } from '@expo-google-fonts/chewy';


const OpponentScore = ({ score = 0 }) => {
  useFonts({
    Chewy_400Regular
  });

  const scoreValueStyle = score === 0
    ? styles.scoreRed
    : styles.scoreGreen;

  return (
    <View style={ styles.opponentScoreContainer }>
      <Text style={ styles.opponentScore }>
        Score :
        <Text style={ [styles.scoreValue, scoreValueStyle] }>
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
    fontSize: 14,
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
