import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SakuraTheme } from '@/constants/theme';
import { useFinanceStore } from '@/stores/financeStore';
import { TransactionType } from '@/types/finance';
import { SakuraCard } from '@/components/SakuraCard';

export default function AddTransactionScreen() {
  const router = useRouter();
  const { categories, pockets, addTransaction } = useFinanceStore();

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<number>(35000);
  const [amountInput, setAmountInput] = useState<string>('35000');
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]?.id || '');
  const [selectedPocket, setSelectedPocket] = useState<string>(pockets[0]?.id || '');
  const [toPocket, setToPocket] = useState<string>(pockets[1]?.id || '');
  const [note, setNote] = useState<string>('');
  const [saveAsQuickLog, setSaveAsQuickLog] = useState<boolean>(false);

  const quickAmounts = [10000, 25000, 50000, 100000];

  const handleAddAmount = (add: number) => {
    const current = parseInt(amountInput, 10) || 0;
    const next = current + add;
    setAmount(next);
    setAmountInput(next.toString());
  };

  const handleClear = () => {
    setAmount(0);
    setAmountInput('0');
  };

  const handleSave = () => {
    const finalAmount = parseInt(amountInput, 10) || 0;
    if (finalAmount <= 0) {
      Alert.alert('Perhatian', 'Harap masukkan nominal transaksi yang valid.');
      return;
    }

    addTransaction({
      amount: finalAmount,
      type,
      categoryId: selectedCategory,
      pocketId: selectedPocket,
      toPocketId: type === 'transfer' ? toPocket : undefined,
      note: note.trim(),
      isQuickLog: saveAsQuickLog,
    });

    Alert.alert('Berhasil 🌸', 'Transaksi berhasil disimpan!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const filteredCategories = categories.filter((c) => {
    if (type === 'expense') return c.type === 'expense';
    if (type === 'income') return c.type === 'income';
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <MaterialIcons name="close" size={24} color={SakuraTheme.colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Catat Transaksi</Text>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'Bantuan Catat Transaksi',
                'Pilih jenis transaksi, masukkan nominal, pilih kantong dana dan kategori untuk mencatat pengeluaran harianmu.'
              )
            }
            style={styles.closeBtn}
          >
            <MaterialIcons name="help-outline" size={22} color={SakuraTheme.colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
          {/* Segmented Type Toggle */}
          <View style={styles.segmentedContainer}>
            <TouchableOpacity
              style={[styles.segmentBtn, type === 'expense' && styles.segmentBtnActiveExpense]}
              onPress={() => setType('expense')}
            >
              <MaterialIcons
                name="arrow-upward"
                size={16}
                color={type === 'expense' ? '#ffffff' : SakuraTheme.colors.expense}
              />
              <Text
                style={[
                  styles.segmentText,
                  type === 'expense' && styles.segmentTextActive,
                ]}
              >
                Pengeluaran
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.segmentBtn, type === 'income' && styles.segmentBtnActiveIncome]}
              onPress={() => setType('income')}
            >
              <MaterialIcons
                name="arrow-downward"
                size={16}
                color={type === 'income' ? '#ffffff' : SakuraTheme.colors.income}
              />
              <Text
                style={[
                  styles.segmentText,
                  type === 'income' && styles.segmentTextActive,
                ]}
              >
                Pemasukan
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.segmentBtn, type === 'transfer' && styles.segmentBtnActiveTransfer]}
              onPress={() => setType('transfer')}
            >
              <MaterialIcons
                name="swap-horiz"
                size={16}
                color={type === 'transfer' ? '#ffffff' : SakuraTheme.colors.primary}
              />
              <Text
                style={[
                  styles.segmentText,
                  type === 'transfer' && styles.segmentTextActive,
                ]}
              >
                Transfer
              </Text>
            </TouchableOpacity>
          </View>

          {/* Amount Display & Keypad shortcuts */}
          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Nominal Transaksi</Text>
            <View style={styles.amountRow}>
              <Text style={styles.currencyPrefix}>Rp</Text>
              <TextInput
                style={styles.amountInput}
                keyboardType="numeric"
                value={amountInput}
                onChangeText={(text) => {
                  const cleaned = text.replace(/[^0-9]/g, '');
                  setAmountInput(cleaned);
                  setAmount(parseInt(cleaned, 10) || 0);
                }}
                selectTextOnFocus
              />
            </View>

            {/* Quick addition chips */}
            <View style={styles.quickChipsRow}>
              {quickAmounts.map((q) => (
                <TouchableOpacity
                  key={q}
                  style={styles.quickChip}
                  onPress={() => handleAddAmount(q)}
                >
                  <Text style={styles.quickChipText}>+{q / 1000}rb</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.quickChipClear} onPress={handleClear}>
                <Text style={styles.quickChipClearText}>C</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Pocket Selector */}
          <View style={styles.sectionBlock}>
            <Text style={styles.blockTitle}>
              {type === 'transfer' ? 'Dari Rekening / Kantong' : 'Sumber Kantong Dana'}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pocketList}>
              {pockets.map((poc) => {
                const isSelected = selectedPocket === poc.id;
                return (
                  <TouchableOpacity
                    key={poc.id}
                    style={[styles.pocketChip, isSelected && styles.pocketChipSelected]}
                    onPress={() => setSelectedPocket(poc.id)}
                  >
                    <MaterialIcons
                      name={poc.icon as any}
                      size={18}
                      color={isSelected ? '#ffffff' : SakuraTheme.colors.primary}
                    />
                    <View>
                      <Text style={[styles.pocketName, isSelected && styles.textWhite]}>
                        {poc.name}
                      </Text>
                      <Text style={[styles.pocketBal, isSelected && { color: '#ffd5dd' }]}>
                        Rp {poc.balance.toLocaleString('id-ID')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* If Transfer: Target Pocket */}
          {type === 'transfer' && (
            <View style={styles.sectionBlock}>
              <Text style={styles.blockTitle}>Ke Rekening Tujuan</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pocketList}>
                {pockets
                  .filter((p) => p.id !== selectedPocket)
                  .map((poc) => {
                    const isSelected = toPocket === poc.id;
                    return (
                      <TouchableOpacity
                        key={poc.id}
                        style={[styles.pocketChip, isSelected && styles.pocketChipSelected]}
                        onPress={() => setToPocket(poc.id)}
                      >
                        <MaterialIcons
                          name={poc.icon as any}
                          size={18}
                          color={isSelected ? '#ffffff' : SakuraTheme.colors.primary}
                        />
                        <View>
                          <Text style={[styles.pocketName, isSelected && styles.textWhite]}>
                            {poc.name}
                          </Text>
                          <Text style={[styles.pocketBal, isSelected && { color: '#ffd5dd' }]}>
                            Rp {poc.balance.toLocaleString('id-ID')}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
              </ScrollView>
            </View>
          )}

          {/* Categories Grid (for expense/income) */}
          {type !== 'transfer' && (
            <View style={styles.sectionBlock}>
              <Text style={styles.blockTitle}>Kategori Anggaran</Text>
              <View style={styles.categoryGrid}>
                {filteredCategories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  const remaining = Math.max(0, cat.budgetLimit - cat.currentSpent);
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryGridItem,
                        isSelected && styles.categoryGridItemSelected,
                      ]}
                      onPress={() => setSelectedCategory(cat.id)}
                    >
                      <View
                        style={[
                          styles.catIconWrap,
                          {
                            backgroundColor: isSelected
                              ? '#ffffff'
                              : cat.color + '15',
                          },
                        ]}
                      >
                        <MaterialIcons
                          name={cat.icon as any}
                          size={22}
                          color={isSelected ? SakuraTheme.colors.primary : cat.color}
                        />
                      </View>
                      <Text
                        style={[
                          styles.categoryItemName,
                          isSelected && styles.categoryItemNameSelected,
                        ]}
                        numberOfLines={1}
                      >
                        {cat.name}
                      </Text>
                      {cat.budgetLimit > 0 && (
                        <Text style={styles.catRemainingText}>
                          Sisa {Math.round(remaining / 1000)}rb
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Notes & Timestamp */}
          <View style={styles.sectionBlock}>
            <Text style={styles.blockTitle}>Catatan & Keterangan</Text>
            <View style={styles.noteInputWrap}>
              <MaterialIcons name="edit" size={20} color={SakuraTheme.colors.textMuted} />
              <TextInput
                style={styles.noteInput}
                placeholder="Misal: Makan Siang Nasi Padang..."
                placeholderTextColor="#9f123980"
                value={note}
                onChangeText={setNote}
              />
            </View>
          </View>

          {/* Quick-Log switch */}
          <SakuraCard style={styles.switchCard}>
            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchTitle}>Simpan sebagai Catat Cepat</Text>
                <Text style={styles.switchSubtitle}>
                  Tampilkan di widget 1-Tap Beranda untuk akses kilat
                </Text>
              </View>
              <Switch
                value={saveAsQuickLog}
                onValueChange={setSaveAsQuickLog}
                trackColor={{ false: '#fce7f3', true: SakuraTheme.colors.primaryLight }}
                thumbColor={saveAsQuickLog ? SakuraTheme.colors.primary : '#ffffff'}
              />
            </View>
          </SakuraCard>

          <View style={{ height: 90 }} />
        </ScrollView>

        {/* Bottom Save Action Button */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.saveBtn} activeOpacity={0.85} onPress={handleSave}>
            <MaterialIcons name="check-circle-outline" size={22} color="#ffffff" />
            <Text style={styles.saveBtnText}>Simpan Transaksi 🌸</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: SakuraTheme.colors.canvas,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SakuraTheme.spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: SakuraTheme.colors.border,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: SakuraTheme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: SakuraTheme.colors.border,
  },
  headerTitle: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 17,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
  },
  scrollBody: {
    padding: SakuraTheme.spacing.md,
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: SakuraTheme.colors.cardSubtle,
    borderRadius: SakuraTheme.borderRadius.lg,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: SakuraTheme.colors.border,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: SakuraTheme.borderRadius.md,
    gap: 6,
  },
  segmentBtnActiveExpense: {
    backgroundColor: SakuraTheme.colors.expense,
  },
  segmentBtnActiveIncome: {
    backgroundColor: SakuraTheme.colors.income,
  },
  segmentBtnActiveTransfer: {
    backgroundColor: SakuraTheme.colors.primary,
  },
  segmentText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '600',
    color: SakuraTheme.colors.textSecondary,
  },
  segmentTextActive: {
    color: '#ffffff',
  },
  amountBox: {
    backgroundColor: SakuraTheme.colors.card,
    borderRadius: SakuraTheme.borderRadius.xl,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: SakuraTheme.colors.border,
    marginBottom: 18,
    shadowColor: SakuraTheme.colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  amountLabel: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '600',
    color: SakuraTheme.colors.textMuted,
    marginBottom: 6,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  currencyPrefix: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 24,
    fontWeight: '700',
    color: SakuraTheme.colors.primary,
    marginRight: 6,
  },
  amountInput: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 34,
    fontWeight: '800',
    color: SakuraTheme.colors.textPrimary,
    minWidth: 120,
    textAlign: 'center',
  },
  quickChipsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  quickChip: {
    backgroundColor: SakuraTheme.colors.cardSubtle,
    borderWidth: 1,
    borderColor: SakuraTheme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: SakuraTheme.borderRadius.full,
  },
  quickChipText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: SakuraTheme.colors.primary,
  },
  quickChipClear: {
    backgroundColor: SakuraTheme.colors.expenseBg,
    borderWidth: 1,
    borderColor: SakuraTheme.colors.expenseBorder,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: SakuraTheme.borderRadius.full,
  },
  quickChipClearText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: SakuraTheme.colors.expense,
  },
  sectionBlock: {
    marginBottom: 18,
  },
  blockTitle: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
    marginBottom: 8,
  },
  pocketList: {
    gap: 10,
    paddingVertical: 2,
  },
  pocketChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: SakuraTheme.colors.card,
    borderWidth: 1.5,
    borderColor: SakuraTheme.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: SakuraTheme.borderRadius.lg,
  },
  pocketChipSelected: {
    backgroundColor: SakuraTheme.colors.primary,
    borderColor: SakuraTheme.colors.primary,
  },
  pocketName: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
  },
  pocketBal: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    color: SakuraTheme.colors.textMuted,
  },
  textWhite: {
    color: '#ffffff',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryGridItem: {
    width: '22.5%',
    backgroundColor: SakuraTheme.colors.card,
    borderWidth: 1.5,
    borderColor: SakuraTheme.colors.border,
    borderRadius: SakuraTheme.borderRadius.md,
    padding: 10,
    alignItems: 'center',
  },
  categoryGridItemSelected: {
    backgroundColor: SakuraTheme.colors.primary,
    borderColor: SakuraTheme.colors.primary,
  },
  catIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryItemName: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 10,
    fontWeight: '600',
    color: SakuraTheme.colors.textPrimary,
    textAlign: 'center',
  },
  categoryItemNameSelected: {
    color: '#ffffff',
  },
  catRemainingText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 9,
    color: SakuraTheme.colors.textMuted,
    marginTop: 2,
  },
  noteInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: SakuraTheme.colors.card,
    borderWidth: 1,
    borderColor: SakuraTheme.colors.border,
    borderRadius: SakuraTheme.borderRadius.lg,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  noteInput: {
    flex: 1,
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 14,
    color: SakuraTheme.colors.textPrimary,
  },
  switchCard: {
    padding: 14,
    marginBottom: 20,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchTitle: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
  },
  switchSubtitle: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    color: SakuraTheme.colors.textMuted,
    marginTop: 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: SakuraTheme.colors.card,
    borderTopWidth: 1,
    borderTopColor: SakuraTheme.colors.border,
    paddingHorizontal: SakuraTheme.spacing.md,
    paddingVertical: 12,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: SakuraTheme.colors.primary,
    paddingVertical: 14,
    borderRadius: SakuraTheme.borderRadius.lg,
    shadowColor: SakuraTheme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
});
