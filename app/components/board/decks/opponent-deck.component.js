import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

import { SocketContext } from "../../../contexts/socket.context";

import Dice from "./dice.component";


const OpponentDeck = () => {
  const socket = useContext(SocketContext);

  const [displayOpponentDeck, setDisplayOpponentDeck] = useState(false);
  const [opponentDices, setOpponentDices] = useState(Array(5).fill({ value: "", locked: false }));

  useEffect(() => {
    socket.on("game.deck.view-state", (data) => {
      setDisplayOpponentDeck(data['displayOpponentDeck']);
      if (data['displayOpponentDeck']) {
        setOpponentDices(data['dices']);
      }
    });
  }, []);

  return (
    <View style={ styles.deckOpponentContainer }>
      {displayOpponentDeck && (
        <View style={ styles.diceContainer }>
          {opponentDices.map((diceData, index) => (
            <Dice
              key={ index }
              index={ index }
              locked={ diceData.locked }
              value={ diceData.value }
              opponent={ true }/>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  deckOpponentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: "#E66E15"
  },
  diceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%"
  }
});

export default OpponentDeck;
