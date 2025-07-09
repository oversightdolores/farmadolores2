import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { usePharmacies } from '../context/PharmacyContext';
import SkeletonCard from '../skeleton/SkeletonCard';
import { DateTime } from 'luxon';
import { useTheme } from '../context/ThemeContext';
import TurnoCard from './TurnoCard';
import Icon from '@react-native-vector-icons/material-design-icons';

const Turno: React.FC = () => {
  const { theme } = useTheme();
  const { colors } = theme;
  const { farmacias, loading, fetchPharmacies } = usePharmacies();
  const [error, setError] = useState<string | null>(null);
  const now = DateTime.local().setZone('America/Argentina/Buenos_Aires');

  if (loading) {
    return <SkeletonCard />;
  }

  let matchingPharmacy = undefined;
console.log('farmacias: ', farmacias)
  try {
    matchingPharmacy = farmacias?.find((pharmacy) => {
      if (!Array.isArray(pharmacy?.turn)) return false;
      return pharmacy.turn.some((t) => {
        if (!t || typeof t.toDate !== 'function') return false;
        let turnStart;
        try {
          turnStart = DateTime.fromJSDate(t.toDate()).set({
            hour: 8,
            minute: 30,
            second: 0,
            millisecond: 0,
          });
        } catch {
          return false;
        }
        const turnEnd = turnStart.plus({ hours: 24 });
        return now >= turnStart && now <= turnEnd;
      });
    });
  } catch (e: any) {
    // Si la lógica crashea, lo mostramos bonito
    setError('Ocurrió un error mostrando la farmacia de turno.');
  }

  const handleReload = () => {
    setError(null);
    fetchPharmacies();
  };

  if (error) {
    return (
      <View style={styles.noTurnos}>
        <Text style={[styles.noTurnosText, { color: colors.text }]}>
          {error}
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.card }]}
          onPress={handleReload}
        >
          <Icon name="reload" size={40} color={colors.text} />
        </TouchableOpacity>
      </View>
    );
  }
  console.log('matchFarm: ', matchingPharmacy)

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
            <Icon name="reload" size={40} color={colors.text} />
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
