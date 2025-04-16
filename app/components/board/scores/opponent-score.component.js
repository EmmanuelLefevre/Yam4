import { StyleSheet, Text, View } from "react-native";


const OpponentScore = () => {
  return (
    <View style={ styles.opponentScoreContainer }>
      <Text>Score: </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  opponentScoreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default OpponentScore;
