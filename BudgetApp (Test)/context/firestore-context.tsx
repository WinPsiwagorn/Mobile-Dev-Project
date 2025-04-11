"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import {
  type Transaction,
  type Category,
  type Account,
  type Bill,
  subscribeToUserTransactions,
  subscribeToUserCategories,
  subscribeToUserAccounts,
  subscribeToUserBills,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  addCategory,
  updateCategory,
  deleteCategory,
  addAccount,
  updateAccount,
  deleteAccount,
  addBill,
  updateBill,
  deleteBill,
} from "@/lib/firestore"

interface FirestoreContextType {
  // Data
  transactions: Transaction[]
  categories: Category[]
  accounts: Account[]
  bills: Bill[]

  // Loading states
  transactionsLoading: boolean
  categoriesLoading: boolean
  accountsLoading: boolean
  billsLoading: boolean

  // Error states
  transactionsError: string | null
  categoriesError: string | null
  accountsError: string | null
  billsError: string | null

  // Transaction operations
  addTransaction: (transaction: Omit<Transaction, "id" | "userId">) => Promise<string>
  updateTransaction: (id: string, transaction: Partial<Omit<Transaction, "id" | "userId">>) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>

  // Category operations
  addCategory: (category: Omit<Category, "id" | "userId">) => Promise<string>
  updateCategory: (id: string, category: Partial<Omit<Category, "id" | "userId">>) => Promise<void>
  deleteCategory: (id: string) => Promise<void>

  // Account operations
  addAccount: (account: Omit<Account, "id" | "userId">) => Promise<string>
  updateAccount: (id: string, account: Partial<Omit<Account, "id" | "userId">>) => Promise<void>
  deleteAccount: (id: string) => Promise<void>

  // Bill operations
  addBill: (bill: Omit<Bill, "id" | "userId">) => Promise<string>
  updateBill: (id: string, bill: Partial<Omit<Bill, "id" | "userId">>) => Promise<void>
  deleteBill: (id: string) => Promise<void>
}

const FirestoreContext = createContext<FirestoreContextType | undefined>(undefined)

