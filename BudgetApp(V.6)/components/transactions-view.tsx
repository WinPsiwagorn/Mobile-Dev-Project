"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, MinusCircle, ArrowUpDown, Receipt, CreditCard, ShoppingCart, Coffee, Home } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function TransactionsView() {
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [transactionType, setTransactionType] = useState("expense")
  const [date, setDate] = useState<Date>(new Date())

  // Mock data - in a real app, this would come from Firebase
  const recentTransactions = [
    { id: "1", title: "Grocery Shopping", amount: -1250, date: "2025-03-28", category: "Food", icon: "shopping-cart" },
    { id: "2", title: "Salary", amount: 45000, date: "2025-03-25", category: "Income", icon: "credit-card" },
    { id: "3", title: "Restaurant", amount: -850, date: "2025-03-23", category: "Food", icon: "coffee" },
    { id: "4", title: "Rent", amount: -15000, date: "2025-03-20", category: "Housing", icon: "home" },
    { id: "5", title: "Freelance Work", amount: 12000, date: "2025-03-18", category: "Income", icon: "credit-card" },
  ]

  // Format currency in Thai Baht
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(Math.abs(amount))
  }

  // Get icon based on transaction type
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "shopping-cart":
        return <ShoppingCart className="h-5 w-5" />
      case "credit-card":
        return <CreditCard className="h-5 w-5" />
      case "coffee":
        return <Coffee className="h-5 w-5" />
      case "home":
        return <Home className="h-5 w-5" />
      default:
        return <Receipt className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-4 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Dialog open={showAddTransaction} onOpenChange={setShowAddTransaction}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
              <DialogDescription>Record your income or expense</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <RadioGroup defaultValue="expense" className="grid grid-cols-2 gap-4" onValueChange={setTransactionType}>
                <div>
                  <RadioGroupItem value="expense" id="expense" className="peer sr-only" />
                  <Label
                    htmlFor="expense"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <MinusCircle className="mb-3 h-6 w-6 text-red-500" />
                    Expense
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="income" id="income" className="peer sr-only" />
                  <Label
                    htmlFor="income"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <PlusCircle className="mb-3 h-6 w-6 text-green-500" />
                    Income
                  </Label>
                </div>
              </RadioGroup>

              <div className="grid gap-2">
                <Label htmlFor="amount">Amount (฿)</Label>
                <Input id="amount" type="number" placeholder="0" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {transactionType === "expense" ? (
                      <>
                        <SelectItem value="food">Food & Drinks</SelectItem>
                        <SelectItem value="transportation">Transportation</SelectItem>
                        <SelectItem value="housing">Housing</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="shopping">Shopping</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="salary">Salary</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                        <SelectItem value="investment">Investment</SelectItem>
                        <SelectItem value="gift">Gift</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="account">Account</Label>
                <Select>
                  <SelectTrigger id="account">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily-expenses">Daily Expenses</SelectItem>
                    <SelectItem value="savings">Emergency Fund</SelectItem>
                    <SelectItem value="travel">Travel Fund</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      {date ? format(date, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Add notes about this transaction" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddTransaction(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowAddTransaction(false)}>Save Transaction</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Transactions</CardTitle>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="income">Income Only</SelectItem>
                <SelectItem value="expense">Expenses Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${transaction.amount > 0 ? "bg-green-100" : "bg-red-100"}`}>
                    {getIcon(transaction.icon)}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.title}</p>
                    <p className="text-sm text-muted-foreground">{transaction.category}</p>
                    <p className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                    {transaction.amount > 0 ? "+" : "-"} {formatCurrency(transaction.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            View All Transactions
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

