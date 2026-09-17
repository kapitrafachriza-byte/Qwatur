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
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { SakuraTheme } from '@/constants/theme';
import { useFinanceStore } from '@/stores/financeStore';
import { CurrencyText } from '@/components/CurrencyText';
import { SakuraCard } from '@/components/SakuraCard';
import { formatRupiah } from '@/utils/format';

const MAX_AMOUNT = 999_999_999; // Rp 999.999.999

export default function WalletsScreen() {
  const pockets = useFinanceStore((state) => state.pockets);
  const updatePocketBalance = useFinanceStore((state) => state.updatePocketBalance);
  const depositToPocket = useFinanceStore((state) => state.depositToPocket);
  const addPocket = useFinanceStore((state) => state.addPocket);

  // Modal Ubah Saldo Manual
  const [editPocketId, setEditPocketId] = useState<string | null>(null);
  const [editBalanceStr, setEditBalanceStr] = useState('');

  // Modal Tambah Saldo / Gajian per Kantong
  const [depositPocketId, setDepositPocketId] = useState<string | null>(null);
  const [depositAmountStr, setDepositAmountStr] = useState('');
  const [depositNote, setDepositNote] = useState('Gaji Bulanan');

  // Modal Buat Kantong Baru
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPocketName, setNewPocketName] = useState('');
  const [newPocketBalStr, setNewPocketBalStr] = useState('');

  const totalBalance = useMemo(
    () => pockets.reduce((sum, p) => sum + p.balance, 0),
    [pockets]
  );

  const handleOpenDeposit = (id: string) => {
    setDepositPocketId(id);
    setDepositAmountStr('');
    setDepositNote('Gaji Bulanan');
  };

  const handleQuickAddDeposit = (add: number) => {
    const current = parseInt(depositAmountStr, 10) || 0;
    const nextVal = Math.min(current + add, MAX_AMOUNT);
    setDepositAmountStr(nextVal.toString());
  };

  const handleSaveDeposit = () => {
    if (!depositPocketId) return;
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

    depositToPocket(depositPocketId, nominal, depositNote.trim() || 'Gaji Bulanan');
    const poc = pockets.find((p) => p.id === depositPocketId);
    setDepositPocketId(null);
    setDepositAmountStr('');
    Alert.alert(
      'Saldo Bertambah! 💰',
      `Saldo ${poc?.name} berhasil ditambah Rp ${formatRupiah(nominal)}.`
    );
  };

  const handleOpenEdit = (id: string, currentBal: number) => {
    setEditPocketId(id);
    setEditBalanceStr(currentBal.toString());
  };

  const handleSaveEdit = () => {
    if (!editPocketId) return;
    const newBal = parseInt(editBalanceStr, 10) || 0;
    if (newBal > MAX_AMOUNT) {
      Alert.alert(
        'Nominal Terlalu Besar',
        'Maksimal saldo kantong adalah Rp 999.999.999'
      );
      return;
    }
    updatePocketBalance(editPocketId, newBal);
    setEditPocketId(null);
    Alert.alert('Sukses', 'Saldo kantong berhasil diperbarui!');
  };

  const handleCreatePocket = () => {
    if (!newPocketName.trim()) {
      Alert.alert('Perhatian', 'Harap masukkan nama kantong.');
      return;
    }
    const initialBal = parseInt(newPocketBalStr, 10) || 0;
    if (initialBal > MAX_AMOUNT) {
      Alert.alert(
        'Nominal Terlalu Besar',
        'Maksimal saldo awal adalah Rp 999.999.999'
      );
      return;
    }
    addPocket(newPocketName.trim(), initialBal);
    setShowAddModal(false);
    setNewPocketName('');
    setNewPocketBalStr('');
    Alert.alert('Sukses', 'Kantong baru berhasil ditambahkan!');
  };

  const currentDepositPocket = pockets.find((p) => p.id === depositPocketId);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>Kantong & Dompet 🌸</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowAddModal(true)}
          accessibilityRole="button"
          accessibilityLabel="Tambah kantong baru"
        >
          <MaterialIcons name="add" size={20} color="#ffffff" />
          <Text style={styles.addBtnText}>Tambah</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Total Saldo Card */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Seluruh Saldo</Text>
          <CurrencyText amount={totalBalance} style={styles.totalVal} prefixStyle={styles.totalPrefix} />
          <Text style={styles.totalHint}>Tersimpan di {pockets.length} kantong aktif</Text>
        </View>

        <Text style={styles.sectionTitle}>Daftar Kantong Rekening & Kas</Text>

        <View style={styles.list}>
          {pockets.map((poc) => (
            <SakuraCard key={poc.id} style={styles.pocketCard}>
              <View style={styles.pocketRow}>
                <View style={styles.iconWrap}>
                  <MaterialIcons name={poc.icon as any} size={24} color={SakuraTheme.colors.primary} />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.pocketName}>{poc.name}</Text>
                  <CurrencyText amount={poc.balance} style={styles.pocketBal} />
                </View>

                <View style={styles.actionCol}>
                  <TouchableOpacity
                    style={styles.depositActionBtn}
                    onPress={() => handleOpenDeposit(poc.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Tambah saldo ke ${poc.name}`}
                  >
                    <MaterialIcons name="add-circle" size={16} color="#ffffff" />
                    <Text style={styles.depositActionText}>+ Tambah Saldo</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => handleOpenEdit(poc.id, poc.balance)}
                    accessibilityRole="button"
                    accessibilityLabel={`Sesuaikan saldo ${poc.name}`}
                  >
                    <Text style={styles.editBtnText}>Sesuaikan</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </SakuraCard>
          ))}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Modal Tambah Saldo / Gajian per Kantong */}
      <Modal visible={!!depositPocketId} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <MaterialIcons name="payments" size={24} color="#047857" />
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>Tambah Saldo / Gajian</Text>
                <Text style={styles.modalSub}>
                  Menambah saldo ke {currentDepositPocket?.name}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setDepositPocketId(null)}
                accessibilityRole="button"
                accessibilityLabel="Tutup modal tambah saldo"
              >
                <MaterialIcons name="close" size={22} color={SakuraTheme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Nominal Masuk (Rp)</Text>
            <View style={styles.inputWrap}>
              <Text style={styles.rpText}>Rp</Text>
              <TextInput
                style={styles.modalInput}
                keyboardType="numeric"
                value={depositAmountStr}
                onChangeText={(t) => setDepositAmountStr(t.replace(/[^0-9]/g, ''))}
                placeholder="0"
                placeholderTextColor="#9f123950"
                autoFocus
              />
            </View>

            {/* Quick chips */}
            <View style={styles.chipRow}>
              <TouchableOpacity
                style={styles.chip}
                onPress={() => handleQuickAddDeposit(1000000)}
                accessibilityRole="button"
                accessibilityLabel="Tambah 1 juta rupiah"
              >
                <Text style={styles.chipText}>+1 Juta</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.chip}
                onPress={() => handleQuickAddDeposit(2000000)}
                accessibilityRole="button"
                accessibilityLabel="Tambah 2 juta rupiah"
              >
                <Text style={styles.chipText}>+2 Juta</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.chip}
                onPress={() => handleQuickAddDeposit(5000000)}
                accessibilityRole="button"
                accessibilityLabel="Tambah 5 juta rupiah"
              >
                <Text style={styles.chipText}>+5 Juta</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chip, { backgroundColor: '#fee2e2' }]}
                onPress={() => setDepositAmountStr('')}
                accessibilityRole="button"
                accessibilityLabel="Hapus nominal"
              >
                <Text style={[styles.chipText, { color: '#ba1a1a' }]}>Hapus</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Keterangan Pemasukan</Text>
            <TextInput
              style={styles.textInputRegular}
              placeholder="Gaji Bulanan, Bonus, dll"
              placeholderTextColor="#9f123960"
              value={depositNote}
              onChangeText={setDepositNote}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setDepositPocketId(null)}
                accessibilityRole="button"
                accessibilityLabel="Batal tambah saldo"
              >
                <Text style={styles.modalCancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalDepositConfirmBtn}
                onPress={handleSaveDeposit}
                accessibilityRole="button"
                accessibilityLabel="Tambah saldo"
              >
                <Text style={styles.modalDepositConfirmText}>Tambah Saldo 💰</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Sesuaikan Saldo Manual */}
      <Modal visible={!!editPocketId} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Sesuaikan Saldo Kantong</Text>
            <Text style={styles.modalSub}>
              Masukkan total saldo riil fisik terbaru:
            </Text>

            <View style={styles.inputWrap}>
              <Text style={styles.rpText}>Rp</Text>
              <TextInput
                style={styles.modalInput}
                keyboardType="numeric"
                value={editBalanceStr}
                onChangeText={(t) => setEditBalanceStr(t.replace(/[^0-9]/g, ''))}
                autoFocus
              />
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setEditPocketId(null)}
                accessibilityRole="button"
                accessibilityLabel="Batal sesuaikan saldo"
              >
                <Text style={styles.modalCancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveEdit}
                accessibilityRole="button"
                accessibilityLabel="Simpan penyesuaian saldo"
              >
                <Text style={styles.modalSaveText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Tambah Kantong Baru */}
      <Modal visible={showAddModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Tambah Kantong Baru</Text>

            <TextInput
              style={styles.textInputRegular}
              placeholder="Nama Kantong (cth: Mandiri, OVO, Kas)"
              placeholderTextColor="#9f123960"
              value={newPocketName}
              onChangeText={setNewPocketName}
              autoFocus
            />

            <View style={[styles.inputWrap, { marginTop: 10 }]}>
              <Text style={styles.rpText}>Rp</Text>
              <TextInput
                style={styles.modalInput}
                keyboardType="numeric"
                placeholder="Saldo Awal"
                placeholderTextColor="#9f123960"
                value={newPocketBalStr}
                onChangeText={(t) => setNewPocketBalStr(t.replace(/[^0-9]/g, ''))}
              />
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowAddModal(false)}
                accessibilityRole="button"
                accessibilityLabel="Batal tambah kantong"
              >
                <Text style={styles.modalCancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleCreatePocket}
                accessibilityRole="button"
                accessibilityLabel="Simpan kantong baru"
              >
                <Text style={styles.modalSaveText}>Tambah</Text>
              </TouchableOpacity>
            </View>
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: SakuraTheme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: SakuraTheme.borderRadius.full,
  },
  addBtnText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  scrollContent: {
    padding: 16,
  },
  totalCard: {
    backgroundColor: SakuraTheme.colors.primaryDark,
    borderRadius: SakuraTheme.borderRadius.xl,
    padding: 18,
    marginBottom: 20,
  },
  totalLabel: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    color: '#ffd5dd',
    marginBottom: 4,
  },
  totalVal: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
  },
  totalPrefix: {
    color: '#ffd5dd',
    fontSize: 16,
  },
  totalHint: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    color: '#ffd5dd',
    marginTop: 6,
  },
  sectionTitle: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 15,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
    marginBottom: 10,
  },
  list: {
    gap: 10,
  },
  pocketCard: {
    padding: 14,
  },
  pocketRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: SakuraTheme.colors.cardSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pocketName: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
  },
  pocketBal: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  actionCol: {
    alignItems: 'flex-end',
    gap: 6,
  },
  depositActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#047857',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  depositActionText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  editBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  editBtnText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    color: SakuraTheme.colors.textMuted,
  },
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
    borderRadius: SakuraTheme.borderRadius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: SakuraTheme.colors.border,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  modalTitle: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '700',
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
    marginTop: 10,
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SakuraTheme.colors.cardSubtle,
    borderWidth: 1,
    borderColor: SakuraTheme.colors.border,
    borderRadius: SakuraTheme.borderRadius.md,
    paddingHorizontal: 12,
  },
  rpText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: '#047857',
    marginRight: 6,
  },
  modalInput: {
    flex: 1,
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 18,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
    paddingVertical: 10,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  chip: {
    flex: 1,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  chipText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  textInputRegular: {
    backgroundColor: SakuraTheme.colors.cardSubtle,
    borderWidth: 1,
    borderColor: SakuraTheme.colors.border,
    borderRadius: SakuraTheme.borderRadius.md,
    padding: 10,
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 13,
    color: SakuraTheme.colors.textPrimary,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: SakuraTheme.borderRadius.md,
    backgroundColor: SakuraTheme.colors.cardSubtle,
    alignItems: 'center',
  },
  modalCancelText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    color: SakuraTheme.colors.textSecondary,
  },
  modalSaveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: SakuraTheme.borderRadius.md,
    backgroundColor: SakuraTheme.colors.primary,
    alignItems: 'center',
  },
  modalSaveText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  modalDepositConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: SakuraTheme.borderRadius.md,
    backgroundColor: '#047857',
    alignItems: 'center',
  },
  modalDepositConfirmText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});
