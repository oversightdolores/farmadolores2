import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import firestore, { FirebaseFirestoreTypes, GeoPoint } from '@react-native-firebase/firestore';
import { DateTime } from 'luxon';

type Farmacia = {
  id: string;
  name: string;
  dir: string;
  tel: string;
  horarioAperturaMañana: string;
  horarioCierreMañana: string;
  horarioAperturaTarde: string;
  horarioCierreTarde: string;
  image: string;
  detail: string;
  turn: FirebaseFirestoreTypes.Timestamp[];
  gps: GeoPoint;
};

type PharmacyContextType = {
  farmacias: Farmacia[];
  loading: boolean;
};

const isTimestamp = (value: any): value is FirebaseFirestoreTypes.Timestamp => {
  return value instanceof firestore.Timestamp;
};

const formatTime = (timestamp: FirebaseFirestoreTypes.Timestamp | string): string => {
  if (isTimestamp(timestamp)) {
    return DateTime.fromJSDate(timestamp.toDate()).setZone('America/Argentina/Buenos_Aires').toLocaleString(DateTime.TIME_24_SIMPLE);
  }
  return timestamp;
};

const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

export const PharmacyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [farmacias, setFarmacias] = useState<Farmacia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = firestore().collection('farmacias').onSnapshot(snapshot => {
      const fetchedFarmacias: Farmacia[] = snapshot.docs.map(doc => {
        const data = doc.data() as Omit<Farmacia, 'id'> & { turn: FirebaseFirestoreTypes.Timestamp[] };
        return {
          ...data,
          id: doc.id,
          horarioAperturaMañana: formatTime(data.horarioAperturaMañana),
          horarioCierreMañana: formatTime(data.horarioCierreMañana),
          horarioAperturaTarde: formatTime(data.horarioAperturaTarde),
          horarioCierreTarde: formatTime(data.horarioCierreTarde),
        };
      });

      setFarmacias(fetchedFarmacias);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching farmacias: ", error);
      setError("Hubo un problema al cargar los datos. Por favor, inténtalo de nuevo.");
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <PharmacyContext.Provider value={{ farmacias, loading }}>
      {children}
    </PharmacyContext.Provider>
  );
};

export const usePharmacies = (): PharmacyContextType => {
  const context = useContext(PharmacyContext);
  if (!context) {
    throw new Error('usePharmacies must be used within a PharmacyProvider');
  }
  return context;
};
