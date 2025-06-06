import { ShoppingCart, CreditCard, Coffee, ArrowUpRight, ArrowDownRight } from "lucide-react"
import type { Transaction } from "@/lib/firestore/types"

interface TransactionItemProps {
  transaction: Transaction
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  // Format currency in Thai Baht
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(Math.abs(amount))
  }

  // Get icon based on transaction type
  const getIcon = () => {
    switch (transaction.category) {
      case "shopping-cart":
        return <ShoppingCart className="h-4 w-4" />
      case "credit-card":
        return <CreditCard className="h-4 w-4" />
      case "coffee":
        return <Coffee className="h-4 w-4" />
      default:
        return transaction.type === "income" ? (
          <ArrowUpRight className="h-4 w-4" />
        ) : (
          <ArrowDownRight className="h-4 w-4" />
        )
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${transaction.type === "income" ? "bg-green-100" : "bg-red-100"}`}>
          {getIcon()}
        </div>
        <div>
          <p className="font-medium">{transaction.title}</p>
          <p className="text-sm text-muted-foreground">{transaction.category}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
          {transaction.type === "income" ? "+" : "-"} {formatCurrency(transaction.amount)}
        </p>
        <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
      </div>
    </div>
  )
}
