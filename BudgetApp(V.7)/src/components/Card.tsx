import React from 'react';
import { StyleSheet, ViewStyle, View, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '../theme';

interface CardProps {
  style?: ViewStyle;
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'outlined';
  intensity?: number;
}

export const Card: React.FC<CardProps> = ({
  style,
  children,
  variant = 'default',
  intensity = 20,
}) => {
  const getCardStyle = () => {
    switch (variant) {
      case 'glass':
        return [
          styles.card,
          styles.glassCard,
          style,
        ];
      case 'outlined':
        return [
          styles.card,
          styles.outlinedCard,
          style,
        ];
      default:
        return [
          styles.card,
          styles.defaultCard,
          style,
        ];
    }
  };

  return (
    <View style={getCardStyle()}>
      {variant === 'glass' && (
        <BlurView intensity={intensity} style={StyleSheet.absoluteFill} />
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  defaultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  outlinedCard: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
}); 