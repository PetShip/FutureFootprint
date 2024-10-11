// components/MetricExplanationModal.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Text, Button } from 'react-native-paper';

const MetricExplanationModal = ({ visible, onDismiss }) => {
  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Metric Explanations</Text>
          <Text style={styles.modalText}>
            **CO₂**: Carbon dioxide emissions measured in kilograms (kg).
            {'\n\n'}
            **Miles Driven**: An equivalent of CO₂ emissions expressed as miles driven by an average car.
            {'\n\n'}
            **Trees Planted**: An equivalent of CO₂ emissions offset expressed as the number of trees required to absorb the same amount of CO₂ in a year.
          </Text>
          <Button onPress={onDismiss}>Close</Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default MetricExplanationModal;
