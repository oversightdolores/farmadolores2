import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, PermissionsAndroid, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, { AndroidImportance } from '@notifee/react-native';

const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Access Fine Location',
        message: 'We need access to your location to show nearby pharmacies',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

const requestStoragePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Access Storage',
        message: 'We need access to your storage to save data',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

const requestNotificationPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
      return true;
    }
    return true;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

const requestAllPermissions = async () => {
  const locationGranted = await requestLocationPermission();
 // const storageGranted = await requestStoragePermission();
  const notificationGranted = await requestNotificationPermission();
  console.log(locationGranted, notificationGranted);

  return locationGranted  && notificationGranted;
};

const PermissionScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [permissionsGranted, setPermissionsGranted] = useState<boolean>(false);

  useEffect(() => {
    const checkPermissions = async () => {
      const granted = await requestAllPermissions();
      setPermissionsGranted(granted);
    };

    checkPermissions();
  }, []);

  const handleContinue = async () => {
    if (permissionsGranted) {
      await AsyncStorage.setItem('hasOpenedBefore', 'true');
      onComplete();
    } else {
      Alert.alert("Permissions not granted", "You need to grant all permissions to proceed.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.message}>We need some permissions to proceed.</Text>
      <Button title="Grant Permissions" onPress={handleContinue} />
    </View>
  );
};

export default PermissionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
});
