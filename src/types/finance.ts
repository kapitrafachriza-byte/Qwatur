export type TransactionType = 'expense' | 'income' | 'transfer';

export type PocketType = 'bank' | 'ewallet' | 'cash';

export interface Category {
  id: string;
  name: string;
  icon: string;
  budgetLimit: number;
  currentSpent: number;
  color: string;
  type: 'expense' | 'income';
}

export interface Pocket {
  id: string;
  name: string;
  type: PocketType;
  balance: number;
  accountNumber?: string;
  icon: string;
  color: string;
}

export interface GoalPocket {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  icon: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  pocketId: string;
  toPocketId?: string; // for transfer
  note: string;
  date: string; // ISO string
  isQuickLog?: boolean;
}

export interface QuickLogItem {
  id: string;
  title: string;
  amount: number;
  categoryId: string;
  pocketId: string;
  icon: string;
}

export interface UserProfile {
  name: string;
  tagline: string;
  email: string;
  syncStatus: string;
  currency: string;
  budgetResetDay: number; // e.g. 25
  budgetAlertThreshold: number; // e.g. 80 (80%)
  dailyReminderEnabled: boolean;
  dailyReminderTime: string; // "20:00"
  biometricEnabled: boolean;
  hideBalance: boolean;
}
