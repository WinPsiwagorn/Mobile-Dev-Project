import { theme } from '../theme';

export const mockTransactions = [
  {
    id: '1',
    type: 'expense' as const,
    category: 'Shopping',
    amount: 89.99,
    date: '2024-03-20',
    description: 'Grocery shopping',
    icon: 'cart-outline',
  },
  {
    id: '2',
    type: 'income' as const,
    category: 'Salary',
    amount: 3500.00,
    date: '2024-03-19',
    description: 'Monthly salary',
    icon: 'cash-outline',
  },
  {
    id: '3',
    type: 'expense' as const,
    category: 'Entertainment',
    amount: 15.99,
    date: '2024-03-18',
    description: 'Netflix subscription',
    icon: 'film-outline',
  },
];

export const mockCategories = [
  {
    id: '1',
    name: 'Shopping',
    icon: 'cart-outline',
    color: theme.colors.primary,
    budget: 500,
    spent: 324.50,
  },
  {
    id: '2',
    name: 'Entertainment',
    icon: 'film-outline',
    color: theme.colors.secondary,
    budget: 200,
    spent: 89.99,
  },
  {
    id: '3',
    name: 'Food & Drinks',
    icon: 'restaurant-outline',
    color: theme.colors.success,
    budget: 400,
    spent: 286.75,
  },
];

export const mockAccounts = [
  {
    id: '1',
    name: 'Main Account',
    type: 'Checking',
    balance: 5842.50,
    icon: 'wallet-outline',
    color: theme.colors.primary,
  },
  {
    id: '2',
    name: 'Savings',
    type: 'Savings',
    balance: 12450.75,
    icon: 'save-outline',
    color: theme.colors.success,
  },
  {
    id: '3',
    name: 'Credit Card',
    type: 'Credit',
    balance: -1250.00,
    icon: 'card-outline',
    color: theme.colors.error,
  },
];

export const mockBudget = {
  total: 2000,
  spent: 1250.75,
  remaining: 749.25,
  categories: mockCategories,
}; 