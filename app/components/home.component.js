import { StyleSheet, View, Button } from "react-native";


export default function HomeComponent({ navigation }) {

  return (
    <View style={styles.container}>
      <View style={styles.buttonWrapper}>
        <Button
          title="Jouer en ligne"
          onPress={() => navigation.navigate('OnlineGameComponent')}
        />
      </View>
      <View style={styles.buttonWrapper}>
        <Button
          title="Jouer contre le bot"
          onPress={() => navigation.navigate('VsBotGameComponent')}
        />
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
