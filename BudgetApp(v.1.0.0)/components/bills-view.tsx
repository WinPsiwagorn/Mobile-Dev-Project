"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, AlertCircle, CheckCircle, Clock } from "lucide-react"
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
import { Switch } from "@/components/ui/switch"
import { useFirestore } from "@/context/firestore-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function BillsView() {
  const { bills, billsLoading, billsError, addBill, updateBill, deleteBill } = useFirestore()

  const [showAddBill, setShowAddBill] = useState(false)
  const [billName, setBillName] = useState("")
  const [amount, setAmount] = useState("")
  const [dueDate, setDueDate] = useState<Date>(new Date())
  const [category, setCategory] = useState("Utilities")
  const [recurring, setRecurring] = useState(false)
  const [frequency, setFrequency] = useState("monthly")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleAddBill = async () => {
    if (!billName || !amount || !dueDate) {
      return // Add validation error handling
    }

    setIsSubmitting(true)

    try {
      await addBill({
        name: billName,
        amount: Number.parseFloat(amount),
        dueDate: dueDate.toISOString(),
        category,
        status: "pending",
        recurring,
        frequency: recurring ? (frequency as "monthly" | "quarterly" | "yearly" | "weekly") : undefined,
        automaticPayment: false,
      })

      // Reset form
      setBillName("")
      setAmount("")
      setDueDate(new Date())
      setCategory("Utilities")
      setRecurring(false)
      setFrequency("monthly")

      // Close dialog
      setShowAddBill(false)
    } catch (error) {
      console.error("Error adding bill:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMarkAsPaid = async (id: string) => {
    try {
      await updateBill(id, { status: "paid" })
    } catch (error) {
      console.error("Error updating bill:", error)
    }
  }

  const handleDeleteBill = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this bill?")) {
      try {
        await deleteBill(id)
      } catch (error) {
        console.error("Error deleting bill:", error)
      }
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  return (
    <div className="space-y-4 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Bills</h1>
        <Dialog open={showAddBill} onOpenChange={setShowAddBill}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Bill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Bill</DialogTitle>
              <DialogDescription>Add a new bill to track your payments</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="bill-name">Bill Name</Label>
                <Input
                  id="bill-name"
                  placeholder="e.g., Electricity Bill"
                  value={billName}
                  onChange={(e) => setBillName(e.target.value)}
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
                <Label htmlFor="due-date">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="due-date"
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                    >
                      {dueDate ? format(dueDate, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={(date) => date && setDueDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Housing">Housing</SelectItem>
                    <SelectItem value="Transportation">Transportation</SelectItem>
                    <SelectItem value="Insurance">Insurance</SelectItem>
                    <SelectItem value="Subscriptions">Subscriptions</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="recurring">Recurring Bill</Label>
                <Switch id="recurring" checked={recurring} onCheckedChange={setRecurring} />
              </div>
              {recurring && (
                <div className="grid gap-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select value={frequency} onValueChange={setFrequency}>
                    <SelectTrigger id="frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddBill(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddBill} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Bill"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {billsError && (
        <Alert variant="destructive">
          <AlertDescription>{billsError}</AlertDescription>
        </Alert>
      )}

      {billsLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : bills.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No bills yet. Add your first bill to get started.
          </CardContent>
        </Card>
      ) : (
        bills.map((bill) => (
          <Card key={bill.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{bill.name}</CardTitle>
                <div className="flex items-center gap-2">
                  {getStatusIcon(bill.status)}
                  <span className="text-sm capitalize">{bill.status}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(bill.amount)}</p>
              <p className="text-sm text-muted-foreground">Due {new Date(bill.dueDate).toLocaleDateString()}</p>
              {bill.recurring && (
                <p className="text-sm text-muted-foreground mt-1">
                  Recurring: {bill.frequency?.charAt(0).toUpperCase() + bill.frequency?.slice(1)}
                </p>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {bill.status !== "paid" && (
                <Button onClick={() => bill.id && handleMarkAsPaid(bill.id)}>Mark as Paid</Button>
              )}
              <Button variant="destructive" onClick={() => bill.id && handleDeleteBill(bill.id)}>
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  )
}
