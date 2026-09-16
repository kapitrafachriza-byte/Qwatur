import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SakuraTheme } from '@/constants/theme';
import { useFinanceStore } from '@/stores/financeStore';

interface HeaderBarProps {
  title?: string;
  subtitle?: string;
  showProfile?: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  subtitle,
  showProfile = true,
}) => {
  const profile = useFinanceStore((state) => state.profile);
  const toggleHideBalance = useFinanceStore((state) => state.toggleHideBalance);

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        {showProfile && (
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarInitial}>SP</Text>
            <View style={styles.onlineBadge} />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title || `Halo, ${profile.name.split(' ')[0]} 🌸`}</Text>
          <Text style={styles.subtitle}>{subtitle || profile.tagline}</Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={toggleHideBalance}
          accessibilityLabel="Sensor Saldo"
        >
          <MaterialIcons
            name={profile.hideBalance ? 'visibility-off' : 'visibility'}
            size={22}
            color={SakuraTheme.colors.primary}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} accessibilityLabel="Notifikasi">
          <MaterialIcons name="notifications-none" size={22} color={SakuraTheme.colors.primary} />
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SakuraTheme.spacing.md,
    paddingTop: SakuraTheme.spacing.sm,
    paddingBottom: SakuraTheme.spacing.md,
    backgroundColor: SakuraTheme.colors.canvas,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: SakuraTheme.borderRadius.full,
    backgroundColor: SakuraTheme.colors.cardHighlight,
    borderWidth: 2,
    borderColor: SakuraTheme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  avatarInitial: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: SakuraTheme.colors.primary,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: SakuraTheme.colors.income,
    borderWidth: 2,
    borderColor: SakuraTheme.colors.canvas,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 18,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
  },
  subtitle: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '500',
    color: SakuraTheme.colors.textMuted,
    marginTop: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: SakuraTheme.borderRadius.full,
    backgroundColor: SakuraTheme.colors.card,
    borderWidth: 1,
    borderColor: SakuraTheme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: SakuraTheme.colors.primary,
  },
});
