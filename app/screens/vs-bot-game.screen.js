import { useContext, useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SocketContext } from "@/contexts/socket.context";
import BotService from "@/services/bot.services";
import Board from "@/components/board/board.component";

export default function VsBotGame({ navigation }) {
  const socket = useContext(SocketContext);

  const [inGame, setInGame] = useState(false);
  const [myKey, setMyKey] = useState(null);
  const [botKey, setBotKey] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [deckState, setDeckState] = useState(null);
  const [choicesState, setChoicesState] = useState(null);
  const [gridState, setGridState] = useState(null);
  const [timers, setTimers] = useState(null);

  const lastTurnRef = useRef(null);

  // ─── Démarrage + réception game.start ──────────────────
  useEffect(() => {
    socket.emit("vs-bot.start");

    socket.on("game.start", (payload) => {
      // On ignore tout ce qui ne nous est pas destiné
      if (payload.idPlayer !== socket.id) {
        return;
      }

      setInGame(true);

      // On récupère directement playerKey et botKey
      setMyKey(payload.playerKey);
      setBotKey(payload.botKey);

      // Initialisation des états
      setGameState(payload.gameState);
      setDeckState(payload.deck);
      setChoicesState(payload.choices);
      setGridState(payload.grid);
      setTimers({
        playerTimer: payload.playerTimer,
        opponentTimer: payload.opponentTimer
      });
    });

    socket.on("game.state", setGameState);
    socket.on("game.timer", setTimers);
    socket.on("game.deck.view-state", setDeckState);
    socket.on("game.choices.view-state", setChoicesState);
    socket.on("game.grid.view-state", setGridState);

    socket.on("game.end", ({winner, player1Score, player2Score}) => {
      const isMe = (winner === socket.id);
      navigation.replace("EndGameScreen", {
        playerScore: isMe ? player1Score : player2Score,
        opponentScore: isMe ? player2Score : player1Score,
        isWinner: isMe
      });
    });

    return () => socket.removeAllListeners();
  }, [socket, navigation]);

  // ─── Logique du bot ────────────────────────────────────
  useEffect(() => {
    if (
      !inGame ||
      !gameState ||
      !deckState ||
      !choicesState ||
      !gridState ||
      !timers
    ) {
      return; // on attend bien tous les états initiaux
    }

    const turn = gameState.currentTurn;

    // Si c'est le tour du bot et qu'on n'y est pas déjà entré
    if (turn === botKey && lastTurnRef.current !== botKey) {
      console.log('[BOT] Démarrage du tour', { turn, botKey });
      lastTurnRef.current = botKey;

      (async () => {
        // On travaille sur des copies locales pour ne pas boucler sur un état "figé"
        let localDeck = deckState;
        let localChoices = choicesState;
        let localGrid = gridState;

        // ————————————————
        // 1) Relances de dés
        // ————————————————
        while (localDeck.rollsCounter < localDeck.rollsMaximum) {
          // Calcule quels dés relancer (true = relancer)
          const toRoll = BotService.chooseDiceToRoll(
            localDeck.dices,
            localDeck.rollsCounter,
            localGrid.grid,
            gameState,
            botKey
          );
          console.log('[BOT] toRoll:', toRoll);

          // Verrouillage des dés étiquetés "false"
          toRoll.forEach((shouldRoll, i) => {
            if (!shouldRoll) {
              socket.emit('game.dices.lock', localDeck.dices[i].id);
            }
          });

          // On lance
          socket.emit('game.dices.roll');
          // et on attend la mise à jour du deck du serveur
          localDeck = await new Promise(res =>
              socket.once('game.deck.view-state', res)
          );
          console.log('[BOT] nouveau deck.rollsCounter =', localDeck.rollsCounter);
        }

        // ————————————————
        // 2) Choix de la combinaison
        // ————————————————
        if (localChoices.canMakeChoice) {
          const choiceId = BotService.chooseCombination(
            localChoices.availableChoices,
            localGrid.grid,
            gameState,
            botKey
          );
          console.log('[BOT] choix de combi:', choiceId);
          socket.emit('game.choices.selected', { choiceId });
          localChoices = await new Promise(res =>
            socket.once('game.choices.view-state', res)
          );
          console.log('[BOT] nouvelles choices.availableChoices =', localChoices.availableChoices);
        }

        // ————————————————
        // 3) Placement sur la grille
        // ————————————————
        if (localChoices.idSelectedChoice && localGrid.canSelectCells) {
          // On attend la mise à jour de la grille d’abord
          localGrid = await new Promise(res =>
            socket.once('game.grid.view-state', res)
          );
          console.log('[BOT] grille reçue, choix de cellule');
          const coord = BotService.chooseCellToPlace(
            localChoices.idSelectedChoice,
            localGrid.grid,
            gameState,
            botKey
          );
          console.log('[BOT] placement en', coord);
          if (coord) {
            const [rowIndex, cellIndex] = coord;
            socket.emit('game.grid.selected', {
              idCell: localChoices.idSelectedChoice,
              rowIndex,
              cellIndex
            });
          }
        }
      })().catch(err => console.error('[BOT] erreur interne', err));
    }

    // Préparation pour détecter le prochain tour
    if (turn !== botKey) {
      lastTurnRef.current = turn;
    }
  }, [
    inGame,
    gameState,
    deckState,
    choicesState,
    gridState,
    timers,
    botKey,
    socket
  ]);

  return (
    <View style={styles.container}>
      {inGame ? <Board /> : <Text style={styles.text}>Starting vs Bot…</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:"#24282C"
  },
  text:{
    color:"#FFF",
    textAlign:"center",
    marginTop:20
  }
});
