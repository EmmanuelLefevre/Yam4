import React, { useContext, useEffect, useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { Chewy_400Regular } from '@expo-google-fonts/chewy';

import { SocketContext } from "../../../contexts/socket.context";

import Dice from "./dice.component";


const PlayerDeck = () => {
  useFonts({
    Chewy_400Regular
  });

  const socket = useContext(SocketContext);
  const [displayPlayerDeck, setDisplayPlayerDeck] = useState(false);
  const [dices, setDices] = useState(Array(5).fill(false));
  const [displayRollButton, setDisplayRollButton] = useState(false);
  const [rollsCounter, setRollsCounter] = useState(0);
  const [rollsMaximum, setRollsMaximum] = useState(3);

  useEffect(() => {
    socket.on("game.deck.view-state", (data) => {
      setDisplayPlayerDeck(data['displayPlayerDeck']);
      if (data['displayPlayerDeck']) {
        setDisplayRollButton(data['displayRollButton']);
        setRollsCounter(data['rollsCounter']);
        setRollsMaximum(data['rollsMaximum']);
        setDices(data['dices']);
      }
    });
  }, []);

  const toggleDiceLock = (index) => {
    const newDices = [...dices];
    if (newDices[index].value !== '' && displayRollButton) {
      socket.emit("game.dices.lock", newDices[index].id);
    }
  };

  const rollDices = () => {
    if (rollsCounter <= rollsMaximum) {
      socket.emit("game.dices.roll");
    }
  };

  const getCounterColor = (counter) => {
    switch (counter) {
      case 0:
        return { color: '#FF0000' };
      case 1:
        return { color: '#8AB70E' };
      case 2:
      default:
        return { color: '#E66E15' };
    }
  };

  return (
    <View style={ styles.deckPlayerContainer }>

      {displayPlayerDeck && (
        <>
          {displayRollButton && (
            <>
              <View style={ styles.rollInfoContainer }>
                <Text style={ styles.rollInfoText }>
                  Lancer <Text style={ getCounterColor(rollsCounter, rollsMaximum) }>{ rollsCounter }</Text> / { rollsMaximum }
                </Text>
              </View>
            </>
          )}

          <View style={ styles.diceContainer }>
            {dices.map((diceData, index) => (
              <Dice
                key={ diceData.id }
                index={ index }
                locked={ diceData.locked }
                value={ diceData.value }
                onPress={ toggleDiceLock }/>
            ))}
          </View>

          {displayRollButton && (
            <>
              <TouchableOpacity
                onPress={ rollDices }>
                <LinearGradient
                  colors={ ['#FFA033', '#ED6A11'] }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={ styles.customButton }>
                  <Text style={ styles.rollButtonText }>Roll</Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}
        </>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  deckPlayerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 10,
    borderTopWidth: 2,
    borderColor: "#E66E15"
  },
  deckOpponentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: "#E66E15"
  },
  rollInfoContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  rollInfoText: {
    color: "#E66E15",
    fontSize: 14,
    fontStyle: "italic",
    fontWeight: "bold"
  },
  diceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    padding: 20
  },
  customButton: {
    alignItems: "center",
    width: 100,
    paddingVertical: 6,
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
  rollButtonText: {
    fontSize: 16,
    color: "#6B6F73",
    fontFamily: "Chewy_400Regular",
    fontWeight: "bold",
    letterSpacing: 1
  }
});

export default PlayerDeck;