export function FirestoreProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  // Data states
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [bills, setBills] = useState<Bill[]>([])

  // Loading states
  const [transactionsLoading, setTransactionsLoading] = useState(true)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [accountsLoading, setAccountsLoading] = useState(true)
  const [billsLoading, setBillsLoading] = useState(true)

  // Error states
  const [transactionsError, setTransactionsError] = useState<string | null>(null)
  const [categoriesError, setCategoriesError] = useState<string | null>(null)
  const [accountsError, setAccountsError] = useState<string | null>(null)
  const [billsError, setBillsError] = useState<string | null>(null)

  // Subscribe to data changes when user is authenticated
  useEffect(() => {
    if (!user) {
      // Reset data when user logs out
      setTransactions([])
      setCategories([])
      setAccounts([])
      setBills([])
      return
    }

    // Subscribe to transactions
    setTransactionsLoading(true)
    const unsubscribeTransactions = subscribeToUserTransactions(user.uid, (data) => {
      setTransactions(data)
      setTransactionsLoading(false)
      setTransactionsError(null)
    })

    // Subscribe to categories
    setCategoriesLoading(true)
    const unsubscribeCategories = subscribeToUserCategories(user.uid, (data) => {
      setCategories(data)
      setCategoriesLoading(false)
      setCategoriesError(null)
    })

    // Subscribe to accounts
    setAccountsLoading(true)
    const unsubscribeAccounts = subscribeToUserAccounts(user.uid, (data) => {
      setAccounts(data)
      setAccountsLoading(false)
      setAccountsError(null)
    })

    // Subscribe to bills
    setBillsLoading(true)
    const unsubscribeBills = subscribeToUserBills(user.uid, (data) => {
      setBills(data)
      setBillsLoading(false)
      setBillsError(null)
    })

    // Cleanup subscriptions
    return () => {
      unsubscribeTransactions()
      unsubscribeCategories()
      unsubscribeAccounts()
      unsubscribeBills()
    }
  }, [user])

  // Transaction operations
  const addNewTransaction = async (transaction: Omit<Transaction, "id" | "userId">): Promise<string> => {
    if (!user) throw new Error("User not authenticated")

    try {
      return await addTransaction({
        ...transaction,
        userId: user.uid,
      })
    } catch (error) {
      setTransactionsError((error as Error).message)
      throw error
    }
  }

  const updateExistingTransaction = async (
    id: string,
    transaction: Partial<Omit<Transaction, "id" | "userId">>,
  ): Promise<void> => {
    if (!user) throw new Error("User not authenticated")

    try {
      await updateTransaction(id, transaction)
    } catch (error) {
      setTransactionsError((error as Error).message)
      throw error
    }
  }

  const removeTransaction = async (id: string): Promise<void> => {
    if (!user) throw new Error("User not authenticated")

    try {
      await deleteTransaction(id)
    } catch (error) {
      setTransactionsError((error as Error).message)
      throw error
    }
  }

  // Category operations
  const addNewCategory = async (category: Omit<Category, "id" | "userId">): Promise<string> => {
    if (!user) throw new Error("User not authenticated")

    try {
      return await addCategory({
        ...category,
        userId: user.uid,
      })
    } catch (error) {
      setCategoriesError((error as Error).message)
      throw error
    }
  }

  const updateExistingCategory = async (
    id: string,
    category: Partial<Omit<Category, "id" | "userId">>,
  ): Promise<void> => {
    if (!user) throw new Error("User not authenticated")

    try {
      await updateCategory(id, category)
    } catch (error) {
      setCategoriesError((error as Error).message)
      throw error
    }
  }

  const removeCategory = async (id: string): Promise<void> => {
    if (!user) throw new Error("User not authenticated")

    try {
      await deleteCategory(id)
    } catch (error) {
      setCategoriesError((error as Error).message)
      throw error
    }
  }

  // Account operations
  const addNewAccount = async (account: Omit<Account, "id" | "userId">): Promise<string> => {
    if (!user) throw new Error("User not authenticated")

    try {
      return await addAccount({
        ...account,
        userId: user.uid,
      })
    } catch (error) {
      setAccountsError((error as Error).message)
      throw error
    }
  }

  const updateExistingAccount = async (id: string, account: Partial<Omit<Account, "id" | "userId">>): Promise<void> => {
    if (!user) throw new Error("User not authenticated")

    try {
      await updateAccount(id, account)
    } catch (error) {
      setAccountsError((error as Error).message)
      throw error
    }
  }

  const removeAccount = async (id: string): Promise<void> => {
    if (!user) throw new Error("User not authenticated")

    try {
      await deleteAccount(id)
    } catch (error) {
      setAccountsError((error as Error).message)
      throw error
    }
  }

  // Bill operations
  const addNewBill = async (bill: Omit<Bill, "id" | "userId">): Promise<string> => {
    if (!user) throw new Error("User not authenticated")

    try {
      return await addBill({
        ...bill,
        userId: user.uid,
      })
    } catch (error) {
      setBillsError((error as Error).message)
      throw error
    }
  }

  const updateExistingBill = async (id: string, bill: Partial<Omit<Bill, "id" | "userId">>): Promise<void> => {
    if (!user) throw new Error("User not authenticated")

    try {
      await updateBill(id, bill)
    } catch (error) {
      setBillsError((error as Error).message)
      throw error
    }
  }

  const removeBill = async (id: string): Promise<void> => {
    if (!user) throw new Error("User not authenticated")

    try {
      await deleteBill(id)
    } catch (error) {
      setBillsError((error as Error).message)
      throw error
    }
  }

  const value = {
    // Data
    transactions,
    categories,
    accounts,
    bills,

    // Loading states
    transactionsLoading,
    categoriesLoading,
    accountsLoading,
    billsLoading,

    // Error states
    transactionsError,
    categoriesError,
    accountsError,
    billsError,

    // Transaction operations
    addTransaction: addNewTransaction,
    updateTransaction: updateExistingTransaction,
    deleteTransaction: removeTransaction,

    // Category operations
    addCategory: addNewCategory,
    updateCategory: updateExistingCategory,
    deleteCategory: removeCategory,

    // Account operations
    addAccount: addNewAccount,
    updateAccount: updateExistingAccount,
    deleteAccount: removeAccount,

    // Bill operations
    addBill: addNewBill,
    updateBill: updateExistingBill,
    deleteBill: removeBill,
  }

  return <FirestoreContext.Provider value={value}>{children}</FirestoreContext.Provider>
}

export function useFirestore() {
  const context = useContext(FirestoreContext)
  if (context === undefined) {
    throw new Error("useFirestore must be used within a FirestoreProvider")
  }
  return context
}
