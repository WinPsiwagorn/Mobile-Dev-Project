export type Category = {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  budget?: number;
  spent?: number;
};

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Salary',
    type: 'income',
    icon: 'wallet',
    color: '#4ADE80',
  },
  {
    id: '2',
    name: 'Freelance',
    type: 'income',
    icon: 'laptop',
    color: '#3B82F6',
  },
  {
    id: '3',
    name: 'Food & Dining',
    type: 'expense',
    icon: 'restaurant',
    color: '#FF6B6B',
    budget: 500,
    spent: 350.75,
  },
  {
    id: '4',
    name: 'Transportation',
    type: 'expense',
    icon: 'car',
    color: '#FFB156',
    budget: 300,
    spent: 225.50,
  },
  {
    id: '5',
    name: 'Shopping',
    type: 'expense',
    icon: 'cart',
    color: '#A78BFA',
    budget: 400,
    spent: 275.25,
  },
  {
    id: '6',
    name: 'Bills & Utilities',
    type: 'expense',
    icon: 'receipt',
    color: '#64748B',
    budget: 800,
    spent: 650.00,
  },
  {
    id: '7',
    name: 'Entertainment',
    type: 'expense',
    icon: 'film',
    color: '#EC4899',
    budget: 200,
    spent: 150.00,
  },
]; 