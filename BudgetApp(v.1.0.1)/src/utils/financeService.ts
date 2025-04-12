import { LocalStorage, STORAGE_KEYS } from "./storage"

// Simple function to generate a unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}

// Types
export interface Transaction {
  id: string
  type: "income" | "expense"
  category: string
  customCategoryDescription?: string  // Optional field for custom category description
  amount: number
  date: string
  description: string
  icon: string
  accountId?: string
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  budget: number
  spent: number
}

export interface Account {
  id: string
  name: string
  type: "general" | "savings"
  balance: number
  icon: string
  color: string
  goalBalance?: number
}

export interface Budget {
  total: number
  spent: number
  remaining: number
  categories: Category[]
}

export class FinanceService {
  private static instance: FinanceService

  private constructor() {}

  static getInstance(): FinanceService {
    if (!FinanceService.instance) {
      FinanceService.instance = new FinanceService()
    }
    return FinanceService.instance
  }

  // Transactions
  async getTransactions(): Promise<Transaction[]> {
    console.log("FinanceService: Getting transactions");
    const transactions = await LocalStorage.getData(STORAGE_KEYS.TRANSACTIONS) || [];
    console.log("FinanceService: Retrieved transactions:", transactions.length);
    return transactions;
  }

  async addTransaction(transaction: Omit<Transaction, "id">): Promise<Transaction> {
    console.log("FinanceService: Adding transaction:", transaction);
    const transactions = await this.getTransactions();
    const newTransaction = {
      ...transaction,
      id: generateId(),
    };
    const updatedTransactions = [...transactions, newTransaction];
    console.log("FinanceService: Saving updated transactions:", {
      oldCount: transactions.length,
      newCount: updatedTransactions.length,
      newTransaction
    });
    await LocalStorage.saveData(STORAGE_KEYS.TRANSACTIONS, updatedTransactions);
    return newTransaction;
  }

  async updateTransaction(id: string, transaction: Partial<Transaction>): Promise<Transaction | null> {
    const transactions = await this.getTransactions()
    const index = transactions.findIndex((t) => t.id === id)
    if (index === -1) return null
    
    const updatedTransaction = { ...transactions[index], ...transaction }
    transactions[index] = updatedTransaction
    await LocalStorage.saveData(STORAGE_KEYS.TRANSACTIONS, transactions)
    return updatedTransaction
  }

  async deleteTransaction(id: string): Promise<boolean> {
    const transactions = await this.getTransactions()
    const filteredTransactions = transactions.filter((t) => t.id !== id)
    await LocalStorage.saveData(STORAGE_KEYS.TRANSACTIONS, filteredTransactions)
    return true
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return (await LocalStorage.getData(STORAGE_KEYS.CATEGORIES)) || []
  }

