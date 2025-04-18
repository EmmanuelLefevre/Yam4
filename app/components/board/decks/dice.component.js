import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";


const Dice = ({ index, locked, value, onPress, opponent }) => {

  const handlePress = () => {
    if (!opponent) {
      onPress(index);
    }
  };

  return (
    <TouchableOpacity
      style={ [styles.dice, locked && styles.lockedDice] }
      onPress={ handlePress }
      disabled={ opponent }>
      <Text style={ styles.diceText }>{ value }</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dice: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    backgroundColor: "lightblue",
    borderRadius: 5,
  },
  lockedDice: {
    backgroundColor: "gray",
  },
  diceText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  opponentText: {
    fontSize: 12,
    color: "red",
  },
});

export default Dice;
