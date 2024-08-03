import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { GeoPoint } from 'firebase/firestore';

export type Farmacia = {
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
  turn: [];
  gps: GeoPoint;
};
export type FarmaciaConTiempos = {
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

export type Local = {
  id: string;
  name: string;
  descrip: string;
  image: string;
  direccion: string;
  tel: []
  url: string;
};


export type Emergencia = {
  id: string;
  name: string;
  dir: string;
  tel: string;
  image: string;
  detail: string;
  gps: GeoPoint;
};

export type RootStackParamList = {
  Home: undefined;
  Farmacias: undefined;
  Emergencias: undefined;
  DetailScreen: {
    name: string;
    dir: string;
    tel: string;
    image: string;
    detail: string;
    horarioAperturaMañana?: string;
    horarioCierreMañana?: string;
    horarioAperturaTarde?: string;
    horarioCierreTarde?: string;
  };
  BottomTabs: undefined;
  Detail: { farmacia: Farmacia };
  DetailE: { emergencia: Emergencia};
  Permission: undefined;
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  Turno: undefined;
  Settings: undefined;
  Welcome: undefined;
  Onboarding: undefined;
  App: undefined;
  Auth: undefined;
  Drawer: undefined;
  PrimeroAuxilios: undefined;
  Local: undefined;
  LocalDetail: { local: Local };
};
