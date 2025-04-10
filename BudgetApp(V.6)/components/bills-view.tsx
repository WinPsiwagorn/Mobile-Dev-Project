"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Wallet, PiggyBank, Receipt } from "lucide-react"
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

export function AccountsView() {
  const [showAddAccount, setShowAddAccount] = useState(false)

  // Mock data - in a real app, this would come from Firebase
  const savingsAccounts = [
    { id: "1", name: "Emergency Fund", balance: 25000, goal: 50000 },
    { id: "2", name: "Travel Fund", balance: 7500, goal: 15000 },
  ]

  const expenseAccounts = [
    { id: "1", name: "Daily Expenses", balance: 8500 },
    { id: "2", name: "Transportation", balance: 4250 },
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
        <h1 className="text-2xl font-bold">My Accounts</h1>
        <Dialog open={showAddAccount} onOpenChange={setShowAddAccount}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Account</DialogTitle>
              <DialogDescription>Create a new account to track your finances</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="account-type">Account Type</Label>
                <Select defaultValue="savings">
                  <SelectTrigger id="account-type">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="bills">Bills</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Account Name</Label>
                <Input id="name" placeholder="e.g. Emergency Fund" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="initial-balance">Initial Balance (฿)</Label>
                <Input id="initial-balance" type="number" placeholder="0" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="goal-amount">Goal Amount (฿) (Optional)</Label>
                <Input id="goal-amount" type="number" placeholder="0" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddAccount(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowAddAccount(false)}>Create Account</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="savings" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="savings">Savings</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="bills">Bills</TabsTrigger>
        </TabsList>

        <TabsContent value="savings" className="space-y-4 mt-4">
          {savingsAccounts.map((account) => (
            <Card key={account.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <PiggyBank className="h-4 w-4 text-blue-600" />
                  </div>
                  <CardTitle>{account.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <CardDescription>Current Balance</CardDescription>
                  <p className="text-2xl font-bold">{formatCurrency(account.balance)}</p>

                  {account.goal && (
                    <div className="mt-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Goal Progress</span>
                        <span className="text-sm font-medium">
                          {Math.round((account.balance / account.goal) * 100)}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(account.balance / account.goal) * 100}%` }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatCurrency(account.balance)} of {formatCurrency(account.goal)}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  View Transactions
                </Button>
                <Button size="sm">Add Money</Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4 mt-4">
          {expenseAccounts.map((account) => (
            <Card key={account.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="bg-red-100 p-2 rounded-full">
                    <Wallet className="h-4 w-4 text-red-600" />
                  </div>
                  <CardTitle>{account.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <CardDescription>Available Balance</CardDescription>
                  <p className="text-2xl font-bold">{formatCurrency(account.balance)}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  View Transactions
                </Button>
                <Button size="sm">Add Expense</Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="bills" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Receipt className="h-4 w-4 text-purple-600" />
                </div>
                <CardTitle>Monthly Bills</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Manage your recurring bills and payments</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">View Bills</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

