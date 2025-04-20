import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";


const Dice = ({ index, locked, value, onPress, opponent }) => {

  const handlePress = () => {
    if (!opponent) {
      onPress(index);
    }
  };

  const isInitial = value === null || value === undefined || isNaN(value);

  return (
    <TouchableOpacity
      style={[
        styles.dice,
        isInitial && styles.initialDice,
        locked && styles.lockedDice
      ]}
      onPress={ handlePress }
      disabled={ opponent }>

      <Text
        style={[
          styles.diceText,
          isInitial && styles.initialDiceText,
          locked && styles.lockedDiceText
      ]}>
        { isInitial ? "?" : value }
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dice: {
    justifyContent: "center",
    alignItems: "center",
    color: "#6B6F73",
    width: 40,
    height: 40,
    backgroundColor: "#13171A",
    borderWidth: 1,
    borderColor: "#ED6A11",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 5
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6
  },
  initialDice: {
    backgroundColor: "red",
    borderWidth: 1,
    borderColor: "#555"
  },
  lockedDice: {
    backgroundColor: "#ED6A11"
  },
  diceText: {
    fontSize: 20,
    color: "#6B6F73",
    fontWeight: "bold"
  },
  initialDiceText: {
    color: "red"
  },
  lockedDiceText: {
    color: "#FFF"
  }
});

export default Dice;
