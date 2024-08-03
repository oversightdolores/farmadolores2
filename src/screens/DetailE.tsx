import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigationTypes'; // Ajusta la ruta según tu estructura de archivos
import { useTheme } from '../context/ThemeContext';
import MapView, { Marker } from 'react-native-maps';
import { GeoPoint } from 'firebase/firestore';
import AdBanner from '../components/ads/AdBanner';
import { BannerAdSize } from 'react-native-google-mobile-ads';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'DetailE'>;

const DetailE = () => {
  const { theme } = useTheme();
  const { colors } = theme;
  const route = useRoute<DetailScreenRouteProp>();
  const { emergencia } = route.params;

  // Extrae latitud y longitud del geopoint de Firebase
  const { latitude, longitude } = (emergencia.gps as GeoPoint).toJSON();

  const makeCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };
  

  return (
    <>
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: emergencia.detail }} style={styles.image} />
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>{emergencia.name}</Text>
        <Text style={[styles.info, { color: colors.text }]}>Dirección: {emergencia.dir}</Text>
        <TouchableOpacity onPress={() => makeCall(emergencia.tel)}>
          <Text style={[styles.info, { color: colors.text, textDecorationLine: 'underline' }]}>Teléfono: {emergencia.tel}</Text>
        </TouchableOpacity>
       
      </View>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.020,
            longitudeDelta: 0.010,
          }}
          >
          <Marker coordinate={{ latitude, longitude }} title={emergencia.name} />
        </MapView>
      </View>
    </ScrollView>
    <AdBanner size={BannerAdSize.FULL_BANNER} />
          </>
  );
};

export default DetailE;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  card: {
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 18,
    marginBottom: 5,
  },
  mapContainer: {
    height: Dimensions.get('window').height * 0.3, // Ajusta la altura del mapa
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
