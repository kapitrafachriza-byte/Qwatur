import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'expense' | 'income';
}

export interface Pocket {
  id: string;
  name: string;
  balance: number;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'expense' | 'income';
  categoryId: string;
  pocketId: string;
  note: string;
  date: string; // ISO string
}

export interface QuickLogItem {
  id: string;
  title: string;
  amount: number;
  categoryId: string;
  pocketId: string;
  icon: string;
}

export interface FinanceState {
  pockets: Pocket[];
  categories: Category[];
  quickLogs: QuickLogItem[];
  transactions: Transaction[];

  // Actions
  addTransaction: (tx: {
    amount: number;
    type: 'expense' | 'income';
    categoryId: string;
    pocketId: string;
    note?: string;
  }) => void;
  deleteTransaction: (id: string) => void;
  executeQuickLog: (quickLogId: string) => Transaction | null;
  depositToPocket: (
    pocketId: string,
    amount: number,
    note?: string,
    categoryId?: string
  ) => void;
  updatePocketBalance: (pocketId: string, newBalance: number) => void;
  addPocket: (name: string, initialBalance: number, icon?: string) => void;
  editPocket: (pocketId: string, name: string) => void;
  deletePocket: (pocketId: string) => boolean;
  resetAllData: () => void;
  clearTransactions: () => void;
}

export const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
};

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Makanan & Minuman', icon: 'restaurant', color: '#f43f5e', type: 'expense' },
  { id: 'cat-2', name: 'Bensin & Transport', icon: 'directions-car', color: '#0ea5e9', type: 'expense' },
  { id: 'cat-3', name: 'Belanja Harian', icon: 'shopping-bag', color: '#ec4899', type: 'expense' },
  { id: 'cat-4', name: 'Tagihan & Pulsa', icon: 'receipt-long', color: '#8b5cf6', type: 'expense' },
  { id: 'cat-5', name: 'Kopi & Nongkrong', icon: 'local-cafe', color: '#d97706', type: 'expense' },
  { id: 'cat-6', name: 'Gaji Bulanan', icon: 'payments', color: '#10b981', type: 'income' },
  { id: 'cat-7', name: 'Pemasukan Lain', icon: 'account-balance-wallet', color: '#059669', type: 'income' },
];

export const INITIAL_POCKETS: Pocket[] = [
  { id: 'poc-1', name: 'Bank BCA', balance: 5000000, icon: 'account-balance', color: '#005c55' },
  { id: 'poc-2', name: 'GoPay / e-Wallet', balance: 850000, icon: 'qr-code-scanner', color: '#0284c7' },
  { id: 'poc-3', name: 'Uang Tunai (Kas)', balance: 350000, icon: 'payments', color: '#059669' },
];

