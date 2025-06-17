import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import Icon from '@react-native-vector-icons/material-design-icons';
import { useTheme } from '../context/ThemeContext'; // Adjust the import path as necessary
interface AnimatedToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
}

const AnimatedToggleSwitch: React.FC<AnimatedToggleSwitchProps> = ({ isOn, onToggle }) => {
  const translateX = useSharedValue(isOn ? 30 : 0);
  const { theme } = useTheme();
  const { colors } = theme;

  React.useEffect(() => {
    translateX.value = withSpring(isOn ? 30 : 0);
  }, [isOn]);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.7} style={styles.container}>
      <Animated.View style={[styles.circle, rStyle]}>
        <Icon name={isOn ? "brightness-7" : "brightness-2"} size={24} color={colors.text} />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default AnimatedToggleSwitch;

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 30,
    backgroundColor: '#ccc',
    borderRadius: 15,
    padding: 2,
    justifyContent: 'center',
    marginRight: 30,
  },
  circle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
