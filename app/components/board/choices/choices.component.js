import React, { useContext, useEffect, useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { Chewy_400Regular } from '@expo-google-fonts/chewy';

import { SocketContext } from "@/contexts/socket.context";


const Choices = () => {
  useFonts({
    Chewy_400Regular
  });

  const socket = useContext(SocketContext);

  const [displayChoices, setDisplayChoices] = useState(false);
  const [canMakeChoice, setCanMakeChoice] = useState(false);
  const [idSelectedChoice, setIdSelectedChoice] = useState(null);
  const [availableChoices, setAvailableChoices] = useState([]);

  useEffect(() => {
    socket.on("game.choices.view-state", (data) => {
      setDisplayChoices(data['displayChoices']);
      setCanMakeChoice(data['canMakeChoice']);
      setIdSelectedChoice(data['idSelectedChoice']);
      setAvailableChoices(data['availableChoices']);
    });
  }, []);

  const handleSelectChoice = (choiceId) => {
    if (canMakeChoice) {
      setIdSelectedChoice(choiceId);
      socket.emit("game.choices.selected", { choiceId });
    }
  };

  return (
    <View style={ styles.choicesContainer }>
      {displayChoices &&
        availableChoices.map((choice) => {
          const isSelected = idSelectedChoice === choice.id;
          const choiceContent = (
            <Text
              style={[
                styles.choiceText,
                isSelected && styles.selectedChoiceText
              ]}>
              { choice.value }
            </Text>
          );

          return (
            <TouchableOpacity
              key={ choice.id }
              onPress={ () => handleSelectChoice(choice.id) }
              disabled={ !canMakeChoice }
              style={[
                styles.choiceButton,
                isSelected && styles.selectedChoice,
                !canMakeChoice && styles.disabledChoice,
              ]}>

              {isSelected ? (
                <LinearGradient
                  colors={ ['#FFA033', '#ED6A11'] }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={ styles.selectedChoiceBackground}>
                  { choiceContent }
                </LinearGradient>
              ) : (
                choiceContent
              )}
            </TouchableOpacity>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  choicesContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderLeftWidth: 2,
    borderColor: "#E66E15"
  },
  choiceButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 110,
    height: 40,
    backgroundColor: "#13171A",
    borderWidth: 1,
    borderColor: "#ED6A11",
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
  selectedChoice: {
    borderWidth: 2,
    borderColor: "#6B6F73"
  },
  selectedChoiceText: {
    color: "#6B6F73"
  },
  selectedChoiceBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    zIndex: 0
  },
  choiceText: {
    fontSize: 15,
    color: "#6B6F73",
    fontFamily: "Chewy_400Regular",
    fontWeight: "bold",
    letterSpacing: 1.3
  },
  disabledChoice: {
    opacity: 0.5
  }
});

export default Choices;
