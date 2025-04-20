import { StyleSheet, Text, View } from "react-native";


const PlayerInfos = () => {
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
    color: "#E66E15",
    fontSize: 14,
    fontWeight: "bold"
  }
});

export default PlayerInfos;
