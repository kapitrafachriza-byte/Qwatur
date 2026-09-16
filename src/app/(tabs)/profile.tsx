import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { SakuraTheme } from '@/constants/theme';
import { useFinanceStore } from '@/stores/financeStore';
import { SakuraCard } from '@/components/SakuraCard';

export default function ProfileScreen() {
  const { profile, updateProfile, toggleHideBalance } = useFinanceStore();

  const handleToggleBiometric = () => {
    const nextVal = !profile.biometricEnabled;
    updateProfile({ biometricEnabled: nextVal });
    Alert.alert(
      'Keamanan Biometrik',
      nextVal
        ? 'Autentikasi Face ID / Sidik Jari telah diaktifkan untuk membuka aplikasi.'
        : 'Autentikasi biometrik dinonaktifkan.'
    );
  };

  const handleToggleDailyReminder = () => {
    const nextVal = !profile.dailyReminderEnabled;
    updateProfile({ dailyReminderEnabled: nextVal });
    Alert.alert(
      'Pengingat Harian',
      nextVal
        ? `Alarm pengingat catat transaksi diatur setiap pukul ${profile.dailyReminderTime} WIB.`
        : 'Pengingat harian dinonaktifkan.'
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card Header */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarLargeWrap}>
            <Text style={styles.avatarLargeInitial}>SP</Text>
            <View style={styles.crownBadge}>
              <MaterialIcons name="local-florist" size={12} color="#ffffff" />
            </View>
          </View>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileEmail}>{profile.email}</Text>
          <View style={styles.tierBadge}>
            <MaterialIcons name="verified" size={14} color="#047857" />
            <Text style={styles.tierText}>Member Sakura Pro</Text>
          </View>

          <View style={styles.cloudSyncRow}>
            <MaterialIcons name="cloud-done" size={16} color="#047857" />
            <Text style={styles.cloudSyncText}>{profile.syncStatus}</Text>
          </View>
        </View>

        {/* 1. Keamanan & Sensor Privasi */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Keamanan & Sensor Privasi</Text>
        </View>

        <SakuraCard style={styles.settingsGroupCard}>
          <View style={styles.settingItemRow}>
            <View style={styles.settingIconWrap}>
              <MaterialIcons name="fingerprint" size={22} color={SakuraTheme.colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Kunci Biometrik (Face ID / PIN)</Text>
              <Text style={styles.settingSubtitle}>
                Wajibkan autentikasi saat membuka data finansial
              </Text>
            </View>
            <Switch
              value={profile.biometricEnabled}
              onValueChange={handleToggleBiometric}
              trackColor={{ false: '#fce7f3', true: SakuraTheme.colors.primaryLight }}
              thumbColor={profile.biometricEnabled ? SakuraTheme.colors.primary : '#ffffff'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItemRow}>
            <View style={styles.settingIconWrap}>
              <MaterialIcons name="visibility-off" size={22} color={SakuraTheme.colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Sensor Penyamar Saldo</Text>
              <Text style={styles.settingSubtitle}>
                Samarkan angka saldo di tempat umum (Rp ••••••)
              </Text>
            </View>
            <Switch
              value={profile.hideBalance}
              onValueChange={toggleHideBalance}
              trackColor={{ false: '#fce7f3', true: SakuraTheme.colors.primaryLight }}
              thumbColor={profile.hideBalance ? SakuraTheme.colors.primary : '#ffffff'}
            />
          </View>
        </SakuraCard>

        {/* 2. Disiplin & Siklus Finansial */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Disiplin & Siklus Finansial</Text>
        </View>

        <SakuraCard style={styles.settingsGroupCard}>
          <TouchableOpacity
            style={styles.settingClickableRow}
            onPress={() =>
              Alert.alert('Tanggal Reset Anggaran', 'Anggaran di-reset otomatis setiap tanggal 25 (Hari Gajian).')
            }
          >
            <View style={styles.settingIconWrap}>
              <MaterialIcons name="calendar-today" size={20} color={SakuraTheme.colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Siklus Reset Anggaran</Text>
              <Text style={styles.settingSubtitle}>Setiap tanggal {profile.budgetResetDay} (Hari Gajian)</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={SakuraTheme.colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.settingClickableRow}
            onPress={() =>
              Alert.alert(
                'Batas Waspada Limit',
                'Peringatan otomatis muncul saat pengeluaran kategori mencapai 80% dari batas limit.'
              )
            }
          >
            <View style={styles.settingIconWrap}>
              <MaterialIcons name="notifications-active" size={20} color={SakuraTheme.colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Batas Waspada Pengeluaran</Text>
              <Text style={styles.settingSubtitle}>Alarm aktif di {profile.budgetAlertThreshold}% dari batas budget</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={SakuraTheme.colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.settingItemRow}>
            <View style={styles.settingIconWrap}>
              <MaterialIcons name="alarm" size={20} color={SakuraTheme.colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Pengingat Harian Catat Cepat</Text>
              <Text style={styles.settingSubtitle}>
                Notifikasi santai setiap {profile.dailyReminderTime} WIB
              </Text>
            </View>
            <Switch
              value={profile.dailyReminderEnabled}
              onValueChange={handleToggleDailyReminder}
              trackColor={{ false: '#fce7f3', true: SakuraTheme.colors.primaryLight }}
              thumbColor={profile.dailyReminderEnabled ? SakuraTheme.colors.primary : '#ffffff'}
            />
          </View>
        </SakuraCard>

        {/* 3. Edukasi Finansial 50-30-20 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Panduan & Edukasi Budgeting</Text>
        </View>

        <SakuraCard variant="subtle" style={styles.educationCard}>
          <View style={styles.educationHeader}>
            <MaterialIcons name="menu-book" size={22} color={SakuraTheme.colors.primary} />
            <Text style={styles.educationTitle}>Metode Budgeting 50-30-20</Text>
          </View>
          <Text style={styles.educationBody}>
            Bagi penghasilan bersihmu menjadi tiga pos utama:
          </Text>
          <View style={styles.ruleRow}>
            <View style={[styles.rulePill, { backgroundColor: '#ecfdf5' }]}>
              <Text style={[styles.rulePillText, { color: '#047857' }]}>50% Kebutuhan</Text>
            </View>
            <View style={[styles.rulePill, { backgroundColor: '#fce7f3' }]}>
              <Text style={[styles.rulePillText, { color: SakuraTheme.colors.primary }]}>30% Keinginan</Text>
            </View>
            <View style={[styles.rulePill, { backgroundColor: '#fef3c7' }]}>
              <Text style={[styles.rulePillText, { color: '#d97706' }]}>20% Tabungan</Text>
            </View>
          </View>
        </SakuraCard>

        {/* 4. Cadangkan Data & Info Aplikasi */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Data & Cadangan</Text>
        </View>

        <SakuraCard style={styles.settingsGroupCard}>
          <TouchableOpacity
            style={styles.settingClickableRow}
            onPress={() =>
              Alert.alert('Cadangkan Data', 'Seluruh data transaksi dan kantong telah dienkripsi (AES-256) dan dicadangkan ke cloud storage lokal.')
            }
          >
            <View style={styles.settingIconWrap}>
              <MaterialIcons name="cloud-upload" size={20} color={SakuraTheme.colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Cadangkan Data Sekarang</Text>
              <Text style={styles.settingSubtitle}>Enkripsi lokal AES-256 aman</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={SakuraTheme.colors.textMuted} />
          </TouchableOpacity>
        </SakuraCard>

        {/* App Footer */}
        <View style={styles.appFooter}>
          <Text style={styles.appFooterBrand}>Qwatur (Sakura Bloom Edition)</Text>
          <Text style={styles.appFooterVersion}>Versi 1.0.0 • React Native & Expo</Text>
          <Text style={styles.appFooterTagline}>"Keuangan tenang, masa depan lapang"</Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: SakuraTheme.colors.canvas,
  },
  scrollContent: {
    paddingHorizontal: SakuraTheme.spacing.md,
    paddingBottom: 40,
  },
  profileHeaderCard: {
    backgroundColor: SakuraTheme.colors.primaryDark,
    borderRadius: SakuraTheme.borderRadius.xl,
    padding: 20,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
    shadowColor: SakuraTheme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  avatarLargeWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: SakuraTheme.colors.cardHighlight,
    borderWidth: 3,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  avatarLargeInitial: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 22,
    fontWeight: '800',
    color: SakuraTheme.colors.primary,
  },
  crownBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: SakuraTheme.colors.primary,
    borderWidth: 2,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  profileEmail: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    color: '#ffd5dd',
    marginTop: 2,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: SakuraTheme.borderRadius.full,
    marginTop: 8,
  },
  tierText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  cloudSyncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  cloudSyncText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    color: '#ffd5dd',
  },
  sectionHeader: {
    marginTop: 10,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
  },
  settingsGroupCard: {
    padding: 6,
    marginBottom: 14,
  },
  settingItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 12,
  },
  settingClickableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 12,
  },
  settingIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: SakuraTheme.colors.cardSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTitle: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
  },
  settingSubtitle: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    color: SakuraTheme.colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: SakuraTheme.colors.borderLight,
    marginHorizontal: 10,
  },
  educationCard: {
    padding: 14,
    marginBottom: 14,
  },
  educationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  educationTitle: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
  },
  educationBody: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    color: SakuraTheme.colors.textSecondary,
    marginBottom: 10,
  },
  ruleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  rulePill: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  rulePillText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 10,
    fontWeight: '700',
  },
  appFooter: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 10,
  },
  appFooterBrand: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: SakuraTheme.colors.primary,
  },
  appFooterVersion: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    color: SakuraTheme.colors.textMuted,
    marginTop: 2,
  },
  appFooterTagline: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    fontStyle: 'italic',
    color: SakuraTheme.colors.textSecondary,
    marginTop: 4,
  },
});
