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
import { SakuraTheme } from '@/constants/theme';
import { useFinanceStore } from '@/stores/financeStore';
import { HeaderBar } from '@/components/HeaderBar';
import { CurrencyText } from '@/components/CurrencyText';
import { SakuraCard } from '@/components/SakuraCard';
import { BudgetProgressBar } from '@/components/BudgetProgressBar';

type PeriodType = 'week' | 'month' | 'year';

export default function AnalyticsScreen() {
  const [period, setPeriod] = useState<PeriodType>('month');
  const { categories, transactions, getTotalExpenseThisMonth, getTotalIncomeThisMonth } =
    useFinanceStore();

  const totalExpense = getTotalExpenseThisMonth();
  const totalIncome = getTotalIncomeThisMonth();
  const savingsRate =
    totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 0;

  const handleExport = (format: 'PDF' | 'CSV') => {
    Alert.alert(
      `Ekspor Laporan ${format} Berhasil 🌸`,
      `Rekapitulasi keuangan periode ${
        period === 'week' ? 'Pekan Ini' : period === 'month' ? 'Bulan Ini' : 'Tahun Ini'
      } telah siap diunduh.`,
      [{ text: 'Buka File' }, { text: 'Tutup', style: 'cancel' }]
    );
  };

  const trendBars = [
    { label: 'Tgl 1-5', amount: 850000, ratio: 0.4 },
    { label: 'Tgl 6-10', amount: 1450000, ratio: 0.68 },
    { label: 'Tgl 11-15', amount: 2100000, ratio: 1.0, isPeak: true },
    { label: 'Tgl 16-20', amount: 950000, ratio: 0.45 },
    { label: 'Tgl 21-25', amount: 1200000, ratio: 0.55 },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <HeaderBar title="Analisis & Laporan 🌸" subtitle="Pola pengeluaran & kesehatan finansial" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Period Selector Tabs */}
        <View style={styles.periodTabs}>
          <TouchableOpacity
            style={[styles.periodTab, period === 'week' && styles.periodTabActive]}
            onPress={() => setPeriod('week')}
          >
            <Text style={[styles.periodTabText, period === 'week' && styles.periodTabTextActive]}>
              Pekan Ini
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.periodTab, period === 'month' && styles.periodTabActive]}
            onPress={() => setPeriod('month')}
          >
            <Text style={[styles.periodTabText, period === 'month' && styles.periodTabTextActive]}>
              Bulan Ini
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.periodTab, period === 'year' && styles.periodTabActive]}
            onPress={() => setPeriod('year')}
          >
            <Text style={[styles.periodTabText, period === 'year' && styles.periodTabTextActive]}>
              Tahun Ini
            </Text>
          </TouchableOpacity>
        </View>

        {/* Financial Health Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryLabel}>Rasio Tabungan Bulan Berjalan</Text>
            <View style={styles.rateBadge}>
              <Text style={styles.rateText}>{savingsRate}% Tersimpan</Text>
            </View>
          </View>

          <View style={styles.statGrid}>
            <View style={styles.statCol}>
              <Text style={styles.statSub}>Total Pengeluaran</Text>
              <CurrencyText amount={totalExpense} style={styles.statVal} />
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statSub}>Total Pemasukan</Text>
              <CurrencyText amount={totalIncome} style={styles.statVal} />
            </View>
          </View>
        </View>

        {/* Peak Alert Banner */}
        <SakuraCard variant="subtle" style={styles.peakAlertCard}>
          <View style={styles.peakAlertRow}>
            <View style={styles.alertIconWrap}>
              <MaterialIcons name="warning-amber" size={22} color={SakuraTheme.colors.warning} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.alertTitle}>Puncak Pengeluaran Terdeteksi!</Text>
              <Text style={styles.alertBody}>
                Pengeluaran tertinggi berada di rentang <Text style={{ fontWeight: '700' }}>Tgl 11-15</Text> (Rp 2.100.000), terutama pada pos Makanan & Tagihan.
              </Text>
            </View>
          </View>
        </SakuraCard>

        {/* Bagan Tren Pengeluaran */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="insights" size={20} color={SakuraTheme.colors.primary} />
            <Text style={styles.sectionTitle}>Bagan Tren Pengeluaran</Text>
          </View>
          <Text style={styles.metricBadge}>Dalam Periode</Text>
        </View>

        <SakuraCard style={styles.chartCard}>
          <View style={styles.barsContainer}>
            {trendBars.map((b, idx) => (
              <View key={idx} style={styles.barItem}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${b.ratio * 100}%`,
                        backgroundColor: b.isPeak
                          ? SakuraTheme.colors.primary
                          : SakuraTheme.colors.primaryLight,
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.barLabel,
                    b.isPeak && { color: SakuraTheme.colors.primary, fontWeight: '700' },
                  ]}
                >
                  {b.label}
                </Text>
              </View>
            ))}
          </View>
        </SakuraCard>

        {/* Alokasi & Manajemen Batas Anggaran */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="pie-chart" size={20} color={SakuraTheme.colors.primary} />
            <Text style={styles.sectionTitle}>Batas & Alokasi Anggaran</Text>
          </View>
          <Text style={styles.metricBadge}>Warning Limit 80%</Text>
        </View>

        <View style={styles.categoryAllocationList}>
          {categories
            .filter((c) => c.type === 'expense')
            .map((cat) => {
              const ratio = cat.budgetLimit > 0 ? cat.currentSpent / cat.budgetLimit : 0;
              const isOver = ratio >= 0.85;

              return (
                <SakuraCard key={cat.id} style={styles.catAllocCard}>
                  <View style={styles.catAllocTop}>
                    <View style={[styles.catIconWrap, { backgroundColor: cat.color + '18' }]}>
                      <MaterialIcons name={cat.icon as any} size={20} color={cat.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.catName}>{cat.name}</Text>
                      <View style={styles.catSpendRow}>
                        <CurrencyText amount={cat.currentSpent} style={styles.catSpentText} />
                        <Text style={styles.catLimitText}>
                          {' dari '}Rp {cat.budgetLimit.toLocaleString('id-ID')}
                        </Text>
                      </View>
                    </View>
                    {isOver && (
                      <View style={styles.warningPill}>
                        <Text style={styles.warningPillText}>Waspada!</Text>
                      </View>
                    )}
                  </View>

                  <View style={{ marginTop: 10 }}>
                    <BudgetProgressBar spent={cat.currentSpent} limit={cat.budgetLimit} showLabels height={8} />
                  </View>
                </SakuraCard>
              );
            })}
        </View>

        {/* Saran Cerdas qwatur (AI Financial Advisor) */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="auto-awesome" size={20} color={SakuraTheme.colors.primary} />
            <Text style={styles.sectionTitle}>Saran Cerdas qwatur (AI Advisor)</Text>
          </View>
        </View>

        <SakuraCard style={styles.advisorCard}>
          <View style={styles.advisorHeader}>
            <MaterialIcons name="psychology" size={24} color={SakuraTheme.colors.primary} />
            <Text style={styles.advisorTitle}>Evaluasi Kebiasaan Kopi & Nongkrong</Text>
          </View>
          <Text style={styles.advisorBody}>
            Bulan ini kamu sudah 12 kali membeli kopi susu kekinian dengan total{' '}
            <Text style={{ fontWeight: '700' }}>Rp 420.000</Text>. Jika dikurangi menjadi 2 kali per pekan, kamu bisa mengalihkan{' '}
            <Text style={{ fontWeight: '700', color: SakuraTheme.colors.income }}>Rp 200.000/bulan</Text> ke tabungan impian Liburan Jepang!
          </Text>
          <TouchableOpacity
            style={styles.mitigateBtn}
            onPress={() =>
              Alert.alert('Target Hemat Diaktifkan! 🌸', 'Target penghematan kopi Rp 200.000/bulan telah dipasang di pos Tabungan Jepang.')
            }
          >
            <MaterialIcons name="check" size={16} color="#ffffff" />
            <Text style={styles.mitigateBtnText}>Pasang Target Hemat Rp 200.000</Text>
          </TouchableOpacity>
        </SakuraCard>

        {/* Ekspor Laporan Keuangan */}
        <SakuraCard style={styles.exportCard}>
          <View style={styles.exportRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.exportTitle}>Unduh Rekap Laporan Keuangan</Text>
              <Text style={styles.exportSubtitle}>Format standar audit untuk pencatatan mandiri</Text>
            </View>
          </View>
          <View style={styles.exportBtnGroup}>
            <TouchableOpacity style={styles.exportBtn} onPress={() => handleExport('PDF')}>
              <MaterialIcons name="picture-as-pdf" size={18} color={SakuraTheme.colors.primary} />
              <Text style={styles.exportBtnText}>Unduh PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportBtn} onPress={() => handleExport('CSV')}>
              <MaterialIcons name="table-view" size={18} color={SakuraTheme.colors.primary} />
              <Text style={styles.exportBtnText}>Unduh CSV</Text>
            </TouchableOpacity>
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
  periodTabs: {
    flexDirection: 'row',
    backgroundColor: SakuraTheme.colors.cardSubtle,
    borderRadius: SakuraTheme.borderRadius.lg,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: SakuraTheme.colors.border,
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
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: SakuraTheme.colors.primaryDark,
    borderRadius: SakuraTheme.borderRadius.xl,
    padding: 16,
    marginBottom: 14,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    color: '#ffd5dd',
  },
  rateBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: SakuraTheme.borderRadius.full,
  },
  rateText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  statGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCol: {
    flex: 1,
  },
  statSub: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    color: '#ffd5dd',
    marginBottom: 2,
  },
  statVal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  peakAlertCard: {
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: SakuraTheme.colors.warning,
  },
  peakAlertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  alertIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: SakuraTheme.colors.warningBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertTitle: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
  },
  alertBody: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    color: SakuraTheme.colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
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
  metricBadge: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    color: SakuraTheme.colors.textMuted,
    backgroundColor: SakuraTheme.colors.cardHighlight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  chartCard: {
    paddingVertical: 16,
    marginBottom: 20,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingHorizontal: 10,
  },
  barItem: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    width: 18,
    height: 90,
    backgroundColor: SakuraTheme.colors.cardHighlight,
    borderRadius: 9,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 9,
  },
  barLabel: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 10,
    color: SakuraTheme.colors.textSecondary,
    marginTop: 8,
  },
  categoryAllocationList: {
    gap: 12,
    marginBottom: 20,
  },
  catAllocCard: {
    padding: 14,
  },
  catAllocTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  catIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catName: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
  },
  catSpendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  catSpentText: {
    fontSize: 12,
    fontWeight: '700',
  },
  catLimitText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    color: SakuraTheme.colors.textMuted,
  },
  warningPill: {
    backgroundColor: SakuraTheme.colors.expenseBg,
    borderWidth: 1,
    borderColor: SakuraTheme.colors.expenseBorder,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  warningPillText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 10,
    fontWeight: '700',
    color: SakuraTheme.colors.expense,
  },
  advisorCard: {
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: SakuraTheme.colors.primary,
    marginBottom: 20,
  },
  advisorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  advisorTitle: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
  },
  advisorBody: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    lineHeight: 18,
    color: SakuraTheme.colors.textSecondary,
    marginBottom: 12,
  },
  mitigateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: SakuraTheme.colors.primary,
    paddingVertical: 10,
    borderRadius: SakuraTheme.borderRadius.md,
  },
  mitigateBtnText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  exportCard: {
    padding: 16,
  },
  exportRow: {
    marginBottom: 12,
  },
  exportTitle: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
  },
  exportSubtitle: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    color: SakuraTheme.colors.textMuted,
    marginTop: 2,
  },
  exportBtnGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  exportBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: SakuraTheme.colors.cardSubtle,
    borderWidth: 1,
    borderColor: SakuraTheme.colors.border,
    paddingVertical: 10,
    borderRadius: SakuraTheme.borderRadius.md,
  },
  exportBtnText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: SakuraTheme.colors.primary,
  },
});
