import { StyleSheet, Text, View } from "react-native";

import { useFonts } from 'expo-font';
import { Chewy_400Regular } from '@expo-google-fonts/chewy';


const OpponentScore = () => {
  useFonts({
    Chewy_400Regular
  });

  return (
    <View style={ styles.opponentScoreContainer }>
      <Text style={ styles.opponentScore }>Score : </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  opponentScoreContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  opponentScore: {
    fontSize: 14,
    color: "#E66E15",
    fontFamily: "Chewy_400Regular",
    fontWeight: "bold",
    letterSpacing: 1.2
  }
});

export default OpponentScore;
