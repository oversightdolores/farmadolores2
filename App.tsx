/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

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
import Home  from './src/pages/Home';
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './src/components/BottomTabs';
import AppNavigator from './src/pages/AppNavigator';
import { AuthContextProvider } from './src/context/AuthContext';


export type RootStackParamList = {
  Farmacias: undefined;
  Emergencias: undefined;
  DetailScreen: { name: string; dir: string; tel: string; image: string; detail: string };
};

const Stack = createNativeStackNavigator();


function App({...rest}): React.JSX.Element {
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


export default App;
