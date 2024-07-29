import { GeoPoint } from 'firebase/firestore';

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
  turn: [];
  gps: GeoPoint; // Cambiado de string a GeoPoint
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

  };
  