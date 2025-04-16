import { StyleSheet, Text, View } from "react-native";


const Grid = () => {
  return (
    <View style={ styles.gridContainer }>
      <Text>Grid</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flex: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: 'black',
  }
});

export default Grid;
