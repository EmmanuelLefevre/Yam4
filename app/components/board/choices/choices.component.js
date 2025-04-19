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
        availableChoices.map((choice) => (
          <TouchableOpacity
            key={ choice.id }
            style={[
              styles.choiceButton,
              idSelectedChoice === choice.id && styles.selectedChoice,
              !canMakeChoice && styles.disabledChoice]}
            onPress={ () => handleSelectChoice(choice.id) }
            disabled={ !canMakeChoice }>
            <Text style={ styles.choiceText }>{ choice.value }</Text>
          </TouchableOpacity>
        ))
      }
    </View>
  );
};

const styles = StyleSheet.create({
  choicesContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
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
    backgroundColor: "#8AB70E",
  },
  choiceText: {
    color: "#E66E15",
    fontSize: 13,
    fontWeight: "bold",
  },
  disabledChoice: {
    opacity: 0.5,
  },
});

export default Choices;
