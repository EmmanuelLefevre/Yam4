import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import logo from "../assets/img/logo_yam4.png";


export default function HomeScreen({ navigation }) {
  return (
    <View style={ styles.container }>
      <View style={ styles.logoContainer }>
        <Image
          source={ logo }
          style={ styles.logo }
          resizeMode="contain" />
      </View>
      <View style={ styles.buttonContainer }>
        <View style={ styles.buttonWrapper }>
          <TouchableOpacity
            style={ styles.customButton }
            onPress={ () => navigation.navigate('OnlineGameScreen') }>
            <Text style={ styles.buttonText }>Jouer en ligne</Text>
          </TouchableOpacity>
        </View>
        <View style={ styles.buttonWrapper }>
          <TouchableOpacity
            style={ styles.customButton }
            onPress={ () => navigation.navigate('VsBotGameScreen') }>
            <Text style={ styles.buttonText }>Jouer contre le bot</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const { height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 40,
    backgroundColor: '#FFF',
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: screenHeight * 0.3,
    marginTop: 50,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  customButton: {
    alignItems: 'center',
    width: 160,
    marginVertical: 10,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#E66E15',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 15,
    color: '#E66E15',
    fontWeight: "bold",
  },
});
