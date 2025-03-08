import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
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
  fetchPharmacies: () => void;
};

const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

export const PharmacyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [farmacias, setFarmacias] = useState<Farmacia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Suscripción en tiempo real
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('farmacias')
      .onSnapshot(
        snapshot => {
          const fetchedFarmacias: Farmacia[] = snapshot.docs.map(doc => {
            const data = doc.data() as Farmacia;  // Ajusta tipo si hace falta
            return { ...data, id: doc.id };
          });

          setFarmacias(fetchedFarmacias);
          setLoading(false);
        },
        error => {
          console.error('Error onSnapshot: ', error);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, []);

  // Función manual de recarga (opcional)
  const fetchPharmacies = useCallback(() => {
    setLoading(true);
    firestore()
      .collection('farmacias')
      .get()
      .then(snapshot => {
        const fetchedFarmacias: Farmacia[] = snapshot.docs.map(doc => {
          const data = doc.data() as Farmacia;
          return { ...data, id: doc.id };
        });
        setFarmacias(fetchedFarmacias);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetchPharmacies:', error);
        setLoading(false);
      });
  }, []);

  return (
    <PharmacyContext.Provider value={{ farmacias, loading, fetchPharmacies }}>
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
