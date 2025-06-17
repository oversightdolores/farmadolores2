import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { useTheme } from '../context/ThemeContext';

import Emergencias from '../screens/Emergencias';
import Farmacias from '../screens/Farmacias';
import Home from '../screens/Home';
import Perfil from '../screens/Profile';

type TabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
};

const Tab = createBottomTabNavigator();

const BottomTabs: React.FC = () => {
  const { theme } = useTheme();
  const { colors } = theme;

  useEffect(() => {
    // Podés cargar datos acá si lo necesitás
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }: TabBarIconProps) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = 'home-variant';
              break;
            case 'Farmacias':
              iconName = 'medical-bag';
              break;
            case 'Emergencias':
              iconName = 'ambulance';
              break;
            case 'Perfil':
              iconName = 'account';
              break;
            default:
              iconName = 'help-circle-outline';
              break;
          }

          return (
            <MaterialDesignIcons
              name={iconName}
              size={size}
              color={focused ? colors.iconActive : colors.iconInactive}
            />
          );
        },
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: colors.iconInactive,
        tabBarActiveTintColor: colors.iconActive,
        tabBarStyle: {
          backgroundColor: colors.tabBarBackground,
          borderTopColor: colors.tabBarBorder,
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Tab.Screen name="Farmacias" component={Farmacias} options={{ headerShown: false }} />
      <Tab.Screen name="Emergencias" component={Emergencias} options={{ headerShown: false }} />
      <Tab.Screen name="Perfil" component={Perfil} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
