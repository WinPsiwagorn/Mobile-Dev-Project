export type Bill = {
  id: string
  name: string
  amount: number
  dueDate: string
  category: string
  status: "paid" | "pending" | "overdue"
  recurring: boolean
  frequency?: "monthly" | "quarterly" | "yearly"
  automaticPayment: boolean
  paymentMethod?: string
}

export const mockBills: Bill[] = [
  {
    id: "1",
    name: "Rent",
    amount: 1500.0,
    dueDate: "2024-03-01",
    category: "Housing",
    status: "paid",
    recurring: true,
    frequency: "monthly",
    automaticPayment: true,
    paymentMethod: "Main Account",
  },
  {
    id: "2",
    name: "Electricity",
    amount: 125.5,
    dueDate: "2024-03-15",
    category: "Utilities",
    status: "pending",
    recurring: true,
    frequency: "monthly",
    automaticPayment: false,
  },
  {
    id: "3",
    name: "Internet",
    amount: 79.99,
    dueDate: "2024-03-10",
    category: "Utilities",
    status: "pending",
    recurring: true,
    frequency: "monthly",
    automaticPayment: true,
    paymentMethod: "Credit Card",
  },
  {
    id: "4",
    name: "Car Insurance",
    amount: 450.0,
    dueDate: "2024-04-01",
    category: "Insurance",
    status: "pending",
    recurring: true,
    frequency: "quarterly",
    automaticPayment: true,
    paymentMethod: "Main Account",
  },
  {
    id: "5",
    name: "Phone Bill",
    amount: 85.0,
    dueDate: "2024-03-05",
    category: "Utilities",
    status: "overdue",
    recurring: true,
    frequency: "monthly",
    automaticPayment: false,
  },
]
