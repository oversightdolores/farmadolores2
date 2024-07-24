import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import Emergencias from '../pages/Emergencias';
import Farmacias from '../pages/Farmacias';
import Home from '../pages/Home';
import Perfil from '../pages/Profile';

type TabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
};

const Tab = createBottomTabNavigator();

const BottomTabs: React.FC = () => {
  useEffect(() => {
    // Aquí puedes colocar las llamadas a las funciones fetch si las necesitas
    // Ejemplo: dispatch(fetchFarmacias());
    // dispatch(fetchEmergencias());
    // dispatch(fetchPublicidad());
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }: TabBarIconProps) => {
          if (route.name === 'Home') {
            return (
              <Icon
                name="home"
                type="material"
                color={focused ? 'green' : 'gray'}
              />
            );
          } else if (route.name === 'Farmacias') {
            return (
              <Icon
                name="medkit"
                type="font-awesome"
                color={focused ? 'green' : 'gray'}
              />
            );
          } else if (route.name === 'Emergencias') {
            return (
              <Icon
                name="phone"
                type="font-awesome"
                color={focused ? 'green' : 'gray'}
              />
            );
          } else if (route.name === 'Perfil') {
            return (
              <Icon
                name="user"
                type="font-awesome"
                color={focused ? 'green' : 'gray'}
              />
            );
          }
        },
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: 'gray',
        tabBarActiveTintColor: 'green',
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Farmacias" options={{ headerShown: false }} component={Farmacias} />
      <Tab.Screen name="Emergencias" options={{ headerShown: false }} component={Emergencias} />
      <Tab.Screen name="Perfil" component={Perfil} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
