import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigationTypes'; // Ajusta la ruta según tu estructura de archivos

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

const DetailScreen = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const { farmacia } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: farmacia.image }} style={styles.image} />
      <Text style={styles.title}>{farmacia.name}</Text>
      <Text style={styles.info}>Dirección: {farmacia.dir}</Text>
      <Text style={styles.info}>Teléfono: {farmacia.tel}</Text>
      <Text style={styles.info}>Horario Mañana: {farmacia.horarioAperturaMañana} - {farmacia.horarioCierreMañana}</Text>
      <Text style={styles.info}>Horario Tarde: {farmacia.horarioAperturaTarde} - {farmacia.horarioCierreTarde}</Text>
    </View>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
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
});
