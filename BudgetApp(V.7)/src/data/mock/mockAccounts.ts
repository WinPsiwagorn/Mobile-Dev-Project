export type Account = {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  currency: string;
  lastTransaction: string;
  accountNumber: string;
  color: string;
};

export const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'Main Account',
    type: 'checking',
    balance: 5425.50,
    currency: 'USD',
    lastTransaction: '2024-03-05',
    accountNumber: '**** 1234',
    color: '#4A90E2',
  },
  {
    id: '2',
    name: 'Savings',
    type: 'savings',
    balance: 12750.75,
    currency: 'USD',
    lastTransaction: '2024-03-01',
    accountNumber: '**** 5678',
    color: '#50C878',
  },
  {
    id: '3',
    name: 'Credit Card',
    type: 'credit',
    balance: -1250.00,
    currency: 'USD',
    lastTransaction: '2024-03-03',
    accountNumber: '**** 9012',
    color: '#FF6B6B',
  },
  {
    id: '4',
    name: 'Investment Portfolio',
    type: 'investment',
    balance: 25000.00,
    currency: 'USD',
    lastTransaction: '2024-02-28',
    accountNumber: '**** 3456',
    color: '#FFB156',
  },
]; 