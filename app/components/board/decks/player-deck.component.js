import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { SocketContext } from "../../../contexts/socket.context";

import Dice from "./dice.component";


const PlayerDeck = () => {

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

  return (
    <View style={ styles.deckPlayerContainer }>

      {displayPlayerDeck && (
        <>
          {displayRollButton && (
            <>
              <View style={ styles.rollInfoContainer }>
                <Text style={ styles.rollInfoText }>
                  Lancer { rollsCounter } / { rollsMaximum }
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
                onPress={ toggleDiceLock }
              />
            ))}
          </View>

          {displayRollButton && (
            <>
              <TouchableOpacity
                style={ styles.customButton }
                onPress={ rollDices }>
                <Text style={ styles.rollButtonText }>Roll</Text>
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
    borderBottomWidth: 1,
    borderColor: "#FE6E00"
  },
  deckOpponentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#FE6E00"
  },
  rollInfoContainer: {
    marginBottom: 10,
  },
  rollInfoText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  diceContainer: {
    flexDirection: "row",
    width: "70%",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  customButton: {
    alignItems: 'center',
    width: 150,
    marginVertical: 10,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#FE6E00',
    borderRadius: 8,
  },
  rollButtonText: {
    fontSize: 14,
    color: '#FE6E00',
    fontWeight: "bold",
  },
});

export default PlayerDeck;
