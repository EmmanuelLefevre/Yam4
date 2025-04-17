import { Button, StyleSheet, View } from "react-native";


export default function HomeScreen({ navigation }) {

  return (
    <View style={ styles.container }>
      <View style={ styles.buttonWrapper }>
        <Button
          title="Jouer en ligne"
          onPress={ () => navigation.navigate('OnlineGameScreen') }/>
      </View>
      <View style={ styles.buttonWrapper }>
        <Button
          title="Jouer contre le bot"
          onPress={ () => navigation.navigate('VsBotGameScreen') }/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonWrapper: {
    marginVertical: 10,
  }
});
