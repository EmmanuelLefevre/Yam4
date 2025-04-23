import { StyleSheet, Text, View } from "react-native";

import { useFonts } from 'expo-font';
import { Chewy_400Regular } from '@expo-google-fonts/chewy';


const PlayerInfos = () => {
  useFonts({
    Chewy_400Regular
  });

  return (
    <View style={ styles.playerInfosContainer }>
      <Text style={ styles.playerText }>Player</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  playerInfosContainer: {
    flex: 7,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: "#E66E15"
  },
  playerText: {
    fontSize: 19,
    color: "#E66E15",
    fontFamily: "Chewy_400Regular",
    fontWeight: "bold",
    letterSpacing: 1.5
  }
});

export default PlayerInfos;
