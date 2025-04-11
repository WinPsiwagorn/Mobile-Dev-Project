export interface Transaction {
  id?: string
  userId: string
  title: string
  amount: number
  type: "income" | "expense"
  category: string
  date: string
  description?: string
  account?: string
  tags?: string[]
  createdAt?: Date
  updatedAt?: Date
}

export interface Category {
  id?: string
  userId: string
  name: string
  type: "income" | "expense"
  icon: string
  color: string
  budget?: number
  spent?: number
  createdAt?: Date
  updatedAt?: Date
}

export interface Account {
  id?: string
  userId: string
  name: string
  type: string
  balance: number
  currency: string
  icon?: string
  color?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Bill {
  id?: string
  userId: string
  name: string
  amount: number
  dueDate: string
  category: string
  status: "paid" | "pending" | "overdue"
  recurring: boolean
  frequency?: "monthly" | "quarterly" | "yearly" | "weekly"
  automaticPayment: boolean
  paymentMethod?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface FirestoreError {
  code: string
  message: string
}
