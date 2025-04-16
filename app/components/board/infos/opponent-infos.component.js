import { StyleSheet, Text, View } from "react-native";


const OpponentInfos = () => {
  return (
    <View style={ styles.opponentInfosContainer }>
      <Text>Opponent infos</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  opponentInfosContainer: {
    flex: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: 'black',
    backgroundColor: "lightgrey"
  }
});

export default OpponentInfos;
