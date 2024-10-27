// App.js
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { SessionProvider } from './contexts/SessionContext';
import RootNavigator from './RootNavigator';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4CAF50',
    background: '#FFFFFF',
    text: '#000000',
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SessionProvider>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </PaperProvider>
      </SessionProvider>
    </GestureHandlerRootView>
  );
}
