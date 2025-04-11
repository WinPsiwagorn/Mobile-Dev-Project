"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, AlertCircle } from "lucide-react"
import { TransactionItem } from "@/components/transaction-item"

export function DashboardView() {
  // Mock data - in a real app, this would come from Firebase
  const totalBalance = 45250.75
  const savingsBalance = 32500.5
  const expensesBalance = 12750.25
  const upcomingBills = [
    { id: "1", name: "Rent", amount: 15000, dueDate: "2025-04-05", status: "upcoming" },
    { id: "2", name: "Electricity", amount: 2500, dueDate: "2025-04-10", status: "upcoming" },
    { id: "3", name: "Internet", amount: 799, dueDate: "2025-04-15", status: "upcoming" },
  ]
  const recentTransactions = [
    { id: "1", title: "Grocery Shopping", amount: -1250, date: "2025-03-28", category: "Food", icon: "shopping-cart" },
    { id: "2", title: "Salary", amount: 45000, date: "2025-03-25", category: "Income", icon: "credit-card" },
    { id: "3", title: "Restaurant", amount: -850, date: "2025-03-23", category: "Food", icon: "coffee" },
  ]

  // Format currency in Thai Baht
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-4 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Hello, John</h1>
          <p className="text-muted-foreground">Welcome back to your finances</p>
        </div>
        <Button variant="outline" size="icon">
          <AlertCircle className="h-5 w-5" />
        </Button>
      </div>

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
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

