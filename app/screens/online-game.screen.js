import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";

import { SocketContext } from '../contexts/socket.context';

import OnlineGameController from "../controllers/online-game.controller";


export default function OnlineGameScreen({ navigation }) {
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
        <OnlineGameController navigation={ navigation } />
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
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5
  }
});
