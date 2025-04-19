import React from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { SocketContext, socket } from './app/contexts/socket.context';

import HomeScreen from './app/screens/home.screen';
import OnlineGameScreen from './app/screens/online-game.screen';
import VsBotGameScreen from './app/screens/vs-bot-game.screen';


const Stack = createStackNavigator();
LogBox.ignoreAllLogs(true);

function App() {
  return (
    <SocketContext.Provider value={ socket }>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="HomeScreen"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#FE6E00',
              },
              headerTintColor: '#FFF',
              headerTitleStyle: {
                fontWeight: 'bold',
              }
            }}>
            <Stack.Screen
              name="HomeScreen"
              component={ HomeScreen }
              options={{ title: 'Accueil' }}/>
            <Stack.Screen
              name="VsBotGameScreen"
              component={ VsBotGameScreen }
              options={{ title: 'Ecran de jeu Vs bot' }}/>
            <Stack.Screen
              name="OnlineGameScreen"
              component={ OnlineGameScreen }
              options={{ title: 'Ecran de jeu' }}/>
          </Stack.Navigator>
        </NavigationContainer>
    </SocketContext.Provider>
  );
}

export default App;
