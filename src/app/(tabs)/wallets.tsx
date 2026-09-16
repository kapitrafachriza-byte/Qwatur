import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SakuraTheme } from '@/constants/theme';
import { useFinanceStore } from '@/stores/financeStore';
import { HeaderBar } from '@/components/HeaderBar';
import { CurrencyText } from '@/components/CurrencyText';
import { SakuraCard } from '@/components/SakuraCard';

export default function WalletsScreen() {
  const router = useRouter();
  const { pockets, goals, updateGoalProgress } = useFinanceStore();

  const liquidBalance = pockets.reduce((sum, p) => sum + p.balance, 0);
  const totalGoalsBalance = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalNetWorth = liquidBalance + totalGoalsBalance;

  const handleDepositGoal = (goalId: string, title: string) => {
    Alert.alert(
      'Nabung ke ' + title,
      'Pilih nominal setoran untuk pos impian ini:',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: '+ Rp 250.000',
          onPress: () => {
            updateGoalProgress(goalId, 250000);
            Alert.alert('Berhasil 🌸', 'Saldo tabungan impian berhasil ditambahkan!');
          },
        },
        {
          text: '+ Rp 500.000',
          onPress: () => {
            updateGoalProgress(goalId, 500000);
            Alert.alert('Berhasil 🌸', 'Saldo tabungan impian berhasil ditambahkan!');
          },
        },
        {
          text: '+ Rp 1.000.000',
          onPress: () => {
            updateGoalProgress(goalId, 1000000);
            Alert.alert('Berhasil 🌸', 'Saldo tabungan impian berhasil ditambahkan!');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <HeaderBar title="Kantong & Impian 🌸" subtitle="Kelola rekening dan pos tabungan" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Net Worth Master Card */}
        <View style={styles.netWorthCard}>
          <View style={styles.netWorthHeader}>
            <Text style={styles.netWorthLabel}>Total Kekayaan Bersih (Net Worth)</Text>
            <View style={styles.healthChip}>
              <MaterialIcons name="verified" size={14} color="#047857" />
              <Text style={styles.healthText}>Finansial Sehat</Text>
            </View>
          </View>

          <CurrencyText
            amount={totalNetWorth}
            style={styles.netWorthAmount}
            prefixStyle={styles.netWorthPrefix}
          />

          <View style={styles.divider} />

          <View style={styles.netWorthBreakdown}>
            <View style={styles.breakdownCol}>
              <Text style={styles.breakdownTitle}>Dana Likuid (Dompet/Bank)</Text>
              <CurrencyText amount={liquidBalance} style={styles.breakdownVal} />
            </View>
            <View style={styles.verticalBorder} />
            <View style={styles.breakdownCol}>
              <Text style={styles.breakdownTitle}>Aset Tabungan Impian</Text>
              <CurrencyText amount={totalGoalsBalance} style={styles.breakdownVal} />
            </View>
          </View>
        </View>

        {/* Quick Actions Row */}
        <View style={styles.quickActionRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push('/add-transaction')}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: SakuraTheme.colors.cardHighlight }]}>
              <MaterialIcons name="swap-horiz" size={20} color={SakuraTheme.colors.primary} />
            </View>
            <Text style={styles.actionBtnLabel}>Transfer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() =>
              Alert.alert('Top Up Kantong', 'Pilih bank/e-wallet untuk instruksi top-up instan.')
            }
          >
            <View style={[styles.actionIconWrap, { backgroundColor: '#ecfdf5' }]}>
              <MaterialIcons name="add-card" size={20} color="#047857" />
            </View>
            <Text style={styles.actionBtnLabel}>Top Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() =>
              Alert.alert('Sesuaikan Saldo Fisik', 'Sesuaikan nominal kas tunai di dompet fisikmu.')
            }
          >
            <View style={[styles.actionIconWrap, { backgroundColor: '#fdf2f4' }]}>
              <MaterialIcons name="tune" size={20} color={SakuraTheme.colors.expense} />
            </View>
            <Text style={styles.actionBtnLabel}>Sesuaikan</Text>
          </TouchableOpacity>
        </View>

        {/* Rekening & E-Wallet Aktif */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="account-balance" size={20} color={SakuraTheme.colors.primary} />
            <Text style={styles.sectionTitle}>Rekening & E-Wallet Aktif</Text>
          </View>
          <Text style={styles.countBadge}>{pockets.length} Kantong</Text>
        </View>

        <View style={styles.pocketsList}>
          {pockets.map((poc) => (
            <SakuraCard key={poc.id} style={styles.pocketCard}>
              <View style={styles.pocketRow}>
                <View style={[styles.pocketIconWrap, { backgroundColor: poc.color + '15' }]}>
                  <MaterialIcons name={poc.icon as any} size={24} color={poc.color} />
                </View>
                <View style={styles.pocketInfo}>
                  <Text style={styles.pocketName}>{poc.name}</Text>
                  <Text style={styles.pocketAcc}>{poc.accountNumber}</Text>
                </View>
                <View style={styles.pocketBalCol}>
                  <CurrencyText amount={poc.balance} style={styles.pocketBalText} />
                  <Text style={styles.pocketTypeBadge}>
                    {poc.type === 'bank' ? 'Bank' : poc.type === 'ewallet' ? 'E-Wallet' : 'Tunai'}
                  </Text>
                </View>
              </View>
            </SakuraCard>
          ))}
        </View>

        {/* Pos Tabungan & Impian (Goal Saving Pockets) */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="stars" size={20} color={SakuraTheme.colors.primary} />
            <Text style={styles.sectionTitle}>Pos Tabungan & Impian</Text>
          </View>
          <Text style={styles.countBadge}>{goals.length} Target</Text>
        </View>

        <View style={styles.goalsList}>
          {goals.map((goal) => {
            const percent = Math.min(
              Math.round((goal.currentAmount / goal.targetAmount) * 100),
              100
            );
            const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

            return (
              <SakuraCard key={goal.id} style={styles.goalCard}>
                <View style={styles.goalTopRow}>
                  <View style={styles.goalIconWrap}>
                    <MaterialIcons name={goal.icon as any} size={22} color={SakuraTheme.colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <Text style={styles.goalCategory}>
                      {goal.category} • Target: {goal.deadline}
                    </Text>
                  </View>
                  <View style={styles.goalPercentBadge}>
                    <Text style={styles.goalPercentText}>{percent}%</Text>
                  </View>
                </View>

                {/* Progress bar */}
                <View style={styles.goalProgressTrack}>
                  <View style={[styles.goalProgressFill, { width: `${percent}%` }]} />
                </View>

                <View style={styles.goalBottomRow}>
                  <View>
                    <Text style={styles.goalAmountLabel}>Terkumpul</Text>
                    <CurrencyText amount={goal.currentAmount} style={styles.goalCurrentAmount} />
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.goalAmountLabel}>Sisa Target</Text>
                    <Text style={styles.goalRemainingText}>
                      Rp {remaining.toLocaleString('id-ID')}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.depositGoalBtn}
                  onPress={() => handleDepositGoal(goal.id, goal.title)}
                >
                  <MaterialIcons name="add" size={16} color={SakuraTheme.colors.primary} />
                  <Text style={styles.depositGoalText}>+ Nabung ke Pos Ini</Text>
                </TouchableOpacity>
              </SakuraCard>
            );
          })}
        </View>

        {/* Tips Alokasi Otomatis Card */}
        <SakuraCard variant="subtle" style={styles.tipCard}>
          <View style={styles.tipRow}>
            <MaterialIcons name="lightbulb" size={24} color={SakuraTheme.colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.tipTitle}>Rekomendasi Alokasi Otomatis</Text>
              <Text style={styles.tipBody}>
                Berdasarkan sisa surplus bulan ini, kamu bisa menyisihkan{' '}
                <Text style={{ fontWeight: '700' }}>Rp 1.500.000</Text> ke Dana Darurat agar target
                tercapai 2 bulan lebih cepat!
              </Text>
            </View>
          </View>
        </SakuraCard>

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
  netWorthCard: {
    backgroundColor: SakuraTheme.colors.primaryDark,
    borderRadius: SakuraTheme.borderRadius.xl,
    padding: SakuraTheme.spacing.lg,
    marginTop: 4,
    marginBottom: 16,
    shadowColor: SakuraTheme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  netWorthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  netWorthLabel: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '500',
    color: '#ffd5dd',
  },
  healthChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: SakuraTheme.borderRadius.full,
  },
  healthText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  netWorthAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
  netWorthPrefix: {
    color: '#ffd5dd',
    fontSize: 18,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginVertical: 14,
  },
  netWorthBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownCol: {
    flex: 1,
  },
  breakdownTitle: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    color: '#ffd5dd',
    marginBottom: 4,
  },
  breakdownVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  verticalBorder: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: 12,
  },
  quickActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: SakuraTheme.colors.card,
    borderRadius: SakuraTheme.borderRadius.lg,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: SakuraTheme.colors.border,
    shadowColor: SakuraTheme.colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  actionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionBtnLabel: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 6,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 15,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
  },
  countBadge: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '600',
    color: SakuraTheme.colors.primary,
    backgroundColor: SakuraTheme.colors.cardHighlight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pocketsList: {
    gap: 10,
    marginBottom: 20,
  },
  pocketCard: {
    padding: 14,
  },
  pocketRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pocketIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pocketInfo: {
    flex: 1,
  },
  pocketName: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
  },
  pocketAcc: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    color: SakuraTheme.colors.textMuted,
    marginTop: 2,
  },
  pocketBalCol: {
    alignItems: 'flex-end',
  },
  pocketBalText: {
    fontSize: 14,
    fontWeight: '700',
  },
  pocketTypeBadge: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 10,
    color: SakuraTheme.colors.textSecondary,
    backgroundColor: SakuraTheme.colors.cardSubtle,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  goalsList: {
    gap: 12,
    marginBottom: 20,
  },
  goalCard: {
    padding: 14,
  },
  goalTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  goalIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: SakuraTheme.colors.cardHighlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalTitle: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
  },
  goalCategory: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    color: SakuraTheme.colors.textMuted,
    marginTop: 2,
  },
  goalPercentBadge: {
    backgroundColor: SakuraTheme.colors.cardHighlight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  goalPercentText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '800',
    color: SakuraTheme.colors.primary,
  },
  goalProgressTrack: {
    width: '100%',
    height: 8,
    backgroundColor: SakuraTheme.colors.cardHighlight,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: SakuraTheme.colors.primary,
    borderRadius: 4,
  },
  goalBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  goalAmountLabel: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 10,
    color: SakuraTheme.colors.textMuted,
  },
  goalCurrentAmount: {
    fontSize: 13,
    fontWeight: '700',
  },
  goalRemainingText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '600',
    color: SakuraTheme.colors.textSecondary,
  },
  depositGoalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: SakuraTheme.colors.cardSubtle,
    borderWidth: 1,
    borderColor: SakuraTheme.colors.border,
    paddingVertical: 8,
    borderRadius: SakuraTheme.borderRadius.md,
  },
  depositGoalText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: SakuraTheme.colors.primary,
  },
  tipCard: {
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: SakuraTheme.colors.primary,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipTitle: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
    marginBottom: 4,
  },
  tipBody: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    lineHeight: 18,
    color: SakuraTheme.colors.textSecondary,
  },
});
