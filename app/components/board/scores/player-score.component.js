import { StyleSheet, Text, View } from "react-native";

import { useFonts } from 'expo-font';
import { Chewy_400Regular } from '@expo-google-fonts/chewy';


const PlayerScore = () => {
  useFonts({
    Chewy_400Regular
  });

  return (
    <View style={ styles.playerScoreContainer }>
      <Text style={ styles.playerScore }>Score : </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  playerScoreContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  playerScore: {
    fontSize: 14,
    color: "#E66E15",
    fontFamily: "Chewy_400Regular",
    fontWeight: "bold",
    letterSpacing: 1.2
  }
});

export default PlayerScore;