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
    marginBottom: 10
  },
  rollInfoText: {
    color: "#E66E15",
    fontSize: 14,
    fontStyle: "italic",
    fontWeight: 'bold'
  },
  diceContainer: {
    flexDirection: "row",
    width: "70%",
    justifyContent: "space-between",
    margin: 20
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
  rollButtonText: {
    fontSize: 15,
    color: '#6B6F73',
    fontWeight: "bold",
    letterSpacing: 0.5
  }
});

export default PlayerDeck;
