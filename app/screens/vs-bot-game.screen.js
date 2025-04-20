import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { SocketContext } from '../contexts/socket.context';


export default function VsBotGameScreen({ navigation }) {

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
    backgroundColor: "#24282C",
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  paragraph: {
    color: "#6B6F73",
    fontSize: 16,
    fontWeight: "bold"
  },
  footnote: {
    color: "#6B6F73",
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 5
  },
  buttonContainer: {
    margin: 20
  },
  customButton: {
    alignItems: 'center',
    width: 160,
    marginVertical: 10,
    paddingVertical: 10,
    backgroundColor: '#13171A',
    borderWidth: 1,
    borderColor: '#FF0000',
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
