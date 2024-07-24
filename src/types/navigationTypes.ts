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
  Permission: undefined
  

  };
  