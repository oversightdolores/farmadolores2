// components/Turno.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { DateTime } from 'luxon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TurnoCard from './TurnoCard';
import { showNotification } from '../services/notificationService';
import { createNotificationChannels } from '../constants/notificationChannels';
import { TimestampTrigger, TriggerType } from '@notifee/react-native';

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
      await createNotificationChannels(); // Asegúrate de crear los canales

      const snapshot = await firestore().collection('farmacias').get();
      const now = DateTime.local().setZone('America/Argentina/Buenos_Aires');
      const turnStartBase = DateTime.local().set({
        hour: 8,
        minute: 35,
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
        await scheduleNotifications(matchingPharmacy);
        
      } else {
        setFarmaciaDeTurno(null);
      }

      setLoading(false);
    };

    fetchFarmacias();
  }, []);
  
  const scheduleNotifications = async (farmacia: FarmaciaConTiempos) => {
    const now = DateTime.local().setZone('America/Argentina/Buenos_Aires');
    console.log('Now:', now.toISO());
    
    const notifications = [
      {
        hour: 8,
        minute: 35,
        title: 'De turno hoy',
        body: `La farmacia de turno es ${farmacia.name}`,
      },
      {
        hour: 12,
        minute: 0,
        title: 'Recordatorio de Turno',
        body: `La farmacia de turno es ${farmacia.name}`,
      },
      {
        hour: 20,
        minute: 11,
        title: 'Recordatorio de Turno',
        body: `La farmacia de turno es ${farmacia.name}`,
      },
    ];
    
    for (const { hour, minute, title, body } of notifications) {
      const notificationTime = DateTime.local().setZone('America/Argentina/Buenos_Aires').set({
        hour,
        minute,
        second: 0,
        millisecond: 0,
      });
      console.log('Notification Time:', notificationTime.toISO());
      
      if (notificationTime > now) {
        const trigger: TimestampTrigger = {
          type: TriggerType.TIMESTAMP,
          timestamp: notificationTime.toMillis(),
        };
  
        await showNotification(title, body, { name: farmacia.name, dir: farmacia.dir, image: farmacia.image, detail: farmacia.detail }, trigger);
      }
    }
  };
  

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
    
  }

  return (
    <View style={styles.container}>
      {farmaciaDeTurno ? (
        <TurnoCard item={farmaciaDeTurno} onPress={(item) => { }} />
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
