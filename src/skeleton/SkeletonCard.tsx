import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming, withRepeat } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

const screenWidth = Dimensions.get('window').width;

const SkeletonCard: React.FC = () => {
  const { theme } = useTheme();
  const { colors } = theme;

  const animatedValue1 = useSharedValue(0.5);
  const animatedValue2 = useSharedValue(0.5);
  const animatedValue3 = useSharedValue(0.5);

  React.useEffect(() => {
    animatedValue1.value = withRepeat(
      withTiming(1, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    animatedValue2.value = withRepeat(
      withTiming(1, {
        duration: 1200,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    animatedValue3.value = withRepeat(
      withTiming(1, {
        duration: 1400,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, [animatedValue1, animatedValue2, animatedValue3]);

  const animatedBorderStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedValue1.value,
    };
  });

  const animatedCircleStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedValue2.value,
    };
  });

  const animatedTextStyle1 = useAnimatedStyle(() => {
    return {
      opacity: animatedValue1.value,
    };
  });

  const animatedTextStyle2 = useAnimatedStyle(() => {
    return {
      opacity: animatedValue2.value,
    };
  });

  const animatedTextStyle3 = useAnimatedStyle(() => {
    return {
      opacity: animatedValue3.value,
    };
  });

  return (
    <View style={styles.card }>
      <Animated.View style={[styles.imagePlaceholder, animatedBorderStyle]}>
        <Animated.View style={[styles.circle, animatedCircleStyle, { backgroundColor: colors.primary }]} />
      </Animated.View>
      <View style={styles.infoContainer} >
      <Animated.View style={[ animatedTextStyle1, {backgroundColor: colors.card}]}>
        <Animated.View style={[styles.textPlaceholder, animatedTextStyle1, { backgroundColor: colors.text }]} />
        <Animated.View style={[styles.textPlaceholder, animatedTextStyle2, { backgroundColor: colors.text }]} />
        <Animated.View style={[styles.textPlaceholder, animatedTextStyle3, { backgroundColor: colors.text }]} />
      </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    margin: 20,
    overflow: 'hidden',
    width: screenWidth - 40,
    height: 340,
    
  },
  imagePlaceholder: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  infoContainer: {
    padding: 30,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#1c1c1c',
  },
  infoContainer1: {
    height: 180,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
   
  },
  textPlaceholder: {
    height: 20,
    marginBottom: 10,
    borderRadius: 5,
    width: '80%',
  },
});

export default SkeletonCard;
