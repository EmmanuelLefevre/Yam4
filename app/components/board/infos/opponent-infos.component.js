import { StyleSheet, Text, View } from "react-native";

import { useFonts } from 'expo-font';
import { Chewy_400Regular } from '@expo-google-fonts/chewy';


const OpponentInfos = () => {
  useFonts({
    Chewy_400Regular
  });

  return (
    <View style={styles.opponentInfosContainer}>
      <View style={styles.row}>
        <Text style={styles.opponentText}>Opponent Player</Text>
        <View style={styles.square} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  opponentInfosContainer: {
    flex: 7,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 2,
    borderBottomWidth: 2,
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
    backgroundColor: "#C23028",
    marginRight: 8
  },
  opponentText: {
    fontSize: 17,
    color: "#E66E15",
    fontFamily: "Chewy_400Regular",
    fontWeight: "bold",
    letterSpacing: 1.5
  }
});

export default OpponentInfos;
