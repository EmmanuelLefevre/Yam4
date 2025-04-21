import React, { useContext, useEffect, useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { SocketContext } from "../../../contexts/socket.context";


const Choices = () => {
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

          return (
            <TouchableOpacity
              key={ choice.id }
              style={[
                styles.choiceButton,
                isSelected && styles.selectedChoice,
                !canMakeChoice && styles.disabledChoice,
              ]}
              onPress={ () => handleSelectChoice(choice.id) }
              disabled={ !canMakeChoice }>

              <Text
                style={[
                  styles.choiceText,
                  isSelected && styles.selectedChoiceText,
                ]}>
                { choice.value }
              </Text>
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
    backgroundColor: "#E66E15"
  },
  selectedChoiceText: {
    color: "#FFF"
  },
  choiceText: {
    fontSize: 14,
    color: "#6B6F73",
    fontWeight: "bold",
    letterSpacing: 0.5
  },
  disabledChoice: {
    opacity: 0.5
  }
});

export default Choices;
