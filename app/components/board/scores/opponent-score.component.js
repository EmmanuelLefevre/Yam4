import { StyleSheet, Text, View } from "react-native";


const OpponentScore = () => {
  return (
    <View style={ styles.opponentScoreContainer }>
      <Text style={ styles.opponentScore }>Score : </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  opponentScoreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  opponentScore: {
    color: "#E66E15",
    fontSize: 14,
    fontWeight: 'bold'
  }
});

export default OpponentScore;
