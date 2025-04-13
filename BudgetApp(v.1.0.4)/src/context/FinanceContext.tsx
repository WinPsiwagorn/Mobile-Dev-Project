"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext"
import { financeService, Transaction, Category, Account, Budget } from "../utils/financeService"

// Context type
interface FinanceContextType {
  transactions: Transaction[]
  categories: Category[]
  accounts: Account[]
  budget: Budget
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<void>
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  addCategory: (category: Omit<Category, "id">) => Promise<void>
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  addAccount: (account: Omit<Account, "id">) => Promise<void>
  updateAccount: (id: string, account: Partial<Account>) => Promise<void>
  deleteAccount: (id: string) => Promise<void>
  updateBudget: (budget: Partial<Budget>) => Promise<void>
  calculateBudgetStats: () => Promise<void>
  isLoading: boolean
  getBudgetStats: () => Promise<{
    totalSpent: number
    remaining: number
    dailyAverage: number
  }>
}

// Create context
const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

// Provider component
export const FinanceProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [budget, setBudget] = useState<Budget>({
    total: 0,
    spent: 0,
    remaining: 0,
    categories: []
  })
  const [isLoading, setIsLoading] = useState(true)

  // Load data from storage when user changes
  useEffect(() => {
    const loadData = async () => {
      console.log("FinanceProvider: Loading data for user:", user?.id)
      
      if (!user) {
        console.log("FinanceProvider: No user, clearing data")
        setTransactions([])
        setCategories([])
        setAccounts([])
        setBudget({
          total: 0,
          spent: 0,
          remaining: 0,
          categories: []
        })
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        console.log("FinanceProvider: Starting to load data")
        
        // Load transactions
        const storedTransactions = await financeService.getTransactions()
        console.log("FinanceProvider: Loaded transactions:", storedTransactions.length)
        setTransactions(storedTransactions)
        
        // Load categories
        const storedCategories = await financeService.getCategories()
        console.log("FinanceProvider: Loaded categories:", storedCategories.length)
        setCategories(storedCategories)
        
        // Load accounts
        const storedAccounts = await financeService.getAccounts()
        console.log("FinanceProvider: Loaded accounts:", storedAccounts.length)
        setAccounts(storedAccounts)
        
        // Load budget
        const storedBudget = await financeService.getBudget()
        console.log("FinanceProvider: Loaded budget:", storedBudget)
        setBudget(storedBudget)
      } catch (error) {
        console.error("FinanceProvider: Error loading finance data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [user])

  // Transaction methods
  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    try {
      console.log("FinanceContext: Adding transaction:", transaction);
      
      // Get the selected account
      const accountIndex = accounts.findIndex(acc => acc.id === transaction.accountId);
      if (accountIndex === -1) {
        console.error("FinanceContext: Account not found:", transaction.accountId);
        return;
      }

      // Create new transaction with ID
      const newTransaction = await financeService.addTransaction(transaction);
      console.log("FinanceContext: Transaction added:", newTransaction);
      
      // Update transactions list
      setTransactions(prev => [...prev, newTransaction]);

      // Update account balance
      const account = accounts[accountIndex];
      const balanceChange = transaction.type === "income" ? transaction.amount : -transaction.amount;
      const newBalance = account.balance + balanceChange;
      
      console.log("FinanceContext: Updating account balance:", {
        accountId: account.id,
        oldBalance: account.balance,
        change: balanceChange,
        newBalance
      });

      // Update account in storage and state
      await financeService.updateAccount(account.id, { balance: newBalance });
      const updatedAccounts = [...accounts];
      updatedAccounts[accountIndex] = {
        ...account,
        balance: newBalance
      };
      setAccounts(updatedAccounts);
      
      // Recalculate budget stats
      await calculateBudgetStats();
    } catch (error) {
      console.error("FinanceContext: Error adding transaction:", error);
      throw error;
    }
  };

  const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
    const updatedTransaction = await financeService.updateTransaction(id, transaction)
    if (!updatedTransaction) return
    
    setTransactions(prev => 
      prev.map(t => t.id === id ? updatedTransaction : t)
    )
    
    // Recalculate budget stats
    await calculateBudgetStats()
  }

  const deleteTransaction = async (id: string) => {
    const success = await financeService.deleteTransaction(id)
    if (!success) return
    
    setTransactions(prev => prev.filter(t => t.id !== id))
    
    // Recalculate budget stats
    await calculateBudgetStats()
  }

  // Category methods
  const addCategory = async (category: Omit<Category, "id">) => {
    const newCategory = await financeService.addCategory(category)
    setCategories(prev => [...prev, newCategory])
    
    // Update budget
    const updatedBudget = await financeService.getBudget()
    setBudget(updatedBudget)
  }

  const updateCategory = async (id: string, category: Partial<Category>) => {
    const updatedCategory = await financeService.updateCategory(id, category)
    if (!updatedCategory) return
    
    setCategories(prev => 
      prev.map(c => c.id === id ? updatedCategory : c)
    )
    
    // Update budget
    const updatedBudget = await financeService.getBudget()
    setBudget(updatedBudget)
  }

  const deleteCategory = async (id: string) => {
    const success = await financeService.deleteCategory(id)
    if (!success) return
    
    setCategories(prev => prev.filter(c => c.id !== id))
    
    // Update budget
    const updatedBudget = await financeService.getBudget()
    setBudget(updatedBudget)
  }

  // Account methods
  const addAccount = async (account: Omit<Account, "id">) => {
    try {
      console.log("FinanceProvider: Adding account:", account)
      const newAccount = await financeService.addAccount(account)
      console.log("FinanceProvider: Account added successfully:", newAccount)
      setAccounts(prev => [...prev, newAccount])
    } catch (error) {
      console.error("FinanceProvider: Error adding account:", error)
      throw error
    }
  }

  const updateAccount = async (id: string, account: Partial<Account>) => {
    const updatedAccount = await financeService.updateAccount(id, account)
    if (!updatedAccount) return
    
    setAccounts(prev => 
      prev.map(a => a.id === id ? updatedAccount : a)
    )
  }

  const deleteAccount = async (id: string) => {
    const success = await financeService.deleteAccount(id)
    if (!success) return
    
    setAccounts(prev => prev.filter(a => a.id !== id))
  }

  // Budget methods
  const updateBudget = async (newBudgetData: Partial<Budget>) => {
    const updatedBudget = await financeService.updateBudget(newBudgetData)
    setBudget(updatedBudget)
  }

  // Calculate budget statistics
  const calculateBudgetStats = async () => {
    const updatedBudget = await financeService.calculateBudgetStats()
    setBudget(updatedBudget)
    setCategories(updatedBudget.categories)
  }

  const getBudgetStats = () => {
    return financeService.getBudgetStats()
  }

  // Context value
  const value = {
    transactions,
    categories,
    accounts,
    budget,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    addAccount,
    updateAccount,
    deleteAccount,
    updateBudget,
    calculateBudgetStats,
    isLoading,
    getBudgetStats
  }

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  )
}

// Hook to use the finance context
export const useFinance = () => {
  const context = useContext(FinanceContext)
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider")
  }
  return context
} 