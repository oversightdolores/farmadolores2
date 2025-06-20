import React, { createContext, useContext, useState, useEffect } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useTheme } from './ThemeContext';
import { ToastAndroid } from 'react-native';

// Configura Google Sign-In
GoogleSignin.configure({
  webClientId: '320257863836-7mq4mav5bst0iuraeahu2lpoinjrtc02.apps.googleusercontent.com', // Reemplaza con tu web client ID de Firebase console
});

type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
  isAuth: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<FirebaseAuthTypes.User | null>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {resetTheme, toggleTheme} = useTheme()
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
    };

    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        setIsAuth(true);
        await AsyncStorage.setItem('user', JSON.stringify(user));
      } else {
        setUser(null);
        setIsAuth(false);
        await AsyncStorage.removeItem('user');
      }
    });

    checkUser();

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      ToastAndroid.show('Email y contraseña requeridos', ToastAndroid.SHORT);
      return;
    }

    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error: any) {
      ToastAndroid.show(error.message || 'Error iniciando sesión', ToastAndroid.LONG);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    if (!email || !password) {
      ToastAndroid.show('Email y contraseña requeridos', ToastAndroid.SHORT);
      return;
    }

    setLoading(true);
    try {
      await auth().createUserWithEmailAndPassword(email, password);
    } catch (error: any) {
      ToastAndroid.show(error.message || 'Error registrando usuario', ToastAndroid.LONG);
      console.error('Register error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(userInfo?.data?.idToken);
      await auth().signInWithCredential(googleCredential);
    } catch (error: any) {
      ToastAndroid.show(error.message || 'Error con Google Sign-In', ToastAndroid.LONG);
      console.error('Google login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await auth().signOut();
      await GoogleSignin.signOut();
    } catch (error: any) {
      ToastAndroid.show('Error cerrando sesión', ToastAndroid.LONG);
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuth(false);
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('theme');
      resetTheme();
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
};