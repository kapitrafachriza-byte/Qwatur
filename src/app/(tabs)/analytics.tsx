import React, { useMemo, useState } from 'react';
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
import { SakuraTheme } from '@/constants/theme';
import { useFinanceStore } from '@/stores/financeStore';
import { CurrencyText } from '@/components/CurrencyText';
import { SakuraCard } from '@/components/SakuraCard';

type PeriodMode = 'day' | 'week' | 'month' | 'year';

export default function AnalyticsScreen() {
  const [period, setPeriod] = useState<PeriodMode>('month');

  const transactions = useFinanceStore((state) => state.transactions);
  const categories = useFinanceStore((state) => state.categories);
  const pockets = useFinanceStore((state) => state.pockets);
  const deleteTransaction = useFinanceStore((state) => state.deleteTransaction);

  // Filter transaksi berdasarkan periode
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekStart = todayStart - 6 * 86400000; // 7 hari terakhir
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const yearStart = new Date(now.getFullYear(), 0, 1).getTime();

    return transactions.filter((t) => {
      const txTime = new Date(t.date).getTime();
      if (period === 'day') {
        return txTime >= todayStart;
      }
      if (period === 'week') {
        return txTime >= weekStart;
      }
      if (period === 'month') {
        return txTime >= monthStart;
      }
      if (period === 'year') {
        return txTime >= yearStart;
      }
      return true;
    });
  }, [transactions, period]);

  // Perhitungan total pengeluaran periode ini
  const periodExpense = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  // Perhitungan total pemasukan periode ini
  const periodIncome = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  // Arus kas bersih (surplus / defisit)
  const netSavings = periodIncome - periodExpense;

  // Breakdown pengeluaran per kategori
  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    filteredTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const current = map.get(t.categoryId) || 0;
        map.set(t.categoryId, current + t.amount);
      });

    return categories
      .filter((c) => c.type === 'expense')
      .map((c) => {
        const spent = map.get(c.id) || 0;
        const percent = periodExpense > 0 ? Math.round((spent / periodExpense) * 100) : 0;
        return {
          ...c,
          spent,
          percent,
        };
      })
      .filter((c) => c.spent > 0)
      .sort((a, b) => b.spent - a.spent);
  }, [filteredTransactions, categories, periodExpense]);

  const getPocket = (pocId: string) => pockets.find((p) => p.id === pocId);
  const getCategory = (catId: string) => categories.find((c) => c.id === catId);

  // Label periode untuk UI
  const getPeriodLabel = () => {
    const now = new Date();
    if (period === 'day') {
      return `Hari Ini (${now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })})`;
    }
    if (period === 'week') {
      return '7 Hari Terakhir (Pekan Ini)';
    }
    if (period === 'month') {
      return `${now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`;
    }
    return `Tahun ${now.getFullYear()}`;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>Laporan Keuangan 🌸</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 1. Selector Tab 4 Periode: Harian, Mingguan, Bulanan, Tahunan */}
        <View style={styles.periodTabsContainer}>
          <TouchableOpacity
            style={[styles.periodTab, period === 'day' && styles.periodTabActive]}
            onPress={() => setPeriod('day')}
          >
            <Text style={[styles.periodTabText, period === 'day' && styles.periodTabTextActive]}>
              Per Hari
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.periodTab, period === 'week' && styles.periodTabActive]}
            onPress={() => setPeriod('week')}
          >
            <Text style={[styles.periodTabText, period === 'week' && styles.periodTabTextActive]}>
              Per Minggu
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.periodTab, period === 'month' && styles.periodTabActive]}
            onPress={() => setPeriod('month')}
          >
            <Text style={[styles.periodTabText, period === 'month' && styles.periodTabTextActive]}>
              Per Bulan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.periodTab, period === 'year' && styles.periodTabActive]}
            onPress={() => setPeriod('year')}
          >
            <Text style={[styles.periodTabText, period === 'year' && styles.periodTabTextActive]}>
              Per Tahun
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info Banner Periode */}
        <View style={styles.periodBanner}>
          <MaterialIcons name="date-range" size={18} color={SakuraTheme.colors.primary} />
          <Text style={styles.periodBannerText}>Periode Laporan: {getPeriodLabel()}</Text>
        </View>

        {/* 2. Kartu Ringkasan Pemasukan & Pengeluaran Periode Ini */}
        <View style={styles.summaryGrid}>
          <View style={[styles.summaryCard, { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }]}>
            <View style={styles.summaryTopRow}>
              <Text style={[styles.summaryLabel, { color: '#047857' }]}>Pemasukan</Text>
              <MaterialIcons name="arrow-downward" size={16} color="#047857" />
            </View>
            <CurrencyText amount={periodIncome} type="income" style={styles.summaryVal} />
          </View>

          <View style={[styles.summaryCard, { backgroundColor: '#fff1f2', borderColor: '#fecdd3' }]}>
            <View style={styles.summaryTopRow}>
              <Text style={[styles.summaryLabel, { color: '#be185d' }]}>Pengeluaran</Text>
              <MaterialIcons name="arrow-upward" size={16} color="#be185d" />
            </View>
            <CurrencyText amount={periodExpense} type="expense" style={styles.summaryVal} />
          </View>
        </View>

        {/* Kartu Arus Kas Bersih (Surplus / Defisit Periode) */}
        <View style={styles.netCard}>
          <Text style={styles.netLabel}>Sisa Bersih ({getPeriodLabel()})</Text>
          <CurrencyText
            amount={netSavings}
            showSign
            style={[
              styles.netVal,
              { color: netSavings >= 0 ? '#047857' : '#ba1a1a' },
            ]}
          />
          <Text style={styles.netSub}>
            {netSavings >= 0 ? 'Surplus (Pemasukan > Pengeluaran)' : 'Defisit (Pengeluaran > Pemasukan)'}
          </Text>
        </View>

        {/* 3. Rincian Pengeluaran per Kategori */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pengeluaran per Kategori</Text>
          <Text style={styles.sectionBadge}>{categoryBreakdown.length} Kategori</Text>
        </View>

        {categoryBreakdown.length === 0 ? (
          <SakuraCard style={styles.emptyCard}>
            <MaterialIcons name="pie-chart-outline" size={32} color={SakuraTheme.colors.border} />
            <Text style={styles.emptyText}>Tidak ada pengeluaran pada periode ini.</Text>
          </SakuraCard>
        ) : (
          <View style={styles.catList}>
            {categoryBreakdown.map((item) => (
              <SakuraCard key={item.id} style={styles.catCard}>
                <View style={styles.catRow}>
                  <View style={[styles.catIcon, { backgroundColor: item.color + '18' }]}>
                    <MaterialIcons name={item.icon as any} size={20} color={item.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.catTitleRow}>
                      <Text style={styles.catName}>{item.name}</Text>
                      <Text style={styles.catPercent}>{item.percent}%</Text>
                    </View>
                    <CurrencyText amount={item.spent} type="expense" style={styles.catSpent} />
                  </View>
                </View>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${item.percent}%`, backgroundColor: item.color },
                    ]}
                  />
                </View>
              </SakuraCard>
            ))}
          </View>
        )}

        {/* 4. Daftar Transaksi pada Periode Ini */}
        <View style={[styles.sectionHeader, { marginTop: 22 }]}>
          <Text style={styles.sectionTitle}>Daftar Transaksi ({filteredTransactions.length})</Text>
        </View>

        {filteredTransactions.length === 0 ? (
          <SakuraCard style={styles.emptyCard}>
            <MaterialIcons name="receipt-long" size={32} color={SakuraTheme.colors.border} />
            <Text style={styles.emptyText}>Belum ada transaksi pada periode ini.</Text>
          </SakuraCard>
        ) : (
          <View style={styles.txList}>
            {filteredTransactions.map((tx) => {
              const cat = getCategory(tx.categoryId);
              const poc = getPocket(tx.pocketId);
              const isExpense = tx.type === 'expense';

              return (
                <SakuraCard key={tx.id} style={styles.txCard}>
                  <View style={styles.txRow}>
                    <View
                      style={[
                        styles.txIcon,
                        {
                          backgroundColor: isExpense
                            ? SakuraTheme.colors.expenseBg
                            : SakuraTheme.colors.incomeBg,
                        },
                      ]}
                    >
                      <MaterialIcons
                        name={(cat?.icon as any) || (isExpense ? 'arrow-upward' : 'arrow-downward')}
                        size={18}
                        color={isExpense ? SakuraTheme.colors.expense : SakuraTheme.colors.income}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.txNote}>{tx.note}</Text>
                      <Text style={styles.txSub}>
                        {poc?.name || 'Kas'} •{' '}
                        {new Date(tx.date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
                    <View style={styles.txRightCol}>
                      <CurrencyText
                        amount={tx.amount}
                        type={isExpense ? 'expense' : 'income'}
                        showSign
                        style={styles.txVal}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert(
                            'Hapus Transaksi',
                            `Hapus ${tx.note}? Saldo kantong akan otomatis disesuaikan kembali.`,
                            [
                              { text: 'Batal', style: 'cancel' },
                              {
                                text: 'Hapus',
                                style: 'destructive',
                                onPress: () => deleteTransaction(tx.id),
                              },
                            ]
                          );
                        }}
                        style={styles.delBtn}
                      >
                        <MaterialIcons name="close" size={16} color="#ba1a1a" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </SakuraCard>
              );
            })}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: SakuraTheme.colors.canvas,
  },
  topHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: SakuraTheme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: SakuraTheme.colors.border,
  },
  headerTitle: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 18,
    fontWeight: '800',
    color: SakuraTheme.colors.textPrimary,
  },
  scrollContent: {
    padding: 16,
  },
  periodTabsContainer: {
    flexDirection: 'row',
    backgroundColor: SakuraTheme.colors.cardSubtle,
    borderRadius: SakuraTheme.borderRadius.lg,
    padding: 4,
    borderWidth: 1,
    borderColor: SakuraTheme.colors.border,
    marginBottom: 10,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: SakuraTheme.borderRadius.md,
  },
  periodTabActive: {
    backgroundColor: SakuraTheme.colors.primary,
  },
  periodTabText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '600',
    color: SakuraTheme.colors.textSecondary,
  },
  periodTabTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  periodBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: SakuraTheme.colors.cardHighlight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 14,
  },
  periodBannerText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: SakuraTheme.colors.primary,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  summaryCard: {
    flex: 1,
    padding: 14,
    borderRadius: SakuraTheme.borderRadius.lg,
    borderWidth: 1,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  summaryLabel: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
  },
  summaryVal: {
    fontSize: 16,
    fontWeight: '800',
  },
  netCard: {
    backgroundColor: SakuraTheme.colors.card,
    borderWidth: 1.5,
    borderColor: SakuraTheme.colors.border,
    borderRadius: SakuraTheme.borderRadius.lg,
    padding: 14,
    marginBottom: 20,
    alignItems: 'center',
  },
  netLabel: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '600',
    color: SakuraTheme.colors.textMuted,
    marginBottom: 2,
  },
  netVal: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 2,
  },
  netSub: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    color: SakuraTheme.colors.textSecondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
    borderRadius: 4,
  },
  catList: {
    gap: 8,
  },
  catCard: {
    padding: 12,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  catIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  catName: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
  },
  catPercent: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: SakuraTheme.colors.textSecondary,
  },
  catSpent: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: SakuraTheme.colors.cardHighlight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  txList: {
    gap: 8,
  },
  txCard: {
    padding: 12,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  txIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txNote: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
  },
  txSub: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    color: SakuraTheme.colors.textMuted,
    marginTop: 2,
  },
  txRightCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  txVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  delBtn: {
    padding: 2,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    gap: 6,
  },
  emptyText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 13,
    color: SakuraTheme.colors.textMuted,
  },
});
