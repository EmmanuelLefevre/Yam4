import { StyleSheet, Text, View } from "react-native";


const PlayerScore = () => {

  return (
    <View style={ styles.playerScoreContainer }>
      <Text style={ styles.playerScore }>Score : </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  playerScoreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerScore: {
    color: "#E66E15",
    fontSize: 14,
    fontWeight: 'bold'
  }
});

export default PlayerScore;