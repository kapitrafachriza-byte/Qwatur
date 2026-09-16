import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SakuraTheme } from '@/constants/theme';

interface SakuraCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  variant?: 'default' | 'subtle' | 'highlight' | 'petalBorder';
}

export const SakuraCard: React.FC<SakuraCardProps> = ({
  children,
  style,
  variant = 'default',
}) => {
  let cardStyle: ViewStyle = styles.defaultCard;

  if (variant === 'subtle') cardStyle = styles.subtleCard;
  if (variant === 'highlight') cardStyle = styles.highlightCard;
  if (variant === 'petalBorder') cardStyle = styles.petalBorderCard;

  return <View style={[styles.base, cardStyle, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: SakuraTheme.borderRadius.lg,
    padding: SakuraTheme.spacing.md,
    backgroundColor: SakuraTheme.colors.card,
  },
  defaultCard: {
    backgroundColor: SakuraTheme.colors.card,
    borderWidth: 1,
    borderColor: SakuraTheme.colors.border,
    shadowColor: SakuraTheme.colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  subtleCard: {
    backgroundColor: SakuraTheme.colors.cardSubtle,
    borderWidth: 1,
    borderColor: SakuraTheme.colors.border,
  },
  highlightCard: {
    backgroundColor: SakuraTheme.colors.cardHighlight,
    borderWidth: 1,
    borderColor: SakuraTheme.colors.border,
  },
  petalBorderCard: {
    backgroundColor: SakuraTheme.colors.card,
    borderWidth: 1.5,
    borderColor: SakuraTheme.colors.border,
    shadowColor: SakuraTheme.colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
});
