import { create } from 'zustand';

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

interface FinanceState {
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
}

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Makanan & Minuman', icon: 'restaurant', color: '#f43f5e', type: 'expense' },
  { id: 'cat-2', name: 'Bensin & Transport', icon: 'directions-car', color: '#0ea5e9', type: 'expense' },
  { id: 'cat-3', name: 'Belanja Harian', icon: 'shopping-bag', color: '#ec4899', type: 'expense' },
  { id: 'cat-4', name: 'Tagihan & Pulsa', icon: 'receipt-long', color: '#8b5cf6', type: 'expense' },
  { id: 'cat-5', name: 'Kopi & Nongkrong', icon: 'local-cafe', color: '#d97706', type: 'expense' },
  { id: 'cat-6', name: 'Gaji Bulanan', icon: 'payments', color: '#10b981', type: 'income' },
  { id: 'cat-7', name: 'Pemasukan Lain', icon: 'account-balance-wallet', color: '#059669', type: 'income' },
];

const INITIAL_POCKETS: Pocket[] = [
  { id: 'poc-1', name: 'Bank BCA', balance: 5000000, icon: 'account-balance', color: '#005c55' },
  { id: 'poc-2', name: 'GoPay / e-Wallet', balance: 850000, icon: 'qr-code-scanner', color: '#0284c7' },
  { id: 'poc-3', name: 'Uang Tunai (Kas)', balance: 350000, icon: 'payments', color: '#059669' },
];

const INITIAL_QUICK_LOGS: QuickLogItem[] = [
  { id: 'ql-1', title: 'Kopi Susu', amount: 20000, categoryId: 'cat-5', pocketId: 'poc-2', icon: 'local-cafe' },
  { id: 'ql-2', title: 'Bensin Motor', amount: 30000, categoryId: 'cat-2', pocketId: 'poc-2', icon: 'local-gas-station' },
  { id: 'ql-3', title: 'Makan Siang', amount: 25000, categoryId: 'cat-1', pocketId: 'poc-3', icon: 'restaurant' },
  { id: 'ql-4', title: 'Parkir', amount: 5000, categoryId: 'cat-2', pocketId: 'poc-3', icon: 'local-parking' },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
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

export const useFinanceStore = create<FinanceState>((set, get) => ({
  pockets: INITIAL_POCKETS,
  categories: INITIAL_CATEGORIES,
  quickLogs: INITIAL_QUICK_LOGS,
  transactions: INITIAL_TRANSACTIONS,

  addTransaction: (tx) => {
    const newTx: Transaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      amount: tx.amount,
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
              ? Math.max(0, pocket.balance - tx.amount)
              : pocket.balance + tx.amount;
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

      const nextPockets = state.pockets.map((pocket) => {
        if (pocket.id === tx.pocketId) {
          const revertedBal =
            tx.type === 'expense'
              ? pocket.balance + tx.amount
              : Math.max(0, pocket.balance - tx.amount);
          return { ...pocket, balance: revertedBal };
        }
        return pocket;
      });

      return {
        transactions: state.transactions.filter((t) => t.id !== id),
        pockets: nextPockets,
      };
    });
  },

  executeQuickLog: (quickLogId) => {
    const item = get().quickLogs.find((q) => q.id === quickLogId);
    if (!item) return null;

    const newTx: Transaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      amount: item.amount,
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
            balance: Math.max(0, pocket.balance - item.amount),
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
    const finalNote = note || 'Gaji Bulanan / Tambah Saldo';
    const finalCatId = categoryId || 'cat-6';

    const newTx: Transaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      amount,
      type: 'income',
      categoryId: finalCatId,
      pocketId,
      note: finalNote,
      date: new Date().toISOString(),
    };

    set((state) => {
      const nextPockets = state.pockets.map((p) =>
        p.id === pocketId ? { ...p, balance: p.balance + amount } : p
      );
      return {
        transactions: [newTx, ...state.transactions],
        pockets: nextPockets,
      };
    });
  },

  updatePocketBalance: (pocketId, newBalance) => {
    set((state) => ({
      pockets: state.pockets.map((p) =>
        p.id === pocketId ? { ...p, balance: Math.max(0, newBalance) } : p
      ),
    }));
  },

  addPocket: (name, initialBalance, icon = 'account-balance-wallet') => {
    const newPocket: Pocket = {
      id: `poc-${Date.now()}`,
      name,
      balance: Math.max(0, initialBalance),
      icon,
      color: '#be185d',
    };
    set((state) => ({ pockets: [...state.pockets, newPocket] }));
  },
}));
