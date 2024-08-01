import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { usePharmacies } from '../context/PharmacyContext';
import TurnoCard from './TurnoCard';
import SkeletonCard from '../skeleton/SkeletonCard';
import { DateTime } from 'luxon';

const Turno: React.FC = () => {
  const { farmacias, loading } = usePharmacies();

  const now = DateTime.local().setZone('America/Argentina/Buenos_Aires');
  const matchingPharmacy = farmacias.find((pharmacy) => {
    return pharmacy.turn.some((t) => {
      const turnStart = DateTime.fromJSDate(t.toDate()).set({
        hour: 8,
        minute: 35,
        second: 0,
        millisecond: 0,
      });
      const turnEnd = turnStart.plus({ hours: 24 });

      return now >= turnStart && now <= turnEnd;
    });
  });

  

  return (
    <View style={styles.container}>
      {matchingPharmacy ? (
        <TurnoCard item={matchingPharmacy} onPress={(item) => { }} />
      ) : (
        <View style={styles.noTurnos}>
          <Text style={styles.noTurnosText}>No hay farmacias de turno en este momento</Text>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noTurnosText: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
