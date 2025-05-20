// screens/end-game.screen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import { Chewy_400Regular } from "@expo-google-fonts/chewy";

export default function EndGameScreen({ route, navigation }) {
    const { playerScore, opponentScore, isWinner } = route.params;

    const [fontsLoaded] = useFonts({ Chewy_400Regular });
    if (!fontsLoaded) return null; // ou un Splash

    return (
        <View style={styles.container}>
            {/* Contenu principal centré */}
            <View style={styles.content}>
                <Text style={styles.title}>
                    {isWinner ? "Winner !!!" : "You lose"}
                </Text>

                <Text style={styles.scoreLine}>
                    Your Score:
                    <Text style={[styles.scoreValue, isWinner ? styles.green : styles.red]}>
                        {` ${playerScore}`}
                    </Text>
                </Text>
                <Text style={styles.scoreLine}>
                    Opponent Score:
                    <Text style={[styles.scoreValue, isWinner ? styles.red : styles.green]}>
                        {` ${opponentScore}`}
                    </Text>
                </Text>

                {!isWinner && (
                    <Text style={styles.message}>
                        You’ll do better next time!
                    </Text>
                )}
            </View>

            {/* Bouton tout en bas pour revenir à l'écran de sélection */}
            <TouchableOpacity
                style={styles.homeButton}
                onPress={() => navigation.navigate("HomeScreen")}
            >
                <Text style={styles.homeButtonText}>Back to Menu</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
        padding: 24,
        // On espace le content et le bouton
        justifyContent: "space-between",
    },
    content: {
        alignItems: "center",
    },
    title: {
        fontSize: 32,
        fontFamily: "Chewy_400Regular",
        fontWeight: "bold",
        color: "#E66E15",
        marginBottom: 24,
    },
    scoreLine: {
        fontSize: 18,
        fontFamily: "Chewy_400Regular",
        color: "#333",
        marginVertical: 8,
    },
    scoreValue: {
        fontSize: 18,
        fontFamily: "Chewy_400Regular",
        fontWeight: "bold",
        marginLeft: 4,
    },
    green: {
        color: "#8AB70E",
    },
    red: {
        color: "#FF0000",
    },
    message: {
        fontSize: 16,
        fontFamily: "Chewy_400Regular",
        color: "#555",
        marginTop: 20,
        textAlign: "center",
    },
    homeButton: {
        backgroundColor: "#E66E15",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignSelf: "center",
    },
    homeButtonText: {
        fontSize: 16,
        fontFamily: "Chewy_400Regular",
        color: "#FFF",
        fontWeight: "bold",
    },
});