export const INITIAL_QUICK_LOGS: QuickLogItem[] = [
  { id: 'ql-1', title: 'Kopi Susu', amount: 20000, categoryId: 'cat-5', pocketId: 'poc-2', icon: 'local-cafe' },
  { id: 'ql-2', title: 'Bensin Motor', amount: 30000, categoryId: 'cat-2', pocketId: 'poc-2', icon: 'local-gas-station' },
  { id: 'ql-3', title: 'Makan Siang', amount: 25000, categoryId: 'cat-1', pocketId: 'poc-3', icon: 'restaurant' },
  { id: 'ql-4', title: 'Parkir', amount: 5000, categoryId: 'cat-2', pocketId: 'poc-3', icon: 'local-parking' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    amount: 25000,
    type: 'expense',
    categoryId: 'cat-1',
    pocketId: 'poc-3',
    note: 'Makan Siang Nasi Padang',
    date: new Date().toISOString(),
  },
  {
    id: 'tx-2',
    amount: 30000,
    type: 'expense',
    categoryId: 'cat-2',
    pocketId: 'poc-2',
    note: 'Bensin Motor',
    date: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'tx-3',
    amount: 5000000,
    type: 'income',
    categoryId: 'cat-6',
    pocketId: 'poc-1',
    note: 'Gaji Bulanan',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      pockets: INITIAL_POCKETS,
      categories: INITIAL_CATEGORIES,
      quickLogs: INITIAL_QUICK_LOGS,
      transactions: INITIAL_TRANSACTIONS,

      addTransaction: (tx) => {
        const safeAmount = Math.max(0, Number.isFinite(tx.amount) ? tx.amount : 0);
        const newTx: Transaction = {
          id: generateId('tx'),
          amount: safeAmount,
          type: tx.type,
          categoryId: tx.categoryId,
          pocketId: tx.pocketId,
          note: tx.note || (tx.type === 'expense' ? 'Pengeluaran' : 'Pemasukan'),
          date: new Date().toISOString(),
        };

        set((state) => {
          const nextPockets = state.pockets.map((pocket) => {
            if (pocket.id === tx.pocketId) {
              const newBal =
                tx.type === 'expense'
                  ? Math.max(0, pocket.balance - safeAmount)
                  : Math.max(0, pocket.balance + safeAmount);
              return { ...pocket, balance: newBal };
            }
            return pocket;
          });

          return {
            transactions: [newTx, ...state.transactions],
            pockets: nextPockets,
          };
        });
      },

      deleteTransaction: (id) => {
        set((state) => {
          const tx = state.transactions.find((t) => t.id === id);
          if (!tx) return state;

          const pocketExists = state.pockets.some((p) => p.id === tx.pocketId);
          const nextPockets = pocketExists
            ? state.pockets.map((pocket) => {
                if (pocket.id === tx.pocketId) {
                  const revertedBal =
                    tx.type === 'expense'
                      ? pocket.balance + tx.amount
                      : pocket.balance - tx.amount;
                  return { ...pocket, balance: Math.max(0, revertedBal) };
                }
                return pocket;
              })
            : state.pockets;

          return {
            transactions: state.transactions.filter((t) => t.id !== id),
            pockets: nextPockets,
          };
        });
      },

      executeQuickLog: (quickLogId) => {
        const item = get().quickLogs.find((q) => q.id === quickLogId);
        if (!item) return null;

        const safeAmount = Math.max(0, Number.isFinite(item.amount) ? item.amount : 0);
        const newTx: Transaction = {
          id: generateId('tx'),
          amount: safeAmount,
          type: 'expense',
          categoryId: item.categoryId,
          pocketId: item.pocketId,
          note: `1-Tap: ${item.title}`,
          date: new Date().toISOString(),
        };

        set((state) => {
          const nextPockets = state.pockets.map((pocket) => {
            if (pocket.id === item.pocketId) {
              return {
                ...pocket,
                balance: Math.max(0, pocket.balance - safeAmount),
              };
            }
            return pocket;
          });

          return {
            transactions: [newTx, ...state.transactions],
            pockets: nextPockets,
          };
        });

        return newTx;
      },

      depositToPocket: (pocketId, amount, note, categoryId) => {
        const safeAmount = Math.max(0, Number.isFinite(amount) ? amount : 0);
        const finalNote = note || 'Gaji Bulanan / Tambah Saldo';
        const finalCatId = categoryId || 'cat-6';

        const newTx: Transaction = {
          id: generateId('tx'),
          amount: safeAmount,
          type: 'income',
          categoryId: finalCatId,
          pocketId,
          note: finalNote,
          date: new Date().toISOString(),
        };

        set((state) => {
          const nextPockets = state.pockets.map((p) =>
            p.id === pocketId ? { ...p, balance: Math.max(0, p.balance + safeAmount) } : p
          );
          return {
            transactions: [newTx, ...state.transactions],
            pockets: nextPockets,
          };
        });
      },

      updatePocketBalance: (pocketId, newBalance) => {
        const safeBalance = Math.max(0, Number.isFinite(newBalance) ? newBalance : 0);
        set((state) => {
          const pocket = state.pockets.find((p) => p.id === pocketId);
          if (!pocket) return state;

          const diff = safeBalance - pocket.balance;
          if (diff === 0) return state;

          const adjustmentTx: Transaction = {
            id: generateId('tx'),
            amount: Math.abs(diff),
            type: diff > 0 ? 'income' : 'expense',
            categoryId: diff > 0 ? 'cat-7' : 'cat-1',
            pocketId,
            note: `Penyesuaian Saldo (${diff > 0 ? '+' : ''}Rp ${diff.toLocaleString('id-ID')})`,
            date: new Date().toISOString(),
          };

          return {
            pockets: state.pockets.map((p) =>
              p.id === pocketId ? { ...p, balance: safeBalance } : p
            ),
            transactions: [adjustmentTx, ...state.transactions],
          };
        });
      },

      addPocket: (name, initialBalance, icon = 'account-balance-wallet') => {
        const safeBalance = Math.max(0, Number.isFinite(initialBalance) ? initialBalance : 0);
        const newPocket: Pocket = {
          id: generateId('poc'),
          name: name.trim() || 'Kantong Baru',
          balance: safeBalance,
          icon,
          color: '#be185d',
        };
        set((state) => ({ pockets: [...state.pockets, newPocket] }));
      },

      editPocket: (pocketId, name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        set((state) => ({
          pockets: state.pockets.map((p) =>
            p.id === pocketId ? { ...p, name: trimmed } : p
          ),
        }));
      },

      deletePocket: (pocketId) => {
        const currentPockets = get().pockets;
        if (currentPockets.length <= 1) {
          return false;
        }

        set((state) => {
          const nextPockets = state.pockets.filter((p) => p.id !== pocketId);
          const fallbackPocketId = nextPockets[0].id;

          // Reassign quick logs that used this pocket
          const nextQuickLogs = state.quickLogs.map((q) =>
            q.pocketId === pocketId ? { ...q, pocketId: fallbackPocketId } : q
          );

          return {
            pockets: nextPockets,
            quickLogs: nextQuickLogs,
          };
        });

        return true;
      },

      resetAllData: () => {
        set((state) => ({
          transactions: [],
          pockets: state.pockets.map((p) => ({ ...p, balance: 0 })),
        }));
      },

      clearTransactions: () => {
        set({ transactions: [] });
      },
    }),
    {
      name: 'qwatur-finance-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        pockets: state.pockets,
        categories: state.categories,
        quickLogs: state.quickLogs,
        transactions: state.transactions,
      }),
      merge: (persistedState, currentState) => {
        const typedPersisted = persistedState as Partial<FinanceState> | undefined;
        return {
          ...currentState,
          ...typedPersisted,
          pockets: typedPersisted?.pockets && typedPersisted.pockets.length > 0 ? typedPersisted.pockets : currentState.pockets,
          categories: typedPersisted?.categories && typedPersisted.categories.length > 0 ? typedPersisted.categories : currentState.categories,
          quickLogs: typedPersisted?.quickLogs && typedPersisted.quickLogs.length > 0 ? typedPersisted.quickLogs : currentState.quickLogs,
          transactions: typedPersisted?.transactions ?? currentState.transactions,
        };
      },
    }
  )
);
