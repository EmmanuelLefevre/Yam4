import { StyleSheet, Text, View } from "react-native";

import { useFonts } from 'expo-font';
import { Chewy_400Regular } from '@expo-google-fonts/chewy';


const PlayerInfos = () => {
  useFonts({
    Chewy_400Regular
  });

  return (
    <View style={ styles.playerInfosContainer }>
      <View style={ styles.row }>
        <Text style={ styles.playerText }>Player</Text>
        <View style={ styles.square } />
      </View>
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  square: {
    width: 12,
    height: 12,
    backgroundColor: "#2CCED2",
    marginRight: 8
  },
  playerText: {
    fontSize: 17,
    color: "#E66E15",
    fontFamily: "Chewy_400Regular",
    fontWeight: "bold",
    letterSpacing: 1.5
  }
});

export default PlayerInfos;
