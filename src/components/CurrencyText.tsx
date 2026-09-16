import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { SakuraTheme } from '@/constants/theme';

interface CurrencyTextProps {
  amount: number;
  style?: TextStyle | TextStyle[];
  prefixStyle?: TextStyle | TextStyle[];
  showSign?: boolean; // e.g. +Rp 10.000 or -Rp 10.000
  type?: 'income' | 'expense' | 'neutral';
}

export const CurrencyText: React.FC<CurrencyTextProps> = ({
  amount,
  style,
  prefixStyle,
  showSign = false,
  type = 'neutral',
}) => {
  let textColor = SakuraTheme.colors.textPrimary;
  if (type === 'income') textColor = SakuraTheme.colors.income;
  if (type === 'expense') textColor = SakuraTheme.colors.expense;

  const sign = showSign ? (amount > 0 ? '+' : amount < 0 ? '-' : '') : '';
  const absoluteAmount = Math.abs(amount);
  const formatted = absoluteAmount.toLocaleString('id-ID');

  return (
    <Text style={[styles.text, { color: textColor }, style]}>
      {sign}
      <Text style={[styles.prefix, prefixStyle]}>Rp </Text>
      {formatted}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontWeight: '700',
  },
  prefix: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    color: SakuraTheme.colors.textMuted,
  },
});
