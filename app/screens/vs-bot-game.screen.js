import React, { useContext } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useFonts } from 'expo-font';
import { Chewy_400Regular } from '@expo-google-fonts/chewy';

import { SocketContext } from '../contexts/socket.context';


export default function VsBotGameScreen({ navigation }) {
  useFonts({
    Chewy_400Regular
  });

  const socket = useContext(SocketContext);

  return (
    <View style={ styles.container }>
      {!socket && (
        <>
          <View style={ styles.textContainer }>
            <Text style={ styles.paragraph }>
              No connection with server...
            </Text>
            <Text style={ styles.footnote }>
              Restart the app and wait for the server to be back again.
            </Text>
          </View>
        </>
      )}

      {socket && (
        <>
          <View style={ styles.textContainer }>
            <Text style={ styles.paragraph }>
              VsBot Game Interface
            </Text>
            <Text style={ styles.footnote }>
              My socket id is: { socket.id }
            </Text>
          </View>
          <View style={ styles.buttonContainer }>
            <TouchableOpacity
              style={ styles.customButton }
              onPress={ () => navigation.navigate('HomeScreen') }>
              <Text style={ styles.buttonText }>
                Return to menu
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#24282C",
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  paragraph: {
    color: "#6B6F73",
    fontSize: 16,
    fontWeight: "bold"
  },
  footnote: {
    color: "#6B6F73",
    fontSize: 11,
    fontWeight: "bold"
  },
  buttonContainer: {
    margin: 20
  },
  customButton: {
    alignItems: "center",
    width: 160,
    marginVertical: 10,
    paddingVertical: 10,
    backgroundColor: "#13171A",
    borderWidth: 1,
    borderColor: "#FF0000",
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
  }
});
