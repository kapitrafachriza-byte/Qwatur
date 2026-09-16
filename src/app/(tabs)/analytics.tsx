import React, { useMemo } from 'react';
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

export default function AnalyticsScreen() {
  const transactions = useFinanceStore((state) => state.transactions);
  const categories = useFinanceStore((state) => state.categories);
  const pockets = useFinanceStore((state) => state.pockets);
  const deleteTransaction = useFinanceStore((state) => state.deleteTransaction);

  const totalExpense = useMemo(
    () =>
      transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  // Group expenses by category
  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const current = map.get(t.categoryId) || 0;
        map.set(t.categoryId, current + t.amount);
      });

    return categories
      .filter((c) => c.type === 'expense')
      .map((c) => {
        const spent = map.get(c.id) || 0;
        const percent = totalExpense > 0 ? Math.round((spent / totalExpense) * 100) : 0;
        return {
          ...c,
          spent,
          percent,
        };
      })
      .filter((c) => c.spent > 0)
      .sort((a, b) => b.spent - a.spent);
  }, [transactions, categories, totalExpense]);

  const getPocket = (pocId: string) => pockets.find((p) => p.id === pocId);
  const getCategory = (catId: string) => categories.find((c) => c.id === catId);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>Laporan Keuangan 🌸</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Ringkasan Pemasukan & Pengeluaran */}
        <View style={styles.summaryGrid}>
          <View style={[styles.summaryCard, { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }]}>
            <Text style={[styles.summaryLabel, { color: '#047857' }]}>Total Pemasukan</Text>
            <CurrencyText amount={totalIncome} type="income" style={styles.summaryVal} />
          </View>

          <View style={[styles.summaryCard, { backgroundColor: '#fff1f2', borderColor: '#fecdd3' }]}>
            <Text style={[styles.summaryLabel, { color: '#be185d' }]}>Total Pengeluaran</Text>
            <CurrencyText amount={totalExpense} type="expense" style={styles.summaryVal} />
          </View>
        </View>

        {/* Pengeluaran per Kategori */}
        <Text style={styles.sectionTitle}>Pengeluaran per Kategori</Text>

        {categoryBreakdown.length === 0 ? (
          <SakuraCard style={styles.emptyCard}>
            <Text style={styles.emptyText}>Belum ada pengeluaran yang dicatat.</Text>
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

        {/* Semua Riwayat Transaksi */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          Semua Catatan ({transactions.length})
        </Text>

        <View style={styles.txList}>
          {transactions.map((tx) => {
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
                          `Hapus ${tx.note}? Saldo kantong akan otomatis dikembalikan.`,
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
                      <MaterialIcons name="delete-outline" size={16} color="#ba1a1a" />
                    </TouchableOpacity>
                  </View>
                </View>
              </SakuraCard>
            );
          })}
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
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    padding: 14,
    borderRadius: SakuraTheme.borderRadius.lg,
    borderWidth: 1,
  },
  summaryLabel: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryVal: {
    fontSize: 16,
    fontWeight: '800',
  },
  sectionTitle: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 15,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
    marginBottom: 10,
  },
  catList: {
    gap: 10,
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
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 13,
    color: SakuraTheme.colors.textMuted,
  },
});
