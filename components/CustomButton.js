// components/CustomButton.js
import React from 'react';
import { Button } from 'react-native-paper';

export default function CustomButton({ title, onPress, icon }) {
  return (
    <Button
      mode="contained"
      icon={icon}
      onPress={onPress}
      style={{ marginVertical: 10, backgroundColor: '#4CAF50' }}
    >
      {title}
    </Button>
  );
}
