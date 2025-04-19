import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
    flex: 2,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderLeftWidth: 2,
    borderColor: "#E66E15"
  },
  choiceButton: {
    backgroundColor: "white",
    borderRadius: 5,
    marginVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "10%"
  },
  selectedChoice: {
    backgroundColor: "#E66E15"
  },
  selectedChoiceText: {
    color: "#FFF",
  },
  choiceText: {
    color: "#E66E15",
    fontSize: 14,
    fontWeight: "bold"
  },
  disabledChoice: {
    opacity: 0.5
  },
});

export default Choices;
