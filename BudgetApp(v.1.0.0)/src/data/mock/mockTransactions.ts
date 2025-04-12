export type Transaction = {
  id: string
  type: "income" | "expense"
  category: string
  amount: number
  date: string
  description: string
  account: string
  status: "completed" | "pending" | "failed"
}

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "income",
    category: "Salary",
    amount: 5000.0,
    date: "2024-03-01",
    description: "Monthly salary",
    account: "Main Account",
    status: "completed",
  },
  {
    id: "2",
    type: "expense",
    category: "Groceries",
    amount: 150.75,
    date: "2024-03-02",
    description: "Weekly groceries",
    account: "Main Account",
    status: "completed",
  },
  {
    id: "3",
    type: "expense",
    category: "Utilities",
    amount: 200.0,
    date: "2024-03-03",
    description: "Electricity bill",
    account: "Bills Account",
    status: "pending",
  },
  {
    id: "4",
    type: "income",
    category: "Freelance",
    amount: 1000.0,
    date: "2024-03-04",
    description: "Web development project",
    account: "Business Account",
    status: "completed",
  },
  {
    id: "5",
    type: "expense",
    category: "Entertainment",
    amount: 50.0,
    date: "2024-03-05",
    description: "Movie tickets",
    account: "Main Account",
    status: "completed",
  },
]
