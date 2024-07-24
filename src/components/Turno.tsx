import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { DateTime } from 'luxon';
import notifee, { TriggerType, TimestampTrigger, AndroidImportance } from '@notifee/react-native';
import TurnoCard from './TurnoCard';

type Farmacia = {
  id: string;
  name: string;
  dir: string;
  tel: string;
  horarioAperturaMañana?: FirebaseFirestoreTypes.Timestamp | string;
  horarioCierreMañana?: FirebaseFirestoreTypes.Timestamp | string;
  horarioAperturaTarde?: FirebaseFirestoreTypes.Timestamp | string;
  horarioCierreTarde?: FirebaseFirestoreTypes.Timestamp | string;
  image: string;
  detail: string;
  turn: FirebaseFirestoreTypes.Timestamp[];
};

type FarmaciaConTiempos = {
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
  turn: FirebaseFirestoreTypes.Timestamp[];
};

const Turno: React.FC = () => {
  const [farmaciaDeTurno, setFarmaciaDeTurno] = useState<FarmaciaConTiempos | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const isTimestamp = (value: any): value is FirebaseFirestoreTypes.Timestamp => {
    return value instanceof firestore.Timestamp;
  };

  useEffect(() => {
    const fetchFarmacias = async () => {
      const snapshot = await firestore().collection('farmacias').get();
      const now = DateTime.local().setZone('America/Argentina/Buenos_Aires');
      const turnStartBase = DateTime.local().set({
        hour: 8,
        minute: 30,
        second: 0,
        millisecond: 0,
      });

      const farmacias: FarmaciaConTiempos[] = snapshot.docs.map(doc => {
        const data = doc.data() as Farmacia;
        return {
          ...data,
          id: doc.id,
          horarioAperturaMañana: isTimestamp(data.horarioAperturaMañana) ? data.horarioAperturaMañana.toDate().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) : data.horarioAperturaMañana,
          horarioCierreMañana: isTimestamp(data.horarioCierreMañana) ? data.horarioCierreMañana.toDate().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) : data.horarioCierreMañana,
          horarioAperturaTarde: isTimestamp(data.horarioAperturaTarde) ? data.horarioAperturaTarde.toDate().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) : data.horarioAperturaTarde,
          horarioCierreTarde: isTimestamp(data.horarioCierreTarde) ? data.horarioCierreTarde.toDate().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) : data.horarioCierreTarde,
        };
      });

      const matchingPharmacy = farmacias.find((pharmacy) => {
        return pharmacy.turn.some((t) => {
          const turnDate = t.toDate();
          const turnStart = DateTime.fromJSDate(turnDate).set({
            hour: turnStartBase.hour,
            minute: turnStartBase.minute,
            second: turnStartBase.second,
            millisecond: turnStartBase.millisecond,
          });
          const turnEnd = turnStart.plus({ hours: 24 });

          return now >= turnStart && now <= turnEnd;
        });
      });

      if (matchingPharmacy) {
        setFarmaciaDeTurno(matchingPharmacy);
        scheduleNotifications(matchingPharmacy);
      } else {
        setFarmaciaDeTurno(null);
      }

      setLoading(false);
    };

    fetchFarmacias();
  }, []);

  const scheduleNotifications = async (farmacia: FarmaciaConTiempos) => {
    const now = DateTime.local().setZone('America/Argentina/Buenos_Aires');

    // Programar notificación inicial a las 8:30 AM
    const notificationTime1 = DateTime.local().set({
      hour: 8,
      minute: 30,
      second: 0,
      millisecond: 0,
    });

    if (notificationTime1 > now) {
      const trigger1: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: notificationTime1.toMillis(),
      };

      await notifee.createTriggerNotification(
        {
          title: 'Cambio de Turno',
          body: `La farmacia de turno es ${farmacia.name}`,
          android: {
            channelId: 'default',
            importance: AndroidImportance.HIGH,
            pressAction: {
              id: 'default',
              launchActivity: 'default',
            }
          },
        },
        trigger1
      );
    }

    // Recordatorio al mediodía
    const notificationTime2 = DateTime.local().set({
      hour: 12,
      minute: 0,
      second: 0,
      millisecond: 0,
    });

    if (notificationTime2 > now) {
      const trigger2: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: notificationTime2.toMillis(),
      };

      await notifee.createTriggerNotification(
        {
          title: 'Recordatorio de Turno',
          body: `La farmacia de turno sigue siendo ${farmacia.name}`,
          android: {
            channelId: 'default',
            importance: AndroidImportance.HIGH,
            pressAction: {
              id: 'default',
              launchActivity: 'default',
            }
          },
        },
        trigger2
      );
    }

    // Recordatorio en la tarde
    const notificationTime3 = DateTime.local().setZone('America/Argentina/Buenos_Aires').set({
      hour: 23,
      minute: 3,
      second: 0,
      millisecond: 0,
    });

    console.log('notificationTime3',  notificationTime3 ); 
    if (notificationTime3 > now) {
      const trigger3: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: notificationTime3.toMillis(),
      };

      await notifee.createTriggerNotification(
        {
          title: 'Recordatorio de Turno',
          body: `La farmacia de turno sigue siendo ${farmacia.name}`,
          android: {
            channelId: 'default',
            importance: AndroidImportance.HIGH,
            timestamp: notificationTime3.toMillis(),
            actions: [
              {
                title: 'Ver Farmacia',
                pressAction: {
                  id: 'viewFarmacia',
                  launchActivity: 'default',
                },
              },
            ],
            pressAction: {
              id: 'default',
              launchActivity: 'default',

            },
          },
          data: { name: farmacia.name, dir: farmacia.dir,  image: farmacia.image, detail: farmacia.detail },
        },
        trigger3
      );
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Turno</Text>
      {farmaciaDeTurno ? (
        console.log('farmaciaDeTurno', true),
        <TurnoCard item={farmaciaDeTurno} onPress={(item) => {}} />
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
   
    backgroundColor: '#f8f9fa',
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
