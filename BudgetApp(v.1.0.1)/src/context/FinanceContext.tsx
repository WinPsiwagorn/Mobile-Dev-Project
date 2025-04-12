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
      
      // Add transaction to storage
      const newTransaction = await financeService.addTransaction(transaction);
      if (!newTransaction) {
        throw new Error("Failed to add transaction");
      }
      
      // Update account balance in storage
      const account = accounts.find(a => a.id === transaction.accountId);
      if (!account) {
        throw new Error("Account not found");
      }
      
      const balanceChange = transaction.type === "income" ? transaction.amount : -transaction.amount;
      const newBalance = account.balance + balanceChange;
      
      await financeService.updateAccount(account.id, { balance: newBalance });
      
      // Refresh all data to ensure consistency
      const [storedAccounts, storedTransactions] = await Promise.all([
        financeService.getAccounts(),
        financeService.getTransactions()
      ]);
      
      setAccounts(storedAccounts);
      setTransactions(storedTransactions);
      
      // Recalculate budget stats
      await calculateBudgetStats();
      
      console.log("FinanceContext: Transaction added and data refreshed");
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
      console.log("FinanceContext: Adding new account:", account);
      
      // Add the account to storage first
      const newAccount = await financeService.addAccount(account);
      if (!newAccount) {
        throw new Error("Failed to add account to storage");
      }
      
      console.log("FinanceContext: Account added to storage successfully:", newAccount);
      
      // Update state with the new account
      setAccounts(prev => {
        const updated = [...prev, newAccount];
        console.log("FinanceContext: Updated accounts list:", updated);
        return updated;
      });

      // Refresh all related data to ensure consistency
      const refreshData = async () => {
        const [storedAccounts, storedCategories, storedTransactions] = await Promise.all([
          financeService.getAccounts(),
          financeService.getCategories(),
          financeService.getTransactions()
        ]);
        
        setAccounts(storedAccounts);
        setCategories(storedCategories);
        setTransactions(storedTransactions);
        console.log("FinanceContext: Data refreshed after adding account");
      };
      
      refreshData();
      return newAccount;
    } catch (error) {
      console.error("FinanceContext: Error adding account:", error);
      throw error;
    }
  };

  const updateAccount = async (id: string, account: Partial<Account>) => {
    const updatedAccount = await financeService.updateAccount(id, account)
    if (!updatedAccount) return
    
    setAccounts(prev => 
      prev.map(a => a.id === id ? updatedAccount : a)
    )
  }

  const deleteAccount = async (id: string) => {
    try {
      console.log("FinanceContext: Starting account deletion:", id);
      
      // Delete from storage first
      const success = await financeService.deleteAccount(id);
      
      if (success) {
        // Then update all state at once
        const [storedAccounts, storedCategories, storedTransactions] = await Promise.all([
          financeService.getAccounts(),
          financeService.getCategories(),
          financeService.getTransactions()
        ]);
        
        setAccounts(storedAccounts);
        setCategories(storedCategories);
        setTransactions(storedTransactions);
        console.log("FinanceContext: Account and related data deleted, state updated");
      } else {
        console.error("FinanceContext: Failed to delete account");
      }
      
      return success;
    } catch (error) {
      console.error("FinanceContext: Error deleting account:", error);
      return false;
    }
  };

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