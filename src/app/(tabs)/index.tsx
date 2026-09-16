import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SakuraTheme } from '@/constants/theme';
import { useFinanceStore } from '@/stores/financeStore';
import { HeaderBar } from '@/components/HeaderBar';
import { CurrencyText } from '@/components/CurrencyText';
import { SakuraCard } from '@/components/SakuraCard';
import { BudgetProgressBar } from '@/components/BudgetProgressBar';

export default function HomeScreen() {
  const router = useRouter();
  const {
    getTotalBalance,
    getTotalIncomeThisMonth,
    getTotalExpenseThisMonth,
    getNetCashflow,
    quickLogs,
    executeQuickLog,
    transactions,
    categories,
    pockets,
    deleteTransaction,
  } = useFinanceStore();

  const [activeQuickLogId, setActiveQuickLogId] = useState<string | null>(null);

  const totalBalance = getTotalBalance();
  const totalIncome = getTotalIncomeThisMonth();
  const totalExpense = getTotalExpenseThisMonth();
  const netCashflow = getNetCashflow();

  // 7-day spending dummy trend calculation
  const weeklyDays = [
    { day: 'Sen', amount: 120000, heightRatio: 0.35 },
    { day: 'Sel', amount: 85000, heightRatio: 0.25 },
    { day: 'Rab', amount: 250000, heightRatio: 0.65 },
    { day: 'Kam', amount: 95000, heightRatio: 0.28 },
    { day: 'Jum', amount: 180000, heightRatio: 0.5 },
    { day: 'Sab', amount: 350000, heightRatio: 1.0, isPeak: true },
    { day: 'Min', amount: 140000, heightRatio: 0.4 },
  ];

  const handleQuickLog = (item: (typeof quickLogs)[0]) => {
    setActiveQuickLogId(item.id);
    executeQuickLog(item.id);
    setTimeout(() => setActiveQuickLogId(null), 800);
    Alert.alert(
      'Transaksi Tercatat! 🌸',
      `${item.title} sebesar Rp ${item.amount.toLocaleString('id-ID')} berhasil dicatat via 1-Tap Quick-Log.`,
      [{ text: 'OK' }]
    );
  };

  const getCategory = (catId: string) => categories.find((c) => c.id === catId);
  const getPocket = (pocId: string) => pockets.find((p) => p.id === pocId);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <HeaderBar />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Master Balance & Net Cashflow Card */}
        <View style={styles.masterCard}>
          <View style={styles.masterTopRow}>
            <View>
              <Text style={styles.masterLabel}>Total Saldo Tersedia</Text>
              <CurrencyText
                amount={totalBalance}
                style={styles.masterBalanceText}
                prefixStyle={styles.masterPrefix}
              />
            </View>
            <View style={styles.growthBadge}>
              <MaterialIcons name="trending-up" size={16} color="#047857" />
              <Text style={styles.growthText}>+14.2%</Text>
            </View>
          </View>

          <View style={styles.dividerLight} />

          <View style={styles.cashflowRow}>
            <View style={styles.cashflowItem}>
              <View style={[styles.cashflowIconWrap, { backgroundColor: '#ecfdf5' }]}>
                <MaterialIcons name="arrow-downward" size={16} color="#047857" />
              </View>
              <View>
                <Text style={styles.cashflowLabel}>Pemasukan (Bln)</Text>
                <CurrencyText
                  amount={totalIncome}
                  type="income"
                  style={styles.cashflowAmount}
                />
              </View>
            </View>

            <View style={styles.verticalDivider} />

            <View style={styles.cashflowItem}>
              <View style={[styles.cashflowIconWrap, { backgroundColor: '#fff1f2' }]}>
                <MaterialIcons name="arrow-upward" size={16} color="#be185d" />
              </View>
              <View>
                <Text style={styles.cashflowLabel}>Pengeluaran (Bln)</Text>
                <CurrencyText
                  amount={totalExpense}
                  type="expense"
                  style={styles.cashflowAmount}
                />
              </View>
            </View>
          </View>
        </View>

        {/* 2. 1-Tap Quick-Log Shortcuts */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="touch-app" size={20} color={SakuraTheme.colors.primary} />
            <Text style={styles.sectionTitle}>Pintasan Catat Cepat (1-Tap)</Text>
          </View>
          <Text style={styles.sectionBadge}>Instan</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickLogScroll}
        >
          {quickLogs.map((item) => {
            const isActive = activeQuickLogId === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.quickLogCard,
                  isActive && styles.quickLogCardActive,
                ]}
                activeOpacity={0.7}
                onPress={() => handleQuickLog(item)}
              >
                <View style={styles.quickLogIconContainer}>
                  <MaterialIcons
                    name={item.icon as any}
                    size={22}
                    color={SakuraTheme.colors.primary}
                  />
                </View>
                <Text style={styles.quickLogTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <CurrencyText
                  amount={item.amount}
                  style={styles.quickLogAmount}
                  prefixStyle={styles.quickLogPrefix}
                />
                <View style={styles.quickLogAddBtn}>
                  <Text style={styles.quickLogAddText}>+ 1-Tap</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 3. 7-Day Spending Trend (Grafik Mingguan) */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="bar-chart" size={20} color={SakuraTheme.colors.primary} />
            <Text style={styles.sectionTitle}>Tren Pengeluaran 7 Hari</Text>
          </View>
          <View style={styles.peakBadge}>
            <Text style={styles.peakText}>Puncak: Sabtu</Text>
          </View>
        </View>

        <SakuraCard style={styles.chartCard}>
          <View style={styles.chartBarsContainer}>
            {weeklyDays.map((bar, index) => (
              <View key={index} style={styles.barCol}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${bar.heightRatio * 100}%`,
                        backgroundColor: bar.isPeak
                          ? SakuraTheme.colors.primary
                          : SakuraTheme.colors.primaryLight,
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.barDayText,
                    bar.isPeak && { color: SakuraTheme.colors.primary, fontWeight: '700' },
                  ]}
                >
                  {bar.day}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.chartFooter}>
            <Text style={styles.chartFooterText}>
              Rata-rata belanja harian kamu: <Text style={{ fontWeight: '700' }}>Rp 177.000</Text>
            </Text>
          </View>
        </SakuraCard>

        {/* 4. Top Category Breakdown */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="pie-chart-outline" size={20} color={SakuraTheme.colors.primary} />
            <Text style={styles.sectionTitle}>Alokasi Pos Anggaran</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/analytics')}>
            <Text style={styles.seeAllText}>Detail ➔</Text>
          </TouchableOpacity>
        </View>

        <SakuraCard style={styles.categoryCard}>
          {categories
            .filter((c) => c.type === 'expense')
            .slice(0, 3)
            .map((cat, idx) => (
              <View key={cat.id} style={[styles.categoryRow, idx > 0 && styles.categoryRowBorder]}>
                <View style={styles.categoryInfoRow}>
                  <View style={[styles.categoryIconWrap, { backgroundColor: cat.color + '18' }]}>
                    <MaterialIcons name={cat.icon as any} size={20} color={cat.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.categoryName}>{cat.name}</Text>
                    <View style={styles.categoryAmounts}>
                      <CurrencyText amount={cat.currentSpent} style={styles.categorySpentText} />
                      <Text style={styles.categoryLimitText}>
                        {' / '}Rp {cat.budgetLimit.toLocaleString('id-ID')}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 8 }}>
                  <BudgetProgressBar spent={cat.currentSpent} limit={cat.budgetLimit} height={6} />
                </View>
              </View>
            ))}
        </SakuraCard>

        {/* 5. Riwayat Transaksi Hari Ini */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="history" size={20} color={SakuraTheme.colors.primary} />
            <Text style={styles.sectionTitle}>Riwayat Transaksi Terbaru</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/add-transaction')}>
            <Text style={styles.seeAllText}>+ Catat Baru</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.txListContainer}>
          {transactions.slice(0, 5).map((tx) => {
            const cat = getCategory(tx.categoryId);
            const pocket = getPocket(tx.pocketId);
            const isExpense = tx.type === 'expense';

            return (
              <SakuraCard key={tx.id} style={styles.txItemCard}>
                <View style={styles.txItemRow}>
                  <View
                    style={[
                      styles.txIconWrap,
                      {
                        backgroundColor: isExpense
                          ? SakuraTheme.colors.expenseBg
                          : SakuraTheme.colors.incomeBg,
                      },
                    ]}
                  >
                    <MaterialIcons
                      name={(cat?.icon as any) || (isExpense ? 'arrow-upward' : 'arrow-downward')}
                      size={20}
                      color={isExpense ? SakuraTheme.colors.expense : SakuraTheme.colors.income}
                    />
                  </View>

                  <View style={styles.txDetails}>
                    <Text style={styles.txTitle} numberOfLines={1}>
                      {tx.note || cat?.name || 'Transaksi'}
                    </Text>
                    <View style={styles.txMetaRow}>
                      <Text style={styles.txPocketBadge}>{pocket?.name || 'Kas'}</Text>
                      <Text style={styles.txDot}>•</Text>
                      <Text style={styles.txDate}>
                        {new Date(tx.date).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.txAmountCol}>
                    <CurrencyText
                      amount={tx.amount}
                      type={isExpense ? 'expense' : 'income'}
                      showSign
                      style={styles.txAmountText}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert('Hapus Transaksi', 'Apakah kamu yakin ingin menghapus transaksi ini?', [
                          { text: 'Batal', style: 'cancel' },
                          { text: 'Hapus', style: 'destructive', onPress: () => deleteTransaction(tx.id) },
                        ]);
                      }}
                      style={styles.txDeleteBtn}
                    >
                      <MaterialIcons name="delete-outline" size={16} color={SakuraTheme.colors.textMuted} />
                    </TouchableOpacity>
                  </View>
                </View>
              </SakuraCard>
            );
          })}
        </View>

        <View style={{ height: 24 }} />
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
  masterCard: {
    backgroundColor: SakuraTheme.colors.primaryDark,
    borderRadius: SakuraTheme.borderRadius.xl,
    padding: SakuraTheme.spacing.lg,
    marginTop: 4,
    marginBottom: SakuraTheme.spacing.md,
    shadowColor: SakuraTheme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  masterTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  masterLabel: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '500',
    color: '#ffd5dd',
    marginBottom: 4,
  },
  masterBalanceText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 26,
    fontWeight: '700',
    color: '#ffffff',
  },
  masterPrefix: {
    color: '#ffd5dd',
    fontSize: 16,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: SakuraTheme.borderRadius.full,
    gap: 4,
  },
  growthText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
  },
  dividerLight: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginVertical: 16,
  },
  cashflowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cashflowItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cashflowIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cashflowLabel: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    color: '#ffd5dd',
    fontWeight: '500',
  },
  cashflowAmount: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  verticalDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
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
  sectionBadge: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '600',
    color: SakuraTheme.colors.primary,
    backgroundColor: SakuraTheme.colors.cardHighlight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  peakBadge: {
    backgroundColor: SakuraTheme.colors.expenseBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  peakText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '600',
    color: SakuraTheme.colors.expense,
  },
  seeAllText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '600',
    color: SakuraTheme.colors.primary,
  },
  quickLogScroll: {
    gap: 12,
    paddingVertical: 4,
  },
  quickLogCard: {
    width: 124,
    backgroundColor: SakuraTheme.colors.card,
    borderWidth: 1,
    borderColor: SakuraTheme.colors.border,
    borderRadius: SakuraTheme.borderRadius.lg,
    padding: 12,
    alignItems: 'center',
    shadowColor: SakuraTheme.colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  quickLogCardActive: {
    borderColor: SakuraTheme.colors.primary,
    backgroundColor: SakuraTheme.colors.cardHighlight,
    transform: [{ scale: 0.98 }],
  },
  quickLogIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: SakuraTheme.colors.cardSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickLogTitle: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '600',
    color: SakuraTheme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  quickLogAmount: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: SakuraTheme.colors.expense,
    marginBottom: 8,
  },
  quickLogPrefix: {
    fontSize: 10,
  },
  quickLogAddBtn: {
    backgroundColor: SakuraTheme.colors.cardSubtle,
    borderWidth: 1,
    borderColor: SakuraTheme.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: SakuraTheme.borderRadius.full,
  },
  quickLogAddText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 10,
    fontWeight: '700',
    color: SakuraTheme.colors.primary,
  },
  chartCard: {
    paddingVertical: 14,
  },
  chartBarsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 110,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  barCol: {
    alignItems: 'center',
    width: 32,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    width: 14,
    height: 86,
    backgroundColor: SakuraTheme.colors.cardHighlight,
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 7,
  },
  barDayText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '500',
    color: SakuraTheme.colors.textSecondary,
    marginTop: 6,
  },
  chartFooter: {
    borderTopWidth: 1,
    borderTopColor: SakuraTheme.colors.borderLight,
    paddingTop: 8,
    marginTop: 4,
    alignItems: 'center',
  },
  chartFooterText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    color: SakuraTheme.colors.textSecondary,
  },
  categoryCard: {
    padding: 14,
  },
  categoryRow: {
    paddingVertical: 6,
  },
  categoryRowBorder: {
    borderTopWidth: 1,
    borderTopColor: SakuraTheme.colors.borderLight,
    marginTop: 6,
    paddingTop: 10,
  },
  categoryInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '600',
    color: SakuraTheme.colors.textPrimary,
  },
  categoryAmounts: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  categorySpentText: {
    fontSize: 12,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
  },
  categoryLimitText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    color: SakuraTheme.colors.textMuted,
  },
  txListContainer: {
    gap: 10,
  },
  txItemCard: {
    padding: 12,
  },
  txItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  txIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txDetails: {
    flex: 1,
  },
  txTitle: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '600',
    color: SakuraTheme.colors.textPrimary,
  },
  txMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  txPocketBadge: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '500',
    color: SakuraTheme.colors.textMuted,
  },
  txDot: {
    color: SakuraTheme.colors.border,
    fontSize: 10,
  },
  txDate: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    color: SakuraTheme.colors.textSecondary,
  },
  txAmountCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  txAmountText: {
    fontSize: 14,
    fontWeight: '700',
  },
  txDeleteBtn: {
    padding: 2,
  },
});
