const OpponentTimer = () => {
  const socket = useContext(SocketContext);
  const [opponentTimer, setOpponentTimer] = useState(0);

  useEffect(() => {

    socket.on("game.timer", (data) => {
      setOpponentTimer(data['opponentTimer'])
    });

  }, []);
  return (
    <View style={styles.opponentTimerContainer}>
      <Text>Timer: {opponentTimer}</Text>
    </View>
  );
};
