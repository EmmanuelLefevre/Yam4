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
                backgroundColor: '#13171A',
                height: 45
              },
              headerTintColor: '#ED6A11',
              headerTitleStyle: {
                fontWeight: 'bold'
              }
            }}>
            <Stack.Screen
              name="HomeScreen"
              component={ HomeScreen }
              options={{ title: 'Home' }}/>
            <Stack.Screen
              name="VsBotGameScreen"
              component={ VsBotGameScreen }
              options={{ title: 'Online Game Vs Bot' }}/>
            <Stack.Screen
              name="OnlineGameScreen"
              component={ OnlineGameScreen }
              options={{ title: 'Online Game' }}/>
          </Stack.Navigator>
        </NavigationContainer>
    </SocketContext.Provider>
  );
}

export default App;
