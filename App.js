import React from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { SocketContext, socket } from './app/contexts/socket.context';

import HomeComponent from './app/components/home.component';
import OnlineGameComponent from './app/components/online-game.component';
import VsBotGameComponent from './app/components/vs-bot-game.component';


const Stack = createStackNavigator();
LogBox.ignoreAllLogs(true);

function App() {
  return (
    <SocketContext.Provider value={ socket }>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomeComponent">
          <Stack.Screen name="HomeComponent" component={ HomeComponent } />
          <Stack.Screen name="OnlineGameComponent" component={ OnlineGameComponent } />
          <Stack.Screen name="VsBotGameComponent" component={ VsBotGameComponent } />
        </Stack.Navigator>
      </NavigationContainer>
    </SocketContext.Provider>
  );
}

export default App;
