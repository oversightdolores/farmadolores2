import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { DateTime } from 'luxon';
import { RootStackParamList, Farmacia } from '../types/navigationTypes';



type TurnoCardProps = {
  item: Farmacia;
  onPress: (item: Farmacia) => void;
};

const TurnoCard: React.FC<TurnoCardProps> = ({ item, onPress }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { theme } = useTheme();
  const { colors } = theme;

  const {
    name,
    dir,
    tel,
    horarioAperturaMañana,
    horarioCierreMañana,
    horarioAperturaTarde,
    horarioCierreTarde,
    detail
  } = item;

  // 1) Conviertes los campos Timestamp a string con Luxon (o .toDateString(), etc.)
  const aperturaMañanaStr =
    horarioAperturaMañana
      ? DateTime.fromJSDate(horarioAperturaMañana.toDate()).setZone('America/Argentina/Buenos_Aires').toFormat('HH:mm')
      : null;

  const cierreMañanaStr =
    horarioCierreMañana
      ? DateTime.fromJSDate(horarioCierreMañana.toDate()).setZone('America/Argentina/Buenos_Aires').toFormat('HH:mm')
      : null;

  const aperturaTardeStr =
    horarioAperturaTarde
      ? DateTime.fromJSDate(horarioAperturaTarde.toDate()).setZone('America/Argentina/Buenos_Aires').toFormat('HH:mm')
      : null;

  const cierreTardeStr =
    horarioCierreTarde
      ? DateTime.fromJSDate(horarioCierreTarde.toDate()).setZone('America/Argentina/Buenos_Aires').toFormat('HH:mm')
      : null;

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Detail', { farmacia: item })}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        {/* 'detail' aquí asumo que es una URL de imagen, no un objeto. */}
        <Image source={{ uri: detail }} style={styles.image} />
        
        <View style={styles.infoContainer}>
          <Text style={[styles.title, { color: colors.text }]}>{name}</Text>
          <Text style={[styles.info, { color: colors.text }]}>Dirección: {dir}</Text>
          <Text style={[styles.info, { color: colors.text }]}>Teléfono: {tel}</Text>

          {/* 2) Solo mostramos si existen ambas strings */}
          {aperturaMañanaStr && cierreMañanaStr && (
            <Text style={[styles.info, { color: colors.text }]}>
              Horario Mañana: {aperturaMañanaStr} - {cierreMañanaStr}
            </Text>
          )}

          {aperturaTardeStr && cierreTardeStr && (
            <Text style={[styles.info, { color: colors.text }]}>
              Horario Tarde: {aperturaTardeStr} - {cierreTardeStr}
            </Text>
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
