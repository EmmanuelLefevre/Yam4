import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity } from "react-native";


const Dice = ({ index, locked, value, onPress, opponent }) => {
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [hasAnimatedEntry, setHasAnimatedEntry] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateXAnim = useRef(new Animated.Value(-200)).current;
  const translateYAnim = useRef(new Animated.Value(-250)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const isInitial = !(value >= 1 && value <= 6);

  const handlePress = () => {
    if (!opponent) {
      onPress(index);
      if (isFirstRender) {
        setIsFirstRender(false);
      }
    }
  };

  useEffect(() => {
    if (!hasAnimatedEntry) {
      Animated.parallel([
        Animated.timing(translateXAnim, {
          toValue: 0,
          duration: 700 + index * 100,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(translateYAnim, {
            toValue: 30,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateYAnim, {
            toValue: -20,
            duration: 120,
            useNativeDriver: true,
          }),
          Animated.timing(translateYAnim, {
            toValue: 10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(translateYAnim, {
            toValue: -5,
            duration: 80,
            useNativeDriver: true,
          }),
          Animated.timing(translateYAnim, {
            toValue: 0,
            duration: 80,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setHasAnimatedEntry(true);
      });
    }
  }, [hasAnimatedEntry]);

  useEffect(() => {
    if (isFirstRender || !hasAnimatedEntry) return;

    Animated.spring(scaleAnim, {
      toValue: locked ? 1.2 : 1,
      friction: 3,
      useNativeDriver: true
    }).start();
  }, [locked, isFirstRender, hasAnimatedEntry]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "720deg"],
  });

  return (
    <TouchableOpacity onPress={handlePress} disabled={opponent}>
      <Animated.View
        style={[
          styles.dice,
          {
            transform: [
              { scale: scaleAnim },
              { translateX: translateXAnim },
              { translateY: translateYAnim },
              { rotate: rotateInterpolate },
            ]
          },
          isInitial && styles.initialDice,
          locked && styles.lockedDice,
        ]}>

        <Text
          style={[
            styles.diceText,
            isInitial
              ? styles.initialDiceText
              : locked
              ? styles.lockedDiceText
              : null,
          ]}>
          {isInitial ? "?" : value}
        </Text>
      </Animated.View>
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
    boxShadowColor: "#000",
    boxShadowOffset: {
      width: 5,
      height: 5
    },
    boxShadowOpacity: 0.4,
    boxShadowRadius: 6,
    elevation: 6
  },
  initialDice: {
    borderWidth: 1,
    borderColor: "#FF0000"
  },
  lockedDice: {
    backgroundColor: "#ED6A11"
  },
  diceText: {
    fontSize: 18,
    color: "#6B6F73",
    fontWeight: "bold"
  },
  initialDiceText: {
    color: "#FFF"
  },
  lockedDiceText: {
    color: "#FFF"
  }
});

export default Dice;
