import React, { useEffect, useRef, useState } from "react";
import { Animated, Platform, StyleSheet, Text, TouchableOpacity } from "react-native";

import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { Chewy_400Regular } from '@expo-google-fonts/chewy';


const Dice = ({ index, locked, value, onPress, opponent }) => {
  useFonts({
    Chewy_400Regular
  });

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
          useNativeDriver: false
        }),
        Animated.sequence([
          Animated.timing(translateYAnim, {
            toValue: 30,
            duration: 300,
            useNativeDriver: false
          }),
          Animated.timing(translateYAnim, {
            toValue: -20,
            duration: 120,
            useNativeDriver: false
          }),
          Animated.timing(translateYAnim, {
            toValue: 10,
            duration: 100,
            useNativeDriver: false
          }),
          Animated.timing(translateYAnim, {
            toValue: -5,
            duration: 80,
            useNativeDriver: false
          }),
          Animated.timing(translateYAnim, {
            toValue: 0,
            duration: 80,
            useNativeDriver: false
          }),
        ]),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false
        })
      ]).start(() => {
        setHasAnimatedEntry(true);
      });
    }
  }, [hasAnimatedEntry, index]);

  useEffect(() => {
    if (isFirstRender || !hasAnimatedEntry) return;

    Animated.spring(scaleAnim, {
      toValue: locked ? 1.2 : 1,
      friction: 3,
      useNativeDriver: false
    }).start();
  }, [locked, isFirstRender, hasAnimatedEntry]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "720deg"]
  });

  return (
    <TouchableOpacity
      onPress={ handlePress }
      disabled={ opponent || isInitial || !hasAnimatedEntry }>

      <Animated.View
        style={[
          styles.dice,
          {
            transform: [
              { scale: scaleAnim },
              { translateX: translateXAnim },
              { translateY: translateYAnim },
              { rotate: rotateInterpolate }
            ]
          },
          isInitial && styles.initialDice,
          locked && styles.lockedDice
        ]}>

        {isInitial && (
          <LinearGradient
            colors={ ['#FFA033', '#ED6A11'] }
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={ styles.diceBackground }/>
        )}
        <Text
          style={[
            styles.diceText,
            isInitial
              ? styles.initialDiceText
              : locked
              ? styles.lockedDiceText
              : null
          ]}>
          { isInitial ? "?" : value }
        </Text>
      </Animated.View>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dice: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    color: "#6B6F73",
    width: 40,
    height: 40,
    backgroundColor: "#13171A",
    borderWidth: 1,
    borderColor: "#ED6A11",
    borderRadius: 5,
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
  diceBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 5,
    zIndex: 0
  },
  initialDice: {
    borderWidth: 1,
    borderColor: "#FF0000"
  },
  lockedDice: {
    backgroundColor: "#ED6A11"
  },
  diceText: {
    fontSize: 17,
    color: "#6B6F73",
    fontFamily: "Chewy_400Regular",
    fontWeight: "bold",
    zIndex: 1
  },
  initialDiceText: {
    color: "#FFF"
  },
  lockedDiceText: {
    color: "#FFF"
  }
});

export default Dice;
