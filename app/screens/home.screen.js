import { Button, Image, StyleSheet, View } from "react-native";

import logo from "../assets/img/logo_yam4.png";


export default function HomeScreen({ navigation }) {

  return (
    <>
      <View style={ styles.logoContainer }>
        <Image source={ logo } style={ styles.logo } resizeMode="contain" />
      </View>
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
    </>
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
  },
  logoContainer: {
    marginBottom: 10,
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 40,
  }
});
