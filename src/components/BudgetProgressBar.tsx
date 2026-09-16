import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SakuraTheme } from '@/constants/theme';

interface BudgetProgressBarProps {
  spent: number;
  limit: number;
  showLabels?: boolean;
  height?: number;
}

export const BudgetProgressBar: React.FC<BudgetProgressBarProps> = ({
  spent,
  limit,
  showLabels = false,
  height = 8,
}) => {
  const percentage = limit > 0 ? Math.min(Math.round((spent / limit) * 100), 100) : 0;
  const rawRatio = limit > 0 ? spent / limit : 0;

  let barColor = SakuraTheme.colors.primaryLight; // soft blossom rose
  let statusText = 'Dalam Batas Aman';
  let statusColor = SakuraTheme.colors.primary;

  if (rawRatio >= 0.9) {
    barColor = SakuraTheme.colors.error;
    statusText = 'Melebihi Limit!';
    statusColor = SakuraTheme.colors.error;
  } else if (rawRatio >= 0.75) {
    barColor = SakuraTheme.colors.warning;
    statusText = 'Mendekati Limit';
    statusColor = SakuraTheme.colors.warning;
  }

  return (
    <View style={styles.container}>
      {showLabels && (
        <View style={styles.labelRow}>
          <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
          <Text style={styles.percentText}>{percentage}%</Text>
        </View>
      )}
      <View style={[styles.track, { height }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              backgroundColor: barColor,
              height,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '600',
  },
  percentText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: SakuraTheme.colors.textSecondary,
  },
  track: {
    width: '100%',
    backgroundColor: SakuraTheme.colors.cardHighlight,
    borderRadius: SakuraTheme.borderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: SakuraTheme.borderRadius.full,
  },
});
