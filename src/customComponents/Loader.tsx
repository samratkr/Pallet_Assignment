import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

interface LoaderProps {
  size?: 'small' | 'large';
  background?: boolean;
  color?: string;
}

const Loader = ({
  size = 'large',
  background = true,
  color = '#1e90ff',
}: LoaderProps) => {
  return (
    <View style={[styles.container, background && styles.background]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    zIndex: 999,
  },
});

export default Loader;
