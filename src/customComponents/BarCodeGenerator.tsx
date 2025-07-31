// components/BarcodeModal.tsx
import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Barcode from 'react-native-barcode-builder';

const { width } = Dimensions.get('window');

const BarcodeModal = ({
  visible,
  onClose,
  value,
}: {
  visible: boolean;
  onClose: () => void;
  value: string;
}) => {
  if (!value) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.container} onPress={onClose}>
          <Barcode
            value={value?.toString() || '0000000000'}
            format="CODE128"
            width={2}
            height={100}
            text=""
          />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
});

export default BarcodeModal;
