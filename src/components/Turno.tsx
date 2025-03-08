// Turno.tsx
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { usePharmacies } from '../context/PharmacyContext';
import SkeletonCard from '../skeleton/SkeletonCard';
import { DateTime } from 'luxon';
import { useTheme } from '../context/ThemeContext';
import TurnoCard from './TurnoCard';
import Icon from 'react-native-vector-icons/AntDesign';

const Turno: React.FC = () => {
  const { theme } = useTheme();
  const { colors } = theme;
  const { farmacias, loading, fetchPharmacies } = usePharmacies();
  const now = DateTime.local().setZone('America/Argentina/Buenos_Aires');

  // Si está cargando, muestra el Skeleton
  if (loading) {
    return <SkeletonCard />;
  }

  // Lógica para encontrar la farmacia de turno
  const matchingPharmacy = farmacias.find((pharmacy) =>
    pharmacy.turn.some((t) => {
      const turnStart = DateTime.fromJSDate(t.toDate()).set({
        hour: 8,
        minute: 30,
        second: 0,
        millisecond: 0,
      });
      const turnEnd = turnStart.plus({ hours: 24 });
      return now >= turnStart && now <= turnEnd;
    })
  );

  // Botón que dispara el fetch manual
  const handleReload = () => {
    fetchPharmacies();
  };

  return (
    <View style={styles.container}>
      {matchingPharmacy ? (
        <TurnoCard item={matchingPharmacy} onPress={() => {}} />
      ) : (
        <View style={styles.noTurnos}>
          <Text style={[styles.noTurnosText, { color: colors.text }]}>
            No hay farmacias de turno en este momento
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.card }]}
            onPress={handleReload}
          >
            <Icon name="reload1" size={40} color={colors.text} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Turno;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  noTurnos: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noTurnosText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    padding: 10,
    borderRadius: 100,
  },
});
