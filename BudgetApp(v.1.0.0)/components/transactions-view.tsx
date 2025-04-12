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
import { useFirestore } from "@/context/firestore-context"
import { useAuth } from "@/context/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export function TransactionsView() {
  const { user } = useAuth()
  const {
    transactions,
    transactionsLoading,
    transactionsError,
    addTransaction,
    deleteTransaction,
    accounts,
    categories,
  } = useFirestore()

  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [transactionType, setTransactionType] = useState("expense")
  const [date, setDate] = useState<Date>(new Date())
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [account, setAccount] = useState("")
  const [description, setDescription] = useState("")
  const [title, setTitle] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filter, setFilter] = useState("all")

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

  const handleSubmit = async () => {
    if (!user) return

    if (!amount || !category || !date) {
      return // Add validation error handling
    }

    setIsSubmitting(true)

    try {
      await addTransaction({
        title: title || (transactionType === "expense" ? "Expense" : "Income"),
        amount: Number.parseFloat(amount),
        type: transactionType as "income" | "expense",
        category,
        date: date.toISOString(),
        description,
        account,
      })

      // Reset form
      setTitle("")
      setAmount("")
      setCategory("")
      setAccount("")
      setDescription("")
      setDate(new Date())

      // Close dialog
      setShowAddTransaction(false)
    } catch (error) {
      console.error("Error adding transaction:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await deleteTransaction(id)
      } catch (error) {
        console.error("Error deleting transaction:", error)
      }
    }
  }

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === "all") return true
    return transaction.type === filter
  })

  // Calculate totals
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

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
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Transaction title"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="amount">Amount (฿)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((cat) => cat.type === transactionType)
                      .map((cat) => (
                        <SelectItem key={cat.id} value={cat.id || ""}>
                          {cat.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="account">Account</Label>
                <Select value={account} onValueChange={setAccount}>
                  <SelectTrigger id="account">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((acc) => (
                      <SelectItem key={acc.id} value={acc.id || ""}>
                        {acc.name}
                      </SelectItem>
                    ))}
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
                    <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Add notes about this transaction"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddTransaction(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Transaction"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Transactions</CardTitle>
            <Select defaultValue="all" onValueChange={setFilter}>
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
          {transactionsError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{transactionsError}</AlertDescription>
            </Alert>
          )}

          {transactionsLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transactions found. Add your first transaction to get started.
            </div>
          ) : (
            <div className="space-y-6">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${transaction.type === "income" ? "bg-green-100" : "bg-red-100"}`}
                    >
                      {getIcon(transaction.category)}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.title}</p>
                      <p className="text-sm text-muted-foreground">{transaction.category}</p>
                      <p className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                      {transaction.type === "income" ? "+" : "-"} {formatCurrency(transaction.amount)}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => transaction.id && handleDeleteTransaction(transaction.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Income: <span className="text-green-600">{formatCurrency(totalIncome)}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Expenses: <span className="text-red-600">{formatCurrency(totalExpenses)}</span>
            </p>
          </div>
          <Button variant="outline">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            View All Transactions
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
