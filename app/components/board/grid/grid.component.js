import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SocketContext } from "@/contexts/socket.context";

export default function Grid() {
  const socket = useContext(SocketContext);
  const [displayGrid, setDisplayGrid]   = useState(false);
  const [canSelectCells, setCanSelect]  = useState(false);
  const [grid, setGrid]                 = useState([]);
  const [isChallenge, setIsChallenge]   = useState(false);

  useEffect(() => {
    socket.on("game.grid.view-state", data => {
      setDisplayGrid(data.displayGrid);
      setCanSelect(data.canSelectCells);
      setGrid(data.grid);
      setIsChallenge(data.isChallenge);
    });
    return () => socket.off("game.grid.view-state");
  }, [socket]);

  const handlePress = (cell, r, c) => {
    if (canSelectCells && cell.canBeChecked) {
      socket.emit("game.grid.selected", {
        idCell:   cell.id,
        rowIndex: r,
        cellIndex:c
      });
    }
  };

  return (
      <View style={styles.gridContainer}>
        {displayGrid &&
            grid.map((row, r) => (
                <View key={r} style={styles.row}>
                  {row.map((cell, c) => {
                    const styleList = [styles.cell];
                    if (cell.owner === "player:1") styleList.push(styles.playerOwnedCell);
                    if (cell.owner === "player:2") styleList.push(styles.opponentOwnedCell);

                    if (cell.canBeChecked) {
                      if (cell.id === "defi") {
                        styleList.push(
                            isChallenge
                                ? styles.challengeActive
                                : styles.challengeAvailable
                        );
                      } else {
                        styleList.push(styles.canBeCheckedCell);
                      }
                    }

                    return (
                        <TouchableOpacity
                            key={`${r}-${c}`}
                            style={styleList}
                            disabled={!canSelectCells || !cell.canBeChecked}
                            onPress={() => handlePress(cell, r, c)}
                        >
                          <Text style={styles.cellText}>{cell.viewContent}</Text>
                        </TouchableOpacity>
                    );
                  })}
                </View>
            ))}
      </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: { flex: 7, justifyContent: "center", alignItems: "center" },
  row:           { flexDirection: "row", flex: 1, width: "100%" },
  cell:          {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000"
  },
  cellText:           { fontSize: 11 },
  playerOwnedCell:    { backgroundColor: "#8AB70E" },
  opponentOwnedCell:  { backgroundColor: "#FF0000" },
  canBeCheckedCell:   { backgroundColor: "#EEE" },
  challengeAvailable: { backgroundColor: "#FFD966" },
  challengeActive:    { backgroundColor: "#B8860B" }
});
