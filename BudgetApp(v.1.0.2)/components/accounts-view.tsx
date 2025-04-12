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
import { useFirestore } from "@/context/firestore-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export function AccountsView() {
  const { accounts, accountsLoading, accountsError, addAccount, updateAccount, deleteAccount } = useFirestore()

  const [showAddAccount, setShowAddAccount] = useState(false)
  const [accountName, setAccountName] = useState("")
  const [accountType, setAccountType] = useState("savings")
  const [initialBalance, setInitialBalance] = useState("")
  const [goalAmount, setGoalAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Format currency in Thai Baht
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleAddAccount = async () => {
    if (!accountName || !initialBalance) {
      return // Add validation error handling
    }

    setIsSubmitting(true)

    try {
      await addAccount({
        name: accountName,
        type: accountType,
        balance: Number.parseFloat(initialBalance),
        currency: "THB",
        ...(accountType === "savings" && goalAmount ? { goal: Number.parseFloat(goalAmount) } : {}),
      })

      // Reset form
      setAccountName("")
      setAccountType("savings")
      setInitialBalance("")
      setGoalAmount("")

      // Close dialog
      setShowAddAccount(false)
    } catch (error) {
      console.error("Error adding account:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAccount = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      try {
        await deleteAccount(id)
      } catch (error) {
        console.error("Error deleting account:", error)
      }
    }
  }

  // Filter accounts by type
  const savingsAccounts = accounts.filter((account) => account.type === "savings")
  const expenseAccounts = accounts.filter((account) => account.type === "expense")
  const billAccounts = accounts.filter((account) => account.type === "bills")

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
                <Select defaultValue="savings" onValueChange={setAccountType}>
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
                <Input
                  id="name"
                  placeholder="e.g. Emergency Fund"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="initial-balance">Initial Balance (฿)</Label>
                <Input
                  id="initial-balance"
                  type="number"
                  placeholder="0"
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(e.target.value)}
                />
              </div>
              {accountType === "savings" && (
                <div className="grid gap-2">
                  <Label htmlFor="goal-amount">Goal Amount (฿) (Optional)</Label>
                  <Input
                    id="goal-amount"
                    type="number"
                    placeholder="0"
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(e.target.value)}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddAccount(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAccount} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {accountsError && (
        <Alert variant="destructive">
          <AlertDescription>{accountsError}</AlertDescription>
        </Alert>
      )}

      {accountsLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs defaultValue="savings" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="savings">Savings</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="bills">Bills</TabsTrigger>
          </TabsList>

          <TabsContent value="savings" className="space-y-4 mt-4">
            {savingsAccounts.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No savings accounts yet. Add your first savings account to get started.
                </CardContent>
              </Card>
            ) : (
              savingsAccounts.map((account) => (
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
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => account.id && handleDeleteAccount(account.id)}
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4 mt-4">
            {expenseAccounts.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No expense accounts yet. Add your first expense account to get started.
                </CardContent>
              </Card>
            ) : (
              expenseAccounts.map((account) => (
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
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => account.id && handleDeleteAccount(account.id)}
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="bills" className="space-y-4 mt-4">
            {billAccounts.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No bill accounts yet. Add your first bill account to get started.
                </CardContent>
              </Card>
            ) : (
              billAccounts.map((account) => (
                <Card key={account.id}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <Receipt className="h-4 w-4 text-purple-600" />
                      </div>
                      <CardTitle>{account.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <CardDescription>Current Balance</CardDescription>
                      <p className="text-2xl font-bold">{formatCurrency(account.balance)}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      View Bills
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => account.id && handleDeleteAccount(account.id)}
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
