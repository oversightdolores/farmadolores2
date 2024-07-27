import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Home from './src/screens/Home';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './src/components/BottomTabs';
import AppNavigator from './src/screens/AppNavigator';
import { AuthContextProvider } from './src/context/AuthContext';
import codePush from 'react-native-code-push';

export type RootStackParamList = {
  Farmacias: undefined;
  Emergencias: undefined;
  DetailScreen: { name: string; dir: string; tel: string; image: string; detail: string };
};

const Stack = createNativeStackNavigator();

let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_START };

const App: React.FC = ({...rest}): React.JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <AuthContextProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <AppNavigator />
    </AuthContextProvider>
  );
}

export default codePush(codePushOptions)(App);
