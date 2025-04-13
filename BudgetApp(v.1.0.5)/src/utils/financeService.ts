import { LocalStorage, STORAGE_KEYS } from "./storage"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Simple function to generate a unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}

// Types
export interface Transaction {
  id: string
  type: "income" | "expense"
  category: string
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

export interface Bill {
  id: string
  name: string
  amount: number
  dueDate: string
  category: string
  status: "pending" | "paid" | "overdue"
  recurring: boolean
  frequency?: "monthly" | "quarterly" | "yearly"
  automaticPayment: boolean
  paymentMethod: string
  paymentAccountId: string
  paidAt?: string
  icon?: string
}

export interface Budget {
  total: number
  spent: number
  remaining: number
  categories: Category[]
}

class FinanceService {
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
    return (await LocalStorage.getData(STORAGE_KEYS.TRANSACTIONS)) || []
  }

  async addTransaction(transaction: Omit<Transaction, "id">): Promise<Transaction> {
    const transactions = await this.getTransactions()
    const newTransaction = {
      ...transaction,
      id: generateId(),
    }
    await LocalStorage.saveData(STORAGE_KEYS.TRANSACTIONS, [...transactions, newTransaction])
    return newTransaction
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
    console.log("FinanceService: Getting accounts")
    const accounts = await LocalStorage.getData(STORAGE_KEYS.ACCOUNTS) || []
    console.log("FinanceService: Retrieved accounts:", accounts)
    return accounts
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
    console.log("FinanceService: Updating account:", id, account)
    const accounts = await this.getAccounts()
    const index = accounts.findIndex((a) => a.id === id)
    if (index === -1) {
      console.log("FinanceService: Account not found")
      return null
    }
    
    const updatedAccount = { ...accounts[index], ...account }
    accounts[index] = updatedAccount
    console.log("FinanceService: Saving updated accounts:", accounts)
    await LocalStorage.saveData(STORAGE_KEYS.ACCOUNTS, accounts)
    console.log("FinanceService: Account updated successfully")
    return updatedAccount
  }

  async deleteAccount(id: string): Promise<boolean> {
    console.log("FinanceService: Deleting account:", id)
    const accounts = await this.getAccounts()
    const filteredAccounts = accounts.filter((a) => a.id !== id)
    console.log("FinanceService: Saving filtered accounts:", filteredAccounts)
    await LocalStorage.saveData(STORAGE_KEYS.ACCOUNTS, filteredAccounts)
    console.log("FinanceService: Account deleted successfully")
    return true
  }

  // Bills
  async getBills(): Promise<Bill[]> {
    try {
      console.log("FinanceService: Getting bills")
      const bills = await LocalStorage.getData(STORAGE_KEYS.BILLS) || []
      console.log("FinanceService: Retrieved bills:", bills)
      return bills
    } catch (error) {
      console.error("FinanceService: Error getting bills:", error)
      return []
    }
  }

  async addBill(bill: Omit<Bill, "id">): Promise<Bill> {
    console.log("FinanceService: Adding bill:", bill)
    const bills = await this.getBills()
    const newBill = {
      ...bill,
      id: generateId(),
    }
    console.log("FinanceService: Created new bill:", newBill)
    const updatedBills = [...bills, newBill]
    console.log("FinanceService: Saving updated bills:", updatedBills)
    await LocalStorage.saveData(STORAGE_KEYS.BILLS, updatedBills)
    console.log("FinanceService: Bill saved successfully")
    return newBill
  }

  async updateBill(id: string, bill: Partial<Bill>): Promise<Bill | null> {
    console.log("FinanceService: Updating bill:", id, bill)
    const bills = await this.getBills()
    const index = bills.findIndex((b) => b.id === id)
    if (index === -1) {
      console.log("FinanceService: Bill not found")
      return null
    }
    
    const updatedBill = { ...bills[index], ...bill }
    bills[index] = updatedBill
    console.log("FinanceService: Saving updated bills:", bills)
    await LocalStorage.saveData(STORAGE_KEYS.BILLS, bills)
    console.log("FinanceService: Bill updated successfully")
    return updatedBill
  }

  async deleteBill(id: string): Promise<boolean> {
    console.log("FinanceService: Deleting bill:", id)
    const bills = await this.getBills()
    const filteredBills = bills.filter((b) => b.id !== id)
    console.log("FinanceService: Saving filtered bills:", filteredBills)
    await LocalStorage.saveData(STORAGE_KEYS.BILLS, filteredBills)
    console.log("FinanceService: Bill deleted successfully")
    return true
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

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
} 