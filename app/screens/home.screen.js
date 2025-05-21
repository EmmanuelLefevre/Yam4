import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, Vibration, View } from "react-native";

import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { Chewy_400Regular } from '@expo-google-fonts/chewy';
import { LuckiestGuy_400Regular} from '@expo-google-fonts/luckiest-guy';

import logo from "@/assets/img/logo_yam4.png";


export default function HomeScreen({ navigation }) {
  let [fontsLoaded] = useFonts({
    Chewy_400Regular,
    LuckiestGuy_400Regular
  });

  const [loading, setLoading] = useState(true);
  const logoScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (fontsLoaded) {
      setLoading(false);
      Vibration.vibrate(100);

      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: false
        }),
        Animated.timing(logoScale, {
          toValue: 0.95,
          duration: 250,
          useNativeDriver: false
        }),
        Animated.timing(logoScale, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: false
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false
        })
      ]).start();
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
      <View style={ styles.titleContainer }>
        <Text style={ styles.title }>Yam4</Text>
      </View>
      <View style={ styles.logoWrapper }>
        <Animated.View style={[
          styles.logoContainer,
          { transform: [{ scale: logoScale }] }]}>
          <Image
            source={ logo }
            style={ styles.logo }
            resizeMode="cover"/>
        </Animated.View>
      </View>
      <View style={ styles.buttonContainer }>
        <View style={ styles.buttonWrapper }>
          <TouchableOpacity
            onPress={ () => navigation.navigate('OnlineGameScreen') }>
            <LinearGradient
              colors={ ['#FFA033', '#ED6A11'] }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={ styles.customButton }>
              <Text style={ styles.buttonText }>Play online</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={ styles.buttonWrapper }>
          <TouchableOpacity
            onPress={ () => navigation.navigate('VsBotGameScreen') }>
            <LinearGradient
              colors={ ['#FFA033', '#ED6A11'] }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={ styles.customButton }>
              <Text style={ styles.buttonText }>Play vs bot</Text>
            </LinearGradient>
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
  titleContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: 50,
    fontFamily: 'LuckiestGuy_400Regular',
    letterSpacing: 1,
    textAlign: 'center',
    ...(
      Platform.OS === 'web'
        ? {
            backgroundImage: 'linear-gradient(to right, #FFA033, #ED6A11)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }
        : {
            color: '#ED6A11'
          }
    )
  },
  logoWrapper: {
    alignSelf: 'center',
    width: Platform.OS === 'web' ? '33%' : '65%',
    height: screenHeight * 0.3
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: "#6B6F73",
    borderRadius: 30,
    zIndex: 10,
    overflow: "hidden"
  },
  logo: {
    width: "100%",
    height: "100%",
    borderRadius: 25
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
    paddingVertical: 8,
    backgroundColor: "#13171A",
    borderWidth: 2,
    borderColor: "#6B6F73",
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
    fontSize: 18,
    color: "#6B6F73",
    fontFamily: "Chewy_400Regular",
    fontWeight: "bold",
    letterSpacing: 1
  }
});
