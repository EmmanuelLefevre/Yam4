import { StyleSheet, Text, View } from "react-native";


const Choices = () => {
  return (
    <View style={ styles.choicesContainer }>
      <Text>Choices</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  choicesContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Choices;
