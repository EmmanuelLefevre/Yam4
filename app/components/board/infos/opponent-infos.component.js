import { StyleSheet, Text, View } from "react-native";


const OpponentInfos = () => {
  return (
    <View style={ styles.opponentInfosContainer }>
      <Text style={ styles.opponentText }>Opponent</Text>
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
  opponentText: {
    color: "#E66E15",
    fontSize: 14,
    fontWeight: "bold"
  }
});

export default OpponentInfos;
