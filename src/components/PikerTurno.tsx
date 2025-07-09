import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function PickerTurno({
  value,
  onChange,
  label = 'Seleccionar turno'
}: {
  value?: Date | null,
  onChange: (date: Date) => void,
  label?: string
}) {
  const [show, setShow] = useState(false);

  return (
    <View style={{ marginBottom: 12 }}>
      <TouchableOpacity style={styles.input} onPress={() => setShow(true)}>
        <Text style={{ color: value ? '#222' : '#888' }}>
          {value
            ? value.toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' })
            : label}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={show}
        mode="datetime"
        date={value || new Date()}
        onConfirm={date => {
          setShow(false);
          onChange(date);
        }}
        onCancel={() => setShow(false)}
        is24Hour={true}
        locale="es-AR"
        minimumDate={new Date(2020, 0, 1)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#f1f1f1',
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginBottom: 4,
    borderColor: '#ccc',
    borderWidth: 1,
  },
});
