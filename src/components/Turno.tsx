import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { usePharmacies } from '../context/PharmacyContext';
import TurnoCard from './TurnoCard';
import SkeletonCard from '../skeleton/SkeletonCard';
import { DateTime } from 'luxon';
import { showNotification } from '../services/notificationService';
import { createNotificationChannels } from '../constants/notificationChannels';
import { TimestampTrigger, TriggerType } from '@notifee/react-native';

const Turno: React.FC = () => {
  const { farmacias, loading } = usePharmacies();

  const now = DateTime.local().setZone('America/Argentina/Buenos_Aires');
  const matchingPharmacy = farmacias.find((pharmacy) => {
    return pharmacy.turn.some((t) => {
      const turnStart = DateTime.fromJSDate(t.toDate()).set({
        hour: 8,
        minute: 30,
        second: 0,
        millisecond: 0,
      });
      const turnEnd = turnStart.plus({ hours: 24 });

      return now >= turnStart && now <= turnEnd;
    });
  });

  useEffect(() => {
    const initialize = async () => {
      await createNotificationChannels();

      if (matchingPharmacy) {
        await scheduleNotifications(matchingPharmacy, now);
      }
    };

    initialize();
  }, [matchingPharmacy, now]);

  const scheduleNotifications = async (pharmacy: any, now: DateTime) => {
    const notifications = [
      {
        hour: 8,
        minute: 35,
        title: 'De turno hoy',
        body: `La farmacia de turno es ${pharmacy.name}`,
      },
      {
        hour: 12,
        minute: 0,
        title: 'Recordatorio de Turno',
        body: `La farmacia de turno es ${pharmacy.name}`,
      },
      {
        hour: 20,
        minute: 0,
        title: 'Recordatorio de Turno',
        body: `La farmacia de turno es ${pharmacy.name}`,
      },
    ];

    for (const { hour, minute, title, body } of notifications) {
      const notificationTime = now.set({
        hour,
        minute,
        second: 0,
        millisecond: 0,
      });

      if (notificationTime > now) {
        const trigger: TimestampTrigger = {
          type: TriggerType.TIMESTAMP,
          timestamp: notificationTime.toMillis(),
        };

        await showNotification(title, body, { name: pharmacy.name, dir: pharmacy.dir, image: pharmacy.image, detail: pharmacy.detail }, trigger);
      }
    }
  };

  if (loading) {
    return <SkeletonCard />;
  }

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