  async addCategory(category: Omit<Category, "id">): Promise<Category> {
    const categories = await this.getCategories()
    const newCategory = {
      ...category,
      id: generateId(),
    }
    await LocalStorage.saveData(STORAGE_KEYS.CATEGORIES, [...categories, newCategory])
    return newCategory
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<Category | null> {
    const categories = await this.getCategories()
    const index = categories.findIndex((c) => c.id === id)
    if (index === -1) return null
    
    const updatedCategory = { ...categories[index], ...category }
    categories[index] = updatedCategory
    await LocalStorage.saveData(STORAGE_KEYS.CATEGORIES, categories)
    return updatedCategory
  }

  async deleteCategory(id: string): Promise<boolean> {
    const categories = await this.getCategories()
    const filteredCategories = categories.filter((c) => c.id !== id)
    await LocalStorage.saveData(STORAGE_KEYS.CATEGORIES, filteredCategories)
    return true
  }

  // Accounts
  async getAccounts(): Promise<Account[]> {
    console.log("FinanceService: Getting accounts");
    const accounts = await LocalStorage.getData(STORAGE_KEYS.ACCOUNTS) || [];
    console.log("FinanceService: Retrieved accounts:", {
      count: accounts.length,
      accounts: accounts.map(a => ({ id: a.id, name: a.name, balance: a.balance }))
    });
    return accounts;
  }

  async addAccount(account: Omit<Account, "id">): Promise<Account> {
    console.log("FinanceService: Adding account:", account)
    const accounts = await this.getAccounts()
    const newAccount = {
      ...account,
      id: generateId(),
    }
    console.log("FinanceService: Created new account:", newAccount)
    const updatedAccounts = [...accounts, newAccount]
    console.log("FinanceService: Saving updated accounts:", updatedAccounts)
    await LocalStorage.saveData(STORAGE_KEYS.ACCOUNTS, updatedAccounts)
    console.log("FinanceService: Account saved successfully")
    return newAccount
  }

  async updateAccount(id: string, account: Partial<Account>): Promise<Account | null> {
    console.log("FinanceService: Updating account:", { id, updates: account });
    const accounts = await this.getAccounts();
    const index = accounts.findIndex((a) => a.id === id);
    if (index === -1) {
      console.error("FinanceService: Account not found:", id);
      return null;
    }
    
    const updatedAccount = { ...accounts[index], ...account };
    accounts[index] = updatedAccount;
    console.log("FinanceService: Saving updated account:", {
      id: updatedAccount.id,
      name: updatedAccount.name,
      oldBalance: accounts[index].balance,
      newBalance: updatedAccount.balance
    });
    await LocalStorage.saveData(STORAGE_KEYS.ACCOUNTS, accounts);
    return updatedAccount;
  }

  async deleteAccount(id: string): Promise<boolean> {
    try {
      console.log("FinanceService: Deleting account:", id);
      
      // Get current accounts and categories
      const accounts = await this.getAccounts();
      const categories = await this.getCategories();
      const transactions = await this.getTransactions();
      
      // Filter out the deleted account
      const updatedAccounts = accounts.filter(a => a.id !== id);
      
      // Filter out categories and transactions associated with the deleted account
      const updatedCategories = categories.filter(c => c.accountId !== id);
      const updatedTransactions = transactions.filter(t => t.accountId !== id);
      
      // Save the updated data
      await LocalStorage.saveData(STORAGE_KEYS.ACCOUNTS, updatedAccounts);
      await LocalStorage.saveData(STORAGE_KEYS.CATEGORIES, updatedCategories);
      await LocalStorage.saveData(STORAGE_KEYS.TRANSACTIONS, updatedTransactions);
      
      console.log("FinanceService: Account, related categories and transactions deleted successfully");
      return true;
    } catch (error) {
      console.error("FinanceService: Error deleting account:", error);
      return false;
    }
  }

  // Budget
  async getBudget(): Promise<Budget> {
    return (await LocalStorage.getData(STORAGE_KEYS.BUDGETS)) || {
      total: 0,
      spent: 0,
      remaining: 0,
      categories: []
    }
  }

  async updateBudget(budget: Partial<Budget>): Promise<Budget> {
    const currentBudget = await this.getBudget()
    const updatedBudget = { ...currentBudget, ...budget }
    await LocalStorage.saveData(STORAGE_KEYS.BUDGETS, updatedBudget)
    return updatedBudget
  }

  async calculateBudgetStats(): Promise<Budget> {
    const transactions = await this.getTransactions()
    const categories = await this.getCategories()
    
    const totalSpent = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)
    
    const categorySpent = categories.map(category => {
      const spent = transactions
        .filter(t => t.category === category.name && t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0)
      return { ...category, spent }
    })
    
    const budget = await this.getBudget()
    const updatedBudget = {
      ...budget,
      spent: totalSpent,
      remaining: budget.total - totalSpent,
      categories: categorySpent
    }
    
    await LocalStorage.saveData(STORAGE_KEYS.BUDGETS, updatedBudget)
    return updatedBudget
  }

  getBudgetStats() {
    return {
      totalSpent: 0,
      remaining: 0,
      dailyAverage: 0
    }
  }
}

// Export the singleton instance
export const financeService = FinanceService.getInstance() 