import { AnimationObject } from 'lottie-react-native';

export interface OnboardingData {
  id: number;
  animation: AnimationObject;
  text: string;
  textColor: string;
  backgroundColor: string;
}

const data: OnboardingData[] = [
  {
    id: 1,
    animation: require('../assets/animations/1.json'),
    text: 'Encuentra la farmacia de turno más cercana con un solo clic.',
    textColor: '#005b4f',
    backgroundColor: '#98ECC7',
  },
  {
    id: 2,
    animation: require('../assets/animations/2.json'),
    text: 'Recibe notificaciones instantáneas de farmacias de turno.',
    textColor: '#1e2169',
    backgroundColor: '#bae4fd',
  },
  {
    id: 3,
    animation: require('../assets/animations/3.json'),
    text: 'Para brindarte un mejor servicio, necesitamos algunos permisos.',
    textColor: '#F15937',
    backgroundColor: '#faeb8a',
  },
];

export default data;
