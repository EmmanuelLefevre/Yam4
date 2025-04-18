import { StyleSheet, Text, View } from "react-native";


const PlayerScore = () => {

  return (
    <View style={ styles.playerScoreContainer }>
      <Text>Score: </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  playerScoreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: "lightgrey"
  }
});

export default PlayerScore;