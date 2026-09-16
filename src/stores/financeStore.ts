import { create } from 'zustand';
import { Category, GoalPocket, Pocket, QuickLogItem, Transaction, UserProfile } from '@/types/finance';

interface FinanceState {
  profile: UserProfile;
  categories: Category[];
  pockets: Pocket[];
  goals: GoalPocket[];
  quickLogs: QuickLogItem[];
  transactions: Transaction[];

  // Actions
  toggleHideBalance: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'date'> & { date?: string }) => void;
  deleteTransaction: (id: string) => void;
  executeQuickLog: (quickLogId: string) => void;
  addPocket: (pocket: Omit<Pocket, 'id'>) => void;
  updateGoalProgress: (goalId: string, addedAmount: number) => void;

  // Computed / Helpers
  getTotalBalance: () => number;
  getTotalIncomeThisMonth: () => number;
  getTotalExpenseThisMonth: () => number;
  getNetCashflow: () => number;
}

const INITIAL_PROFILE: UserProfile = {
  name: 'Sarah Pramudita',
  tagline: 'Keuangan tenang, masa depan lapang',
  email: 'sarah.pramudita@email.com',
  syncStatus: 'Tersinkronisasi ke Google Drive',
  currency: 'IDR',
  budgetResetDay: 25,
  budgetAlertThreshold: 80,
  dailyReminderEnabled: true,
  dailyReminderTime: '20:00',
  biometricEnabled: true,
  hideBalance: false,
};

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Makanan & Minuman', icon: 'restaurant', budgetLimit: 3000000, currentSpent: 2150000, color: '#f43f5e', type: 'expense' },
  { id: 'cat-2', name: 'Transportasi', icon: 'directions-car', budgetLimit: 1500000, currentSpent: 850000, color: '#0ea5e9', type: 'expense' },
  { id: 'cat-3', name: 'Tagihan & Utilitas', icon: 'receipt-long', budgetLimit: 2500000, currentSpent: 2100000, color: '#8b5cf6', type: 'expense' },
  { id: 'cat-4', name: 'Belanja & Hiburan', icon: 'shopping-bag', budgetLimit: 2000000, currentSpent: 1700000, color: '#ec4899', type: 'expense' },
  { id: 'cat-5', name: 'Kesehatan', icon: 'favorite', budgetLimit: 1000000, currentSpent: 350000, color: '#10b981', type: 'expense' },
  { id: 'cat-6', name: 'Investasi', icon: 'trending-up', budgetLimit: 3000000, currentSpent: 2000000, color: '#059669', type: 'expense' },
  { id: 'cat-7', name: 'Gaji Pokok', icon: 'account-balance-wallet', budgetLimit: 0, currentSpent: 0, color: '#10b981', type: 'income' },
  { id: 'cat-8', name: 'Bonus / Freelance', icon: 'payments', budgetLimit: 0, currentSpent: 0, color: '#34d399', type: 'income' },
];

const INITIAL_POCKETS: Pocket[] = [
  { id: 'poc-1', name: 'Bank BCA', type: 'bank', balance: 8450000, accountNumber: '•••• 7890', icon: 'account-balance', color: '#005c55' },
  { id: 'poc-2', name: 'GoPay / QRIS', type: 'ewallet', balance: 1250000, accountNumber: '0812-••••-7890', icon: 'qr-code-scanner', color: '#0284c7' },
  { id: 'poc-3', name: 'Bank Mandiri', type: 'bank', balance: 12800000, accountNumber: '•••• 1234', icon: 'credit-card', color: '#1d4ed8' },
  { id: 'poc-4', name: 'Uang Tunai', type: 'cash', balance: 450000, accountNumber: 'Dompet Fisik', icon: 'payments', color: '#059669' },
];

const INITIAL_GOALS: GoalPocket[] = [
  { id: 'goal-1', title: 'Dana Darurat (6 Bulan)', targetAmount: 30000000, currentAmount: 21000000, deadline: 'Desember 2026', category: 'Keamanan Finansial', icon: 'shield' },
  { id: 'goal-2', title: 'Liburan ke Jepang', targetAmount: 25000000, currentAmount: 12500000, deadline: 'Maret 2027', category: 'Impian & Rekreasi', icon: 'flight-takeoff' },
  { id: 'goal-3', title: 'Upgrade Laptop M-Series', targetAmount: 18000000, currentAmount: 14400000, deadline: 'November 2026', category: 'Produktivitas', icon: 'laptop-mac' },
];

