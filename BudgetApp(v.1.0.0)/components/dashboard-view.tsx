"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, AlertCircle } from "lucide-react"
import { TransactionItem } from "@/components/transaction-item"
import { useFirestore } from "@/context/firestore-context"
import { useAuth } from "@/context/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

export function DashboardView() {
  const { user } = useAuth()
  const { transactions, transactionsLoading, transactionsError, accounts, accountsLoading, bills, billsLoading } =
    useFirestore()

  const [totalBalance, setTotalBalance] = useState(0)
  const [savingsBalance, setSavingsBalance] = useState(0)
  const [expensesBalance, setExpensesBalance] = useState(0)

  // Calculate balances
  useEffect(() => {
    if (accounts.length > 0) {
      const total = accounts.reduce((sum, account) => sum + account.balance, 0)
      const savings = accounts
        .filter((account) => account.type === "savings")
        .reduce((sum, account) => sum + account.balance, 0)
      const expenses = accounts
        .filter((account) => account.type === "expense")
        .reduce((sum, account) => sum + account.balance, 0)

      setTotalBalance(total)
      setSavingsBalance(savings)
      setExpensesBalance(expenses)
    }
  }, [accounts])

  // Get upcoming bills
  const upcomingBills = bills
    .filter((bill) => bill.status === "pending")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3)

  // Get recent transactions
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  // Format currency in Thai Baht
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const isLoading = transactionsLoading || accountsLoading || billsLoading

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Hello, {user?.displayName || "User"}</h1>
          <p className="text-muted-foreground">Welcome back to your finances</p>
        </div>
        <Button variant="outline" size="icon">
          <AlertCircle className="h-5 w-5" />
        </Button>
      </div>

      {transactionsError && (
        <Alert variant="destructive">
          <AlertDescription>{transactionsError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Balance</CardDescription>
          <CardTitle className="text-3xl">{formatCurrency(totalBalance)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-2 rounded-full">
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Savings</p>
                <p className="font-medium">{formatCurrency(savingsBalance)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-red-100 p-2 rounded-full">
                <ArrowDownRight className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expenses</p>
                <p className="font-medium">{formatCurrency(expensesBalance)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Upcoming Bills</CardTitle>
            <Button variant="ghost" size="sm">
              View all
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {upcomingBills.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No upcoming bills. Add bills to track your payments.
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingBills.map((bill) => (
                <div key={bill.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{bill.name}</p>
                    <p className="text-sm text-muted-foreground">Due {new Date(bill.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(bill.amount)}</p>
                    <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Upcoming
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Monthly Budget</CardTitle>
            <Button variant="ghost" size="sm">
              Details
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Food & Drinks</span>
                <span className="text-sm font-medium">65%</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Transportation</span>
                <span className="text-sm font-medium">40%</span>
              </div>
              <Progress value={40} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Entertainment</span>
                <span className="text-sm font-medium">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="ghost" size="sm">
              View all
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No transactions yet. Add your first transaction to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
