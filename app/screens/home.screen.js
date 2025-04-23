import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useFonts } from 'expo-font';
import { Chewy_400Regular } from '@expo-google-fonts/chewy';
import { LuckiestGuy_400Regular} from '@expo-google-fonts/luckiest-guy';

import logo from "../assets/img/logo_yam4.png";


export default function HomeScreen({ navigation }) {
  let [fontsLoaded] = useFonts({
    Chewy_400Regular,
    LuckiestGuy_400Regular
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (fontsLoaded) {
      setLoading(false);
    }
  }, [fontsLoaded]);

  if (loading) {
    return (
      <View style={ styles.container }>
        <Text style={{ color: 'white', textAlign: 'center' }}>Loading in progress...</Text>
      </View>
    );
  }

  return (
    <View style={ styles.container }>
      <View style={ styles.decriptionContainer }>
        <Text style={ styles.description }>
          Yam4
        </Text>
      </View>
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
    justifyContent: "space-between",
    backgroundColor: "#24282C",
    padding: 40
  },
  decriptionContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  description: {
    fontSize: 50,
    color: "#ED6A11",
    fontFamily: "LuckiestGuy_400Regular",
    letterSpacing: 1
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: screenHeight * 0.3
  },
  logo: {
    width: "100%",
    height: "100%"
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  buttonWrapper: {
    marginVertical: 2
  },
  customButton: {
    alignItems: "center",
    width: 130,
    marginVertical: 10,
    paddingVertical: 10,
    backgroundColor: "#13171A",
    borderWidth: 1,
    borderColor: "#ED6A11",
    borderRadius: 25,
    elevation: 6,
    ...(Platform.OS === "web"
      ? {
          boxShadow: "5px 5px 6px rgba(0, 0, 0, 0.4)"
        }
      : {
          shadowColor: "#000",
          shadowOffset: {
            width: 5,
            height: 5
          },
          shadowOpacity: 0.4,
          shadowRadius: 6
        }
    )
  },
  buttonText: {
    fontSize: 17,
    color: "#6B6F73",
    fontFamily: "Chewy_400Regular",
    fontWeight: "bold",
    letterSpacing: 1
  }
});
