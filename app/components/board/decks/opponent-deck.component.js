import React, { useContext, useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";

import { SocketContext } from "@/contexts/socket.context";

import Dice from "@/components/board/decks/dice.component";


const OpponentDeck = () => {
  const socket = useContext(SocketContext);

  const [displayOpponentDeck, setDisplayOpponentDeck] = useState(false);
  const [opponentDices, setOpponentDices] = useState(Array(5).fill({ value: "", locked: false }));

  const prevOpponentDices = useRef(opponentDices);
  const hasMounted = useRef(false);
  const scaleAnim = useRef(Array(5).fill().map(() => new Animated.Value(1))).current;

  useEffect(() => {
    socket.on("game.deck.view-state", (data) => {
      setDisplayOpponentDeck(data['displayOpponentDeck']);

      if (data['displayOpponentDeck']) {
        const newDices = data['dices'];

        if (hasMounted.current) {
          newDices.forEach((dice, index) => {
            const prevLocked = prevOpponentDices.current[index]?.locked;
            const newLocked = dice.locked;

            if (prevLocked !== newLocked) {
              Animated.spring(scaleAnim[index], {
                toValue: newLocked ? 1.2 : 1,
                friction: 3,
                useNativeDriver: false
              }).start();
            }
          });
        }

        setOpponentDices(newDices);
        prevOpponentDices.current = newDices;
        hasMounted.current = true;
      }
    });
  }, []);

  return (
    <View style={ styles.deckOpponentContainer }>
      {displayOpponentDeck && (
        <View style={ styles.diceContainer }>
          {opponentDices.map((diceData, index) => (
            <Animated.View
              key={ index }
              style={{ transform: [{ scale: scaleAnim[index] }] }}>
              <Dice
                index={ index }
                locked={ diceData.locked }
                value={ diceData.value }
                opponent={ true }
              />
            </Animated.View>
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
