import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SakuraTheme } from '@/constants/theme';
import { useFinanceStore } from '@/stores/financeStore';
import { CurrencyText } from '@/components/CurrencyText';
import { SakuraCard } from '@/components/SakuraCard';

const MAX_AMOUNT = 999_999_999; // Rp 999.999.999

export default function HomeScreen() {
  const router = useRouter();

  // Reactive state subscriptions
  const pockets = useFinanceStore((state) => state.pockets);
  const categories = useFinanceStore((state) => state.categories);
  const quickLogs = useFinanceStore((state) => state.quickLogs);
  const transactions = useFinanceStore((state) => state.transactions);
  const executeQuickLog = useFinanceStore((state) => state.executeQuickLog);
  const depositToPocket = useFinanceStore((state) => state.depositToPocket);
  const deleteTransaction = useFinanceStore((state) => state.deleteTransaction);

  const [lastLoggedNote, setLastLoggedNote] = useState<string | null>(null);
  const [isQuickLogging, setIsQuickLogging] = useState(false);

  // Modal Tambah Saldo / Gajian
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmountStr, setDepositAmountStr] = useState('5000000');
  const [selectedDepositPocket, setSelectedDepositPocket] = useState(pockets[0]?.id || 'poc-1');
  const [depositNote, setDepositNote] = useState('Gaji Bulanan');

  // Direct reactive calculations
  const totalBalance = useMemo(
    () => pockets.reduce((sum, p) => sum + p.balance, 0),
    [pockets]
  );

  const totalIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalExpense = useMemo(
    () =>
      transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const handleQuickLog = (item: (typeof quickLogs)[0]) => {
    if (isQuickLogging) return;
    setIsQuickLogging(true);

    const poc = pockets.find((p) => p.id === item.pocketId);
    if (poc && poc.balance < item.amount) {
      Alert.alert(
        'Saldo Tidak Cukup',
        `Saldo di ${poc.name} (Rp ${poc.balance.toLocaleString('id-ID')}) tidak cukup untuk ${item.title}.`
      );
      setTimeout(() => {
        setIsQuickLogging(false);
      }, 500);
      return;
    }

    const tx = executeQuickLog(item.id);
    if (tx) {
      setLastLoggedNote(`Tercatat: ${item.title} (-Rp ${item.amount.toLocaleString('id-ID')})`);
      setTimeout(() => setLastLoggedNote(null), 3000);
    }
    setTimeout(() => {
      setIsQuickLogging(false);
    }, 500);
  };

  const handleSaveDeposit = () => {
    const nominal = parseInt(depositAmountStr, 10) || 0;
    if (nominal <= 0) {
      Alert.alert('Perhatian', 'Harap masukkan nominal penambahan saldo.');
      return;
    }
    if (nominal > MAX_AMOUNT) {
      Alert.alert(
        'Nominal Terlalu Besar',
        'Maksimal nominal penambahan saldo adalah Rp 999.999.999'
      );
      return;
    }

    depositToPocket(
      selectedDepositPocket,
      nominal,
      depositNote.trim() || 'Gaji Bulanan / Tambah Saldo'
    );

    const targetPoc = pockets.find((p) => p.id === selectedDepositPocket);
    setShowDepositModal(false);
    setLastLoggedNote(
      `Berhasil! Saldo ${targetPoc?.name || 'Kantong'} bertambah +Rp ${nominal.toLocaleString('id-ID')}`
    );
    setTimeout(() => setLastLoggedNote(null), 4000);
  };

  const handleQuickAddDeposit = (add: number) => {
    const current = parseInt(depositAmountStr, 10) || 0;
    const nextVal = Math.min(current + add, MAX_AMOUNT);
    setDepositAmountStr(nextVal.toString());
  };

  const getCategory = (catId: string) => categories.find((c) => c.id === catId);
  const getPocket = (pocId: string) => pockets.find((p) => p.id === pocId);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.appTitle}>Qwatur 🌸</Text>
          <Text style={styles.appSubtitle}>Pencatat Keuangan Simpel</Text>
        </View>
        <TouchableOpacity
          style={styles.addIconBtn}
          onPress={() => setShowDepositModal(true)}
          accessibilityLabel="Tambah Saldo Gajian"
        >
          <MaterialIcons name="add-card" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Toast Notifikasi Banner */}
        {lastLoggedNote && (
          <View style={styles.toastBanner}>
            <MaterialIcons name="check-circle" size={18} color="#047857" />
            <Text style={styles.toastText}>{lastLoggedNote}</Text>
          </View>
        )}

        {/* 1. Kartu Saldo Utama */}
        <View style={styles.masterCard}>
          <View style={styles.masterTop}>
            <Text style={styles.masterLabel}>Total Saldo Tersedia</Text>
            <TouchableOpacity
              style={styles.masterDepositChip}
              onPress={() => setShowDepositModal(true)}
            >
              <MaterialIcons name="add" size={14} color="#ffffff" />
              <Text style={styles.masterDepositText}>Tambah Saldo</Text>
            </TouchableOpacity>
          </View>

          <CurrencyText
            amount={totalBalance}
            style={styles.masterBalanceText}
            prefixStyle={styles.masterPrefix}
          />

          <View style={styles.dividerLight} />

          <View style={styles.cashflowRow}>
            <View style={styles.cashflowItem}>
              <View style={[styles.cashflowIcon, { backgroundColor: '#ecfdf5' }]}>
                <MaterialIcons name="arrow-downward" size={16} color="#047857" />
              </View>
              <View>
                <Text style={styles.cashflowLabel}>Pemasukan (Gaji)</Text>
                <CurrencyText amount={totalIncome} type="income" style={styles.cashflowVal} />
              </View>
            </View>

            <View style={styles.verticalDivider} />

            <View style={styles.cashflowItem}>
              <View style={[styles.cashflowIcon, { backgroundColor: '#fff1f2' }]}>
                <MaterialIcons name="arrow-upward" size={16} color="#be185d" />
              </View>
              <View>
                <Text style={styles.cashflowLabel}>Pengeluaran</Text>
                <CurrencyText amount={totalExpense} type="expense" style={styles.cashflowVal} />
              </View>
            </View>
          </View>
        </View>

        {/* 2. Dua Tombol Utama Berdampingan: Catat Pengeluaran & Tambah Saldo (Gajian) */}
        <View style={styles.mainActionsRow}>
          <TouchableOpacity
            style={styles.expenseActionBtn}
            activeOpacity={0.85}
            onPress={() => router.push('/(tabs)/add')}
          >
            <MaterialIcons name="remove-circle-outline" size={20} color="#ffffff" />
            <Text style={styles.actionBtnText}>- Catat Pengeluaran</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.incomeActionBtn}
            activeOpacity={0.85}
            onPress={() => setShowDepositModal(true)}
          >
            <MaterialIcons name="add-circle-outline" size={20} color="#ffffff" />
            <Text style={styles.actionBtnText}>+ Tambah Saldo (Gajian)</Text>
          </TouchableOpacity>
        </View>

        {/* 3. Pintasan Catat Cepat (1-Tap Langsung Potong Saldo) */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="touch-app" size={20} color={SakuraTheme.colors.primary} />
            <Text style={styles.sectionTitle}>Pintasan Catat Cepat (1-Tap)</Text>
          </View>
          <Text style={styles.sectionHint}>Sentuh untuk langsung potong saldo</Text>
        </View>

        <View style={styles.quickGrid}>
          {quickLogs.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.quickCard, isQuickLogging && styles.quickCardDisabled]}
              activeOpacity={0.7}
              disabled={isQuickLogging}
              onPress={() => handleQuickLog(item)}
            >
              <View style={styles.quickIconWrap}>
                <MaterialIcons name={item.icon as any} size={22} color={SakuraTheme.colors.primary} />
              </View>
              <Text style={styles.quickTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.quickAmount}>
                -Rp {item.amount.toLocaleString('id-ID')}
              </Text>
              <View style={[styles.tapBadge, isQuickLogging && styles.tapBadgeDisabled]}>
                <Text style={styles.tapBadgeText}>
                  {isQuickLogging ? 'Memproses...' : 'Tap Catat'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 4. Rincian Saldo Kantong Singkat */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="account-balance-wallet" size={20} color={SakuraTheme.colors.primary} />
            <Text style={styles.sectionTitle}>Kantong Saya</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/wallets')}>
            <Text style={styles.linkText}>Kelola ➔</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pocketListRow}>
          {pockets.map((poc) => (
            <View key={poc.id} style={styles.miniPocketCard}>
              <Text style={styles.miniPocketName} numberOfLines={1}>
                {poc.name}
              </Text>
              <CurrencyText amount={poc.balance} style={styles.miniPocketBal} />
            </View>
          ))}
        </View>

        {/* 5. Riwayat Transaksi */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="history" size={20} color={SakuraTheme.colors.primary} />
            <Text style={styles.sectionTitle}>Riwayat Transaksi</Text>
          </View>
          <Text style={styles.sectionHint}>{transactions.length} transaksi</Text>
        </View>

        {transactions.length === 0 ? (
          <SakuraCard style={styles.emptyCard}>
            <MaterialIcons name="receipt-long" size={36} color={SakuraTheme.colors.border} />
            <Text style={styles.emptyText}>Belum ada transaksi.</Text>
            <Text style={styles.emptySub}>Gunakan tombol catat di atas untuk mulai mencatat.</Text>
          </SakuraCard>
        ) : (
          <View style={styles.txList}>
            {transactions.map((tx) => {
              const cat = getCategory(tx.categoryId);
              const poc = getPocket(tx.pocketId);
              const isExpense = tx.type === 'expense';

              return (
                <SakuraCard key={tx.id} style={styles.txItem}>
                  <View style={styles.txRow}>
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

                    <View style={{ flex: 1 }}>
                      <Text style={styles.txTitle}>{tx.note}</Text>
                      <Text style={styles.txMeta}>
                        {poc?.name || 'Kas'} •{' '}
                        {new Date(tx.date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </Text>
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
                          Alert.alert(
                            'Hapus Transaksi',
                            `Hapus catatan ${tx.note}? Saldo akan otomatis disesuaikan kembali.`,
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
                        style={styles.deleteBtn}
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

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Modal Tambah Saldo / Gajian */}
      <Modal visible={showDepositModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalIconWrap}>
                <MaterialIcons name="account-balance-wallet" size={24} color="#047857" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>Tambah Saldo (Gajian)</Text>
                <Text style={styles.modalSub}>
                  Masukkan dana masuk ke kantong pilihanmu
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowDepositModal(false)}>
                <MaterialIcons name="close" size={24} color={SakuraTheme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Input Nominal */}
            <Text style={styles.fieldLabel}>Nominal Masuk (Rp)</Text>
            <View style={styles.amountInputRow}>
              <Text style={styles.rpText}>Rp</Text>
              <TextInput
                style={styles.amountInput}
                keyboardType="numeric"
                value={depositAmountStr}
                onChangeText={(t) => setDepositAmountStr(t.replace(/[^0-9]/g, ''))}
                autoFocus
              />
            </View>

            {/* Shortcut Gajian */}
            <View style={styles.quickDepositChips}>
              <TouchableOpacity
                style={styles.depositChip}
                onPress={() => handleQuickAddDeposit(1000000)}
              >
                <Text style={styles.depositChipText}>+1 Juta</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.depositChip}
                onPress={() => handleQuickAddDeposit(2000000)}
              >
                <Text style={styles.depositChipText}>+2 Juta</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.depositChip}
                onPress={() => handleQuickAddDeposit(5000000)}
              >
                <Text style={styles.depositChipText}>+5 Juta</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.depositChip, { backgroundColor: '#fee2e2' }]}
                onPress={() => setDepositAmountStr('')}
              >
                <Text style={[styles.depositChipText, { color: '#ba1a1a' }]}>Hapus</Text>
              </TouchableOpacity>
            </View>

            {/* Pilih Kantong Tujuan */}
            <Text style={styles.fieldLabel}>Pilih Rekening Tujuan Masuk</Text>
            <View style={styles.pocketChoiceRow}>
              {pockets.map((poc) => {
                const isSelected = selectedDepositPocket === poc.id;
                return (
                  <TouchableOpacity
                    key={poc.id}
                    style={[styles.pocketChoiceBtn, isSelected && styles.pocketChoiceBtnActive]}
                    onPress={() => setSelectedDepositPocket(poc.id)}
                  >
                    <Text style={[styles.pocketChoiceText, isSelected && styles.textWhite]}>
                      {poc.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Keterangan */}
            <Text style={styles.fieldLabel}>Keterangan Pemasukan</Text>
            <TextInput
              style={styles.textInputRegular}
              placeholder="Contoh: Gaji Bulanan, Bonus, Transfer Masuk"
              placeholderTextColor="#9f123960"
              value={depositNote}
              onChangeText={setDepositNote}
            />

            {/* Tombol Simpan */}
            <TouchableOpacity style={styles.confirmDepositBtn} onPress={handleSaveDeposit}>
              <MaterialIcons name="add-circle" size={20} color="#ffffff" />
              <Text style={styles.confirmDepositText}>Tambah ke Saldo 💰</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: SakuraTheme.colors.canvas,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: SakuraTheme.colors.canvas,
  },
  appTitle: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 20,
    fontWeight: '800',
    color: SakuraTheme.colors.textPrimary,
  },
  appSubtitle: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    color: SakuraTheme.colors.textMuted,
  },
  addIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#047857',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#047857',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  toastBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: SakuraTheme.borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  toastText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: '#047857',
  },
  masterCard: {
    backgroundColor: SakuraTheme.colors.primaryDark,
    borderRadius: SakuraTheme.borderRadius.xl,
    padding: 18,
    marginBottom: 14,
    shadowColor: SakuraTheme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  masterTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  masterLabel: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    color: '#ffd5dd',
    fontWeight: '500',
  },
  masterDepositChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#047857',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  masterDepositText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  masterBalanceText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
  masterPrefix: {
    color: '#ffd5dd',
    fontSize: 18,
  },
  dividerLight: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginVertical: 14,
  },
  cashflowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cashflowItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cashflowIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cashflowLabel: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    color: '#ffd5dd',
  },
  cashflowVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  verticalDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: 10,
  },
  mainActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  expenseActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: SakuraTheme.colors.primary,
    paddingVertical: 12,
    borderRadius: SakuraTheme.borderRadius.lg,
    shadowColor: SakuraTheme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  incomeActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#047857',
    paddingVertical: 12,
    borderRadius: SakuraTheme.borderRadius.lg,
    shadowColor: '#047857',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  actionBtnText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 4,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
  },
  sectionHint: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    color: SakuraTheme.colors.textMuted,
  },
  linkText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: SakuraTheme.colors.primary,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  quickCard: {
    width: '48.5%',
    backgroundColor: SakuraTheme.colors.card,
    borderWidth: 1.5,
    borderColor: SakuraTheme.colors.border,
    borderRadius: SakuraTheme.borderRadius.md,
    padding: 12,
    alignItems: 'center',
  },
  quickIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: SakuraTheme.colors.cardSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  quickTitle: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
    marginBottom: 2,
  },
  quickAmount: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: SakuraTheme.colors.expense,
    marginBottom: 6,
  },
  tapBadge: {
    backgroundColor: SakuraTheme.colors.cardHighlight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tapBadgeText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 10,
    fontWeight: '700',
    color: SakuraTheme.colors.primary,
  },
  quickCardDisabled: {
    opacity: 0.5,
  },
  tapBadgeDisabled: {
    backgroundColor: SakuraTheme.colors.cardSubtle,
  },
  pocketListRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  miniPocketCard: {
    flex: 1,
    backgroundColor: SakuraTheme.colors.card,
    borderWidth: 1,
    borderColor: SakuraTheme.colors.border,
    borderRadius: SakuraTheme.borderRadius.md,
    padding: 10,
  },
  miniPocketName: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    color: SakuraTheme.colors.textMuted,
    marginBottom: 4,
  },
  miniPocketBal: {
    fontSize: 13,
    fontWeight: '700',
  },
  txList: {
    gap: 8,
  },
  txItem: {
    padding: 12,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  txIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txTitle: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
  },
  txMeta: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    color: SakuraTheme.colors.textMuted,
    marginTop: 2,
  },
  txAmountCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  txAmountText: {
    fontSize: 13,
    fontWeight: '700',
  },
  deleteBtn: {
    padding: 2,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
    marginTop: 8,
  },
  emptySub: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    color: SakuraTheme.colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },

  // Modal styling
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: SakuraTheme.borderRadius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: SakuraTheme.colors.border,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  modalIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 17,
    fontWeight: '800',
    color: SakuraTheme.colors.textPrimary,
  },
  modalSub: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    color: SakuraTheme.colors.textMuted,
    marginTop: 2,
  },
  fieldLabel: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
    marginBottom: 6,
    marginTop: 10,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SakuraTheme.colors.cardSubtle,
    borderWidth: 1.5,
    borderColor: SakuraTheme.colors.border,
    borderRadius: SakuraTheme.borderRadius.md,
    paddingHorizontal: 12,
  },
  rpText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 20,
    fontWeight: '700',
    color: '#047857',
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 24,
    fontWeight: '800',
    color: SakuraTheme.colors.textPrimary,
    paddingVertical: 10,
  },
  quickDepositChips: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  depositChip: {
    flex: 1,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  depositChipText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  pocketChoiceRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pocketChoiceBtn: {
    flex: 1,
    backgroundColor: SakuraTheme.colors.cardSubtle,
    borderWidth: 1.5,
    borderColor: SakuraTheme.colors.border,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  pocketChoiceBtnActive: {
    backgroundColor: '#047857',
    borderColor: '#047857',
  },
  pocketChoiceText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
  },
  textWhite: {
    color: '#ffffff',
  },
  textInputRegular: {
    backgroundColor: SakuraTheme.colors.cardSubtle,
    borderWidth: 1,
    borderColor: SakuraTheme.colors.border,
    borderRadius: 8,
    padding: 10,
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 13,
    color: SakuraTheme.colors.textPrimary,
  },
  confirmDepositBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#047857',
    paddingVertical: 14,
    borderRadius: SakuraTheme.borderRadius.lg,
    marginTop: 18,
    shadowColor: '#047857',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  confirmDepositText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
});
