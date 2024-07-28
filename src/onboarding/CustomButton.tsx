import React from 'react';
import { Alert, FlatList, StyleSheet, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import Animated, {
  AnimatedRef,
  SharedValue,
  interpolateColor,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { OnboardingData } from './data';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigationTypes';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

type Props = {
  dataLength: number;
  flatListIndex: SharedValue<number>;
  flatListRef: AnimatedRef<FlatList<OnboardingData>>;
  x: SharedValue<number>;
  setIsFirstLaunch: (value: boolean) => void; // Añadimos esta prop
};

const CustomButton = ({ flatListRef, flatListIndex, dataLength, x, setIsFirstLaunch }: Props) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const requestPermissions = async () => {
    try {
      console.log('Solicitando permisos...');
      const locationStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      console.log('Estado del permiso de ubicación:', locationStatus);
      if (locationStatus !== RESULTS.GRANTED) {
        const locationRequestStatus = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        console.log('Resultado de la solicitud de ubicación:', locationRequestStatus);
        if (locationRequestStatus !== RESULTS.GRANTED) {
          Alert.alert('Permiso denegado', 'No se otorgó el permiso de ubicación');
          return;
        }
      }
  
      const notificationStatus = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
      console.log('Estado del permiso de notificaciones:', notificationStatus);
      if (notificationStatus !== RESULTS.GRANTED) {
        const notificationRequestStatus = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
        console.log('Resultado de la solicitud de notificaciones:', notificationRequestStatus);
        if (notificationRequestStatus !== RESULTS.GRANTED) {
          Alert.alert('Permiso denegado', 'No se otorgó el permiso de notificaciones');
          return;
        } else {
          console.log('Notificaciones permitidas');
        }
      }
  
      setIsFirstLaunch(false);
    } catch (error) {
      console.error('Error solicitando permisos:', error);
    }
  };
  
  
  const buttonAnimationStyle = useAnimatedStyle(() => {
    return {
      width:
        flatListIndex.value === dataLength - 1
          ? withSpring(140)
          : withSpring(60),
      height: 60,
    };
  });

  const arrowAnimationStyle = useAnimatedStyle(() => {
    return {
      width: 30,
      height: 30,
      opacity:
        flatListIndex.value === dataLength - 1 ? withTiming(0) : withTiming(1),
      transform: [
        {
          translateX:
            flatListIndex.value === dataLength - 1
              ? withTiming(100)
              : withTiming(0),
        },
      ],
    };
  });

  const textAnimationStyle = useAnimatedStyle(() => {
    return {
      opacity:
        flatListIndex.value === dataLength - 1 ? withTiming(1) : withTiming(0),
      transform: [
        {
          translateX:
            flatListIndex.value === dataLength - 1
              ? withTiming(0)
              : withTiming(-100),
        },
      ],
    };
  });

  const animatedColor = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      x.value,
      [0, SCREEN_WIDTH, 2 * SCREEN_WIDTH],
      ['#005b4f', '#1e2169', '#F15937'],
    );

    return {
      backgroundColor: backgroundColor,
    };
  });

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (flatListIndex.value < dataLength - 1) {
          flatListRef.current?.scrollToIndex({ index: flatListIndex.value + 1 });
        } else {
          requestPermissions();
        }
      }}>
      <Animated.View
        style={[styles.container, buttonAnimationStyle, animatedColor]}>
        <Animated.Text style={[styles.textButton, textAnimationStyle]}>
          Comencemos
        </Animated.Text>
        <Animated.Image
          source={require('../assets/images/ArrowIcon.png')}
          style={[styles.arrow, arrowAnimationStyle]}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e2169',
    padding: 10,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  arrow: {
    position: 'absolute',
  },
  textButton: { color: 'white', fontSize: 16, position: 'absolute' },
});
