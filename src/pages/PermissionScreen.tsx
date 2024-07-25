import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const requestPermissions = async () => {
  const location = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
  const notifications = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);

  return location === RESULTS.GRANTED && storage === RESULTS.GRANTED && notifications === RESULTS.GRANTED;
};

const PermissionScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const handleRequestPermissions = async () => {
    const granted = await requestPermissions();
    if (granted) {
      onComplete();
    } else {
      Alert.alert('Permissions not granted', 'You need to grant all permissions to proceed.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.message}>We need some permissions to proceed.</Text>
      <Button title="Grant Permissions" onPress={handleRequestPermissions} />
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
