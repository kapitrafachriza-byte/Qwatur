import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SakuraTheme } from '@/constants/theme';
import { useFinanceStore } from '@/stores/financeStore';

export default function AddTransactionTab() {
  const router = useRouter();
  const pockets = useFinanceStore((state) => state.pockets);
  const categories = useFinanceStore((state) => state.categories);
  const addTransaction = useFinanceStore((state) => state.addTransaction);

  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amountStr, setAmountStr] = useState('20000');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || '');
  const [selectedPocket, setSelectedPocket] = useState(pockets[0]?.id || '');
  const [note, setNote] = useState('');

  const quickAmounts = [10000, 20000, 50000, 100000];

  const handleAddQuick = (val: number) => {
    const current = parseInt(amountStr, 10) || 0;
    setAmountStr((current + val).toString());
  };

  const handleClear = () => {
    setAmountStr('');
  };

  const handleSave = () => {
    const nominal = parseInt(amountStr, 10) || 0;
    if (nominal <= 0) {
      Alert.alert('Perhatian', 'Silakan masukkan nominal transaksi.');
      return;
    }

    const selectedPoc = pockets.find((p) => p.id === selectedPocket);
    if (type === 'expense' && selectedPoc && selectedPoc.balance < nominal) {
      Alert.alert(
        'Saldo Tidak Cukup',
        `Saldo di ${selectedPoc.name} hanya Rp ${selectedPoc.balance.toLocaleString('id-ID')}. Tetap lanjutkan?`,
        [
          { text: 'Batal', style: 'cancel' },
          {
            text: 'Lanjutkan',
            onPress: () => submitTransaction(nominal),
          },
        ]
      );
      return;
    }

    submitTransaction(nominal);
  };

  const submitTransaction = (nominal: number) => {
    addTransaction({
      amount: nominal,
      type,
      categoryId: selectedCategory || categories[0]?.id || 'cat-1',
      pocketId: selectedPocket || pockets[0]?.id || 'poc-1',
      note: note.trim(),
    });

    Alert.alert('Berhasil Disimpan 🌸', `Transaksi Rp ${nominal.toLocaleString('id-ID')} berhasil dicatat dan saldo telah diperbarui!`, [
      {
        text: 'Lihat Beranda',
        onPress: () => router.navigate('/(tabs)'),
      },
    ]);

    setNote('');
  };

  const filteredCategories = categories.filter((c) => c.type === type);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Catat Transaksi Baru</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
          {/* Toggle Jenis Transaksi */}
          <View style={styles.typeToggleRow}>
            <TouchableOpacity
              style={[styles.typeBtn, type === 'expense' && styles.typeBtnActiveExpense]}
              onPress={() => {
                setType('expense');
                const firstExp = categories.find((c) => c.type === 'expense');
                if (firstExp) setSelectedCategory(firstExp.id);
              }}
            >
              <MaterialIcons
                name="arrow-upward"
                size={18}
                color={type === 'expense' ? '#ffffff' : SakuraTheme.colors.expense}
              />
              <Text style={[styles.typeBtnText, type === 'expense' && styles.textWhite]}>
                Pengeluaran
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.typeBtn, type === 'income' && styles.typeBtnActiveIncome]}
              onPress={() => {
                setType('income');
                const firstInc = categories.find((c) => c.type === 'income');
                if (firstInc) setSelectedCategory(firstInc.id);
              }}
            >
              <MaterialIcons
                name="arrow-downward"
                size={18}
                color={type === 'income' ? '#ffffff' : SakuraTheme.colors.income}
              />
              <Text style={[styles.typeBtnText, type === 'income' && styles.textWhite]}>
                Pemasukan
              </Text>
            </TouchableOpacity>
          </View>

          {/* Input Nominal */}
          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>Nominal (Rp)</Text>
            <View style={styles.amountInputRow}>
              <Text style={styles.rpPrefix}>Rp</Text>
              <TextInput
                style={styles.amountInput}
                keyboardType="numeric"
                value={amountStr}
                onChangeText={(text) => setAmountStr(text.replace(/[^0-9]/g, ''))}
                placeholder="0"
                placeholderTextColor="#9f123950"
                selectTextOnFocus
              />
            </View>

            {/* Quick addition */}
            <View style={styles.quickChips}>
              {quickAmounts.map((val) => (
                <TouchableOpacity
                  key={val}
                  style={styles.chip}
                  onPress={() => handleAddQuick(val)}
                >
                  <Text style={styles.chipText}>+{val / 1000}rb</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.chipClear} onPress={handleClear}>
                <Text style={styles.chipClearText}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Pilih Kantong Sumber Dana */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionLabel}>
              {type === 'expense' ? 'Gunakan Saldo Dari' : 'Masukkan ke Rekening/Kas'}
            </Text>
            <View style={styles.pocketsRow}>
              {pockets.map((poc) => {
                const isSelected = selectedPocket === poc.id;
                return (
                  <TouchableOpacity
                    key={poc.id}
                    style={[styles.pocketBtn, isSelected && styles.pocketBtnActive]}
                    onPress={() => setSelectedPocket(poc.id)}
                  >
                    <MaterialIcons
                      name={poc.icon as any}
                      size={20}
                      color={isSelected ? '#ffffff' : SakuraTheme.colors.primary}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.pocketBtnTitle, isSelected && styles.textWhite]}>
                        {poc.name}
                      </Text>
                      <Text style={[styles.pocketBtnBal, isSelected && { color: '#ffd5dd' }]}>
                        Rp {poc.balance.toLocaleString('id-ID')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Pilih Kategori */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionLabel}>Pilih Kategori</Text>
            <View style={styles.categoryGrid}>
              {filteredCategories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.catItem, isSelected && styles.catItemActive]}
                    onPress={() => setSelectedCategory(cat.id)}
                  >
                    <View
                      style={[
                        styles.catIconWrap,
                        { backgroundColor: isSelected ? '#ffffff' : cat.color + '15' },
                      ]}
                    >
                      <MaterialIcons
                        name={cat.icon as any}
                        size={22}
                        color={isSelected ? SakuraTheme.colors.primary : cat.color}
                      />
                    </View>
                    <Text
                      style={[styles.catName, isSelected && styles.textWhite]}
                      numberOfLines={1}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Catatan Tambahan (Opsional) */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionLabel}>Catatan (Opsional)</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="Contoh: Makan siang, bensin motor..."
              placeholderTextColor="#9f123960"
              value={note}
              onChangeText={setNote}
            />
          </View>

          {/* Tombol Simpan */}
          <TouchableOpacity style={styles.saveButton} activeOpacity={0.85} onPress={handleSave}>
            <MaterialIcons name="check" size={22} color="#ffffff" />
            <Text style={styles.saveButtonText}>Simpan Transaksi 🌸</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: SakuraTheme.colors.border,
    backgroundColor: SakuraTheme.colors.card,
  },
  headerTitle: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 18,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
  },
  scrollBody: {
    padding: 16,
  },
  typeToggleRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: SakuraTheme.borderRadius.md,
    backgroundColor: SakuraTheme.colors.card,
    borderWidth: 1.5,
    borderColor: SakuraTheme.colors.border,
    gap: 6,
  },
  typeBtnActiveExpense: {
    backgroundColor: SakuraTheme.colors.expense,
    borderColor: SakuraTheme.colors.expense,
  },
  typeBtnActiveIncome: {
    backgroundColor: SakuraTheme.colors.income,
    borderColor: SakuraTheme.colors.income,
  },
  typeBtnText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
  },
  textWhite: {
    color: '#ffffff',
  },
  amountCard: {
    backgroundColor: SakuraTheme.colors.card,
    borderRadius: SakuraTheme.borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: SakuraTheme.colors.border,
    marginBottom: 18,
    alignItems: 'center',
  },
  amountLabel: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '600',
    color: SakuraTheme.colors.textMuted,
    marginBottom: 6,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  rpPrefix: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 24,
    fontWeight: '700',
    color: SakuraTheme.colors.primary,
    marginRight: 6,
  },
  amountInput: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 32,
    fontWeight: '800',
    color: SakuraTheme.colors.textPrimary,
    minWidth: 120,
    textAlign: 'center',
  },
  quickChips: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  chip: {
    backgroundColor: SakuraTheme.colors.cardSubtle,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: SakuraTheme.borderRadius.full,
    borderWidth: 1,
    borderColor: SakuraTheme.colors.border,
  },
  chipText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: SakuraTheme.colors.primary,
  },
  chipClear: {
    backgroundColor: SakuraTheme.colors.expenseBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: SakuraTheme.borderRadius.full,
  },
  chipClearText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: SakuraTheme.colors.expense,
  },
  sectionBlock: {
    marginBottom: 18,
  },
  sectionLabel: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
    marginBottom: 8,
  },
  pocketsRow: {
    gap: 8,
  },
  pocketBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: SakuraTheme.colors.card,
    borderWidth: 1.5,
    borderColor: SakuraTheme.colors.border,
    padding: 12,
    borderRadius: SakuraTheme.borderRadius.md,
  },
  pocketBtnActive: {
    backgroundColor: SakuraTheme.colors.primary,
    borderColor: SakuraTheme.colors.primary,
  },
  pocketBtnTitle: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
  },
  pocketBtnBal: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    color: SakuraTheme.colors.textMuted,
    marginTop: 2,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catItem: {
    width: '31%',
    backgroundColor: SakuraTheme.colors.card,
    borderWidth: 1.5,
    borderColor: SakuraTheme.colors.border,
    borderRadius: SakuraTheme.borderRadius.md,
    padding: 10,
    alignItems: 'center',
  },
  catItemActive: {
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
  catName: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '600',
    color: SakuraTheme.colors.textPrimary,
    textAlign: 'center',
  },
  noteInput: {
    backgroundColor: SakuraTheme.colors.card,
    borderWidth: 1,
    borderColor: SakuraTheme.colors.border,
    borderRadius: SakuraTheme.borderRadius.md,
    padding: 12,
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 14,
    color: SakuraTheme.colors.textPrimary,
  },
  saveButton: {
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
    marginTop: 10,
  },
  saveButtonText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});
