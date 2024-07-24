import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigationTypes';
import { NavigationProp } from '@react-navigation/native';

type Farmacia = {
  id: string;
  name: string;
  dir: string;
  tel: string;
  horarioAperturaMañana?: string;
  horarioCierreMañana?: string;
  horarioAperturaTarde?: string;
  horarioCierreTarde?: string;
  image: string;
  detail: string;
  turn: any; // Puede ajustar esto según sea necesario
};

type TurnoCardProps = {
  item: Farmacia;
  onPress: (item: Farmacia) => void;
};

const TurnoCard: React.FC<TurnoCardProps> = ({ item, onPress }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { name, dir, tel, horarioAperturaMañana, horarioCierreMañana, horarioAperturaTarde, horarioCierreTarde, detail } = item;

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Detail', { farmacia: item })}>
      <View style={styles.card}>
        <Image source={{ uri: detail }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.info}>Dirección: {dir}</Text>
          <Text style={styles.info}>Teléfono: {tel}</Text>
          {horarioAperturaMañana && horarioCierreMañana && (
            <Text style={styles.info}>Horario Mañana: {horarioAperturaMañana} - {horarioCierreMañana}</Text>
          )}
          {horarioAperturaTarde && horarioCierreTarde && (
            <Text style={styles.info}>Horario Tarde: {horarioAperturaTarde} - {horarioCierreTarde}</Text>
          )}
        </View>
        <View style={styles.turnoBadge}>
          <Text style={styles.turnoText}>De Turno</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TurnoCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    margin: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
  },
  infoContainer: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  turnoBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#28a745',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  turnoText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
