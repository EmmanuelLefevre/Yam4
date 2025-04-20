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
            <Text style={ styles.buttonText }>Play online</Text>
          </TouchableOpacity>
        </View>
        <View style={ styles.buttonWrapper }>
          <TouchableOpacity
            style={ styles.customButton }
            onPress={ () => navigation.navigate('VsBotGameScreen') }>
            <Text style={ styles.buttonText }>Play vs bot</Text>
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
    backgroundColor: '#24282C'
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: screenHeight * 0.3,
    marginTop: 50
  },
  logo: {
    width: "100%",
    height: "100%"
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 30
  },
  buttonWrapper: {
    marginVertical: 2
  },
  customButton: {
    alignItems: 'center',
    width: 130,
    marginVertical: 10,
    paddingVertical: 10,
    backgroundColor: '#13171A',
    borderWidth: 1,
    borderColor: '#ED6A11',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6
  },
  buttonText: {
    fontSize: 15,
    color: '#6B6F73',
    fontWeight: "bold",
    letterSpacing: 0.5
  }
});
