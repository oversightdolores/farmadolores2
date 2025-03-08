import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface AnimatedToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
}

const AnimatedToggleSwitch: React.FC<AnimatedToggleSwitchProps> = ({ isOn, onToggle }) => {
  const translateX = useSharedValue(isOn ? 30 : 0);

  const handleGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.translationX > 10) {
      translateX.value = withSpring(30);
      if (!isOn) onToggle();
    } else if (event.nativeEvent.translationX < -10) {
      translateX.value = withSpring(0);
      if (isOn) onToggle();
    }
  };

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={handleGestureEvent}>
      <View style={styles.container}>
        <Animated.View style={[styles.circle, rStyle]}>
          <Icon name={isOn ? "brightness-7" : "brightness-2"} size={24} color="#fff" />
        </Animated.View>
      </View>
    </PanGestureHandler>
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
