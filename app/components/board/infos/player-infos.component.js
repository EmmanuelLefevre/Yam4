import { StyleSheet, Text, View } from "react-native";


const PlayerInfos = () => {
  return (
    <View style={ styles.playerInfosContainer }>
      <Text>Player</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  playerInfosContainer: {
    flex: 7,
    justifyContent: 'center',
    alignItems: 'center',
    // borderRightWidth: 1,
    // borderColor: 'black',
    // backgroundColor: "lightgrey"
  }
});

export default PlayerInfos;
