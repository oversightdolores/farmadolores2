import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../context/AuthContext';

const ReportProblemScreen: React.FC = () => {
  const { theme } = useTheme();
  const { colors } = theme;
  const [problem, setProblem] = useState('');
  const [loading, setLoading] = useState(false);
  const {user} = useAuth()

  const handleReport = async () => {
    if (!problem.trim()) {
      Alert.alert('Error', 'Por favor describe el pronlema.');
      return;
    }
    if (!user) {
        Alert.alert('Error', 'Usuario no autenticado.');
        return;
      }

    setLoading(true);

    try {
      const timestamp = firestore.FieldValue.serverTimestamp();
      await firestore().collection('reportes').add({
        problem,
        timestamp,
        userId: user.uid,
        userName: user.displayName,
        userEmail: user.email,
      });
      setProblem('');
      Alert.alert('Problema reportado', 'Tu reporte se ha enviado correctamente.');
    } catch (error) {
      console.error('Error reporting problem: ', error);
      Alert.alert('Error', 'Hubo un problema al enviar tu reporte. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Reporte un problema</Text>
      <TextInput
        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
        placeholder="Describe el problema"
        placeholderTextColor={colors.text}
        value={problem}
        onChangeText={setProblem}
        multiline
      />
      <Button
        title={loading ? 'enviando...' : 'enviar '}
        onPress={handleReport}
        color={colors.card}
        disabled={loading}
      />
    </View>
  );
};

export default ReportProblemScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 100,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    textAlignVertical: 'top',
  },
});
