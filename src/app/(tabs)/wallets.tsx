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

export default function WalletsScreen() {
  const pockets = useFinanceStore((state) => state.pockets);
  const updatePocketBalance = useFinanceStore((state) => state.updatePocketBalance);
  const addPocket = useFinanceStore((state) => state.addPocket);

  const [editPocketId, setEditPocketId] = useState<string | null>(null);
  const [editBalanceStr, setEditBalanceStr] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPocketName, setNewPocketName] = useState('');
  const [newPocketBalStr, setNewPocketBalStr] = useState('');

  const totalBalance = useMemo(
    () => pockets.reduce((sum, p) => sum + p.balance, 0),
    [pockets]
  );

  const handleOpenEdit = (id: string, currentBal: number) => {
    setEditPocketId(id);
    setEditBalanceStr(currentBal.toString());
  };

  const handleSaveEdit = () => {
    if (!editPocketId) return;
    const newBal = parseInt(editBalanceStr, 10) || 0;
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
    addPocket(newPocketName.trim(), initialBal);
    setShowAddModal(false);
    setNewPocketName('');
    setNewPocketBalStr('');
    Alert.alert('Sukses', 'Kantong baru berhasil ditambahkan!');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>Kantong & Dompet 🌸</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
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

        <Text style={styles.sectionTitle}>Daftar Kantong</Text>

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

                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => handleOpenEdit(poc.id, poc.balance)}
                >
                  <MaterialIcons name="edit" size={18} color={SakuraTheme.colors.primary} />
                  <Text style={styles.editBtnText}>Ubah</Text>
                </TouchableOpacity>
              </View>
            </SakuraCard>
          ))}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Modal Ubah Saldo */}
      <Modal visible={!!editPocketId} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Sesuaikan Saldo Kantong</Text>
            <Text style={styles.modalSub}>
              Masukkan nominal saldo fisik atau mutasi terbaru:
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
              >
                <Text style={styles.modalCancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveEdit}>
                <Text style={styles.modalSaveText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Tambah Kantong */}
      <Modal visible={showAddModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Tambah Kantong Baru</Text>

            <TextInput
              style={styles.textInputRegular}
              placeholder="Nama Kantong (cth: Mandiri, OVO, Dompet)"
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
              >
                <Text style={styles.modalCancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={handleCreatePocket}>
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
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: SakuraTheme.colors.cardSubtle,
    borderWidth: 1,
    borderColor: SakuraTheme.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: SakuraTheme.borderRadius.md,
  },
  editBtnText: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: SakuraTheme.colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
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
  modalTitle: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: SakuraTheme.colors.textPrimary,
    marginBottom: 6,
  },
  modalSub: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    color: SakuraTheme.colors.textMuted,
    marginBottom: 14,
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
    color: SakuraTheme.colors.primary,
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
  textInputRegular: {
    backgroundColor: SakuraTheme.colors.cardSubtle,
    borderWidth: 1,
    borderColor: SakuraTheme.colors.border,
    borderRadius: SakuraTheme.borderRadius.md,
    padding: 12,
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 14,
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
});