const INITIAL_QUICK_LOGS: QuickLogItem[] = [
  { id: 'ql-1', title: 'Kopi Susu Aren', amount: 20000, categoryId: 'cat-1', pocketId: 'poc-2', icon: 'local-cafe' },
  { id: 'ql-2', title: 'Bensin Pertamax', amount: 50000, categoryId: 'cat-2', pocketId: 'poc-2', icon: 'local-gas-station' },
  { id: 'ql-3', title: 'Makan Siang', amount: 35000, categoryId: 'cat-1', pocketId: 'poc-1', icon: 'restaurant' },
  { id: 'ql-4', title: 'Parkir Mall', amount: 10000, categoryId: 'cat-2', pocketId: 'poc-4', icon: 'local-parking' },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    amount: 35000,
    type: 'expense',
    categoryId: 'cat-1',
    pocketId: 'poc-2',
    note: 'Kopi & Croissant pagi',
    date: new Date().toISOString(),
    isQuickLog: true,
  },
  {
    id: 'tx-2',
    amount: 50000,
    type: 'expense',
    categoryId: 'cat-2',
    pocketId: 'poc-2',
    note: 'Bensin motor kantor',
    date: new Date(Date.now() - 3600000 * 3).toISOString(),
    isQuickLog: true,
  },
  {
    id: 'tx-3',
    amount: 125000,
    type: 'expense',
    categoryId: 'cat-1',
    pocketId: 'poc-1',
    note: 'Makan Siang Tim',
    date: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'tx-4',
    amount: 15000000,
    type: 'income',
    categoryId: 'cat-7',
    pocketId: 'poc-1',
    note: 'Gaji Bulanan PT Digital Asia',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'tx-5',
    amount: 350000,
    type: 'expense',
    categoryId: 'cat-3',
    pocketId: 'poc-1',
    note: 'Tagihan Listrik PLN & Wi-Fi',
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'tx-6',
    amount: 450000,
    type: 'expense',
    categoryId: 'cat-4',
    pocketId: 'poc-2',
    note: 'Belanja Skincare & Buku',
    date: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'tx-7',
    amount: 2500000,
    type: 'income',
    categoryId: 'cat-8',
    pocketId: 'poc-2',
    note: 'Honor Desain Grafis Proyek',
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export const useFinanceStore = create<FinanceState>((set, get) => ({
  profile: INITIAL_PROFILE,
  categories: INITIAL_CATEGORIES,
  pockets: INITIAL_POCKETS,
  goals: INITIAL_GOALS,
  quickLogs: INITIAL_QUICK_LOGS,
  transactions: INITIAL_TRANSACTIONS,

  toggleHideBalance: () => {
    set((state) => ({
      profile: { ...state.profile, hideBalance: !state.profile.hideBalance },
    }));
  },

  updateProfile: (updates) => {
    set((state) => ({
      profile: { ...state.profile, ...updates },
    }));
  },

  addTransaction: (tx) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date: tx.date || new Date().toISOString(),
    };

    set((state) => {
      // Adjust pocket balance
      const updatedPockets = state.pockets.map((pocket) => {
        if (tx.type === 'expense' && pocket.id === tx.pocketId) {
          return { ...pocket, balance: Math.max(0, pocket.balance - tx.amount) };
        }
        if (tx.type === 'income' && pocket.id === tx.pocketId) {
          return { ...pocket, balance: pocket.balance + tx.amount };
        }
        if (tx.type === 'transfer') {
          if (pocket.id === tx.pocketId) {
            return { ...pocket, balance: Math.max(0, pocket.balance - tx.amount) };
          }
          if (pocket.id === tx.toPocketId) {
            return { ...pocket, balance: pocket.balance + tx.amount };
          }
        }
        return pocket;
      });

      // Update category current spent
      const updatedCategories = state.categories.map((cat) => {
        if (cat.id === tx.categoryId && tx.type === 'expense') {
          return { ...cat, currentSpent: cat.currentSpent + tx.amount };
        }
        return cat;
      });

      return {
        transactions: [newTx, ...state.transactions],
        pockets: updatedPockets,
        categories: updatedCategories,
      };
    });
  },

  deleteTransaction: (id) => {
    set((state) => ({
      transactions: state.transactions.filter((tx) => tx.id !== id),
    }));
  },

  executeQuickLog: (quickLogId) => {
    const item = get().quickLogs.find((q) => q.id === quickLogId);
    if (!item) return;

    get().addTransaction({
      amount: item.amount,
      type: 'expense',
      categoryId: item.categoryId,
      pocketId: item.pocketId,
      note: `1-Tap: ${item.title}`,
      isQuickLog: true,
    });
  },

  addPocket: (pocketData) => {
    const newPocket: Pocket = {
      ...pocketData,
      id: `poc-${Date.now()}`,
    };
    set((state) => ({ pockets: [...state.pockets, newPocket] }));
  },

  updateGoalProgress: (goalId, addedAmount) => {
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === goalId ? { ...g, currentAmount: Math.min(g.targetAmount, g.currentAmount + addedAmount) } : g
      ),
    }));
  },

  getTotalBalance: () => {
    return get().pockets.reduce((sum, p) => sum + p.balance, 0);
  },

  getTotalIncomeThisMonth: () => {
    return get()
      .transactions.filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  },

  getTotalExpenseThisMonth: () => {
    return get()
      .transactions.filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  },

  getNetCashflow: () => {
    return get().getTotalIncomeThisMonth() - get().getTotalExpenseThisMonth();
  },
}));
