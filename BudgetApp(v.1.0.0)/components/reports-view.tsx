"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, XAxis, YAxis } from "recharts"

export function ReportsView() {
  // Mock data - in a real app, this would come from Firebase
  const monthlyData = [
    { month: "Jan", income: 45000, expenses: 32500 },
    { month: "Feb", income: 48000, expenses: 35000 },
    { month: "Mar", income: 52000, expenses: 38000 },
    { month: "Apr", income: 49000, expenses: 36000 },
    { month: "May", income: 53000, expenses: 39000 },
    { month: "Jun", income: 55000, expenses: 41000 },
  ]

  const categoryData = [
    { name: "Housing", value: 15000, color: "#8884d8" },
    { name: "Food", value: 8500, color: "#82ca9d" },
    { name: "Transportation", value: 4500, color: "#ffc658" },
    { name: "Entertainment", value: 3500, color: "#ff8042" },
    { name: "Utilities", value: 3000, color: "#0088fe" },
    { name: "Other", value: 3500, color: "#00C49F" },
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
        <h1 className="text-2xl font-bold">Financial Reports</h1>
        <Select defaultValue="march">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="january">January</SelectItem>
            <SelectItem value="february">February</SelectItem>
            <SelectItem value="march">March</SelectItem>
            <SelectItem value="april">April</SelectItem>
            <SelectItem value="may">May</SelectItem>
            <SelectItem value="june">June</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Income vs Expenses</CardTitle>
              <CardDescription>Monthly comparison of your income and expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer
                  config={{
                    income: {
                      label: "Income",
                      color: "hsl(var(--chart-1))",
                    },
                    expenses: {
                      label: "Expenses",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `฿${value / 1000}k`} />
                    <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
                    <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                    <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Income</CardTitle>
                <CardDescription>March 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatCurrency(52000)}</div>
                <p className="text-sm text-green-600 mt-2">+8.3% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Expenses</CardTitle>
                <CardDescription>March 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatCurrency(38000)}</div>
                <p className="text-sm text-red-600 mt-2">+8.6% from last month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>Where your money went in March 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex justify-center">
                <PieChart width={300} height={300}>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <ChartTooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Spending Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryData
                  .sort((a, b) => b.value - a.value)
                  .map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                        <span>{category.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{formatCurrency(category.value)}</span>
                        <span className="text-muted-foreground text-sm">
                          {Math.round((category.value / categoryData.reduce((acc, curr) => acc + curr.value, 0)) * 100)}
                          %
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="savings" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Savings Growth</CardTitle>
              <CardDescription>Your savings progress over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer
                  config={{
                    savings: {
                      label: "Savings",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <BarChart
                    data={monthlyData.map((item) => ({
                      month: item.month,
                      savings: item.income - item.expenses,
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `฿${value / 1000}k`} />
                    <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
                    <Bar dataKey="savings" fill="var(--color-savings)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Savings Rate</CardTitle>
              <CardDescription>Percentage of income saved each month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((item, index) => {
                  const savingsAmount = item.income - item.expenses
                  const savingsRate = Math.round((savingsAmount / item.income) * 100)

                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span>{item.month} 2025</span>
                        <span className="font-medium">{savingsRate}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${savingsRate}%` }} />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Saved: {formatCurrency(savingsAmount)}</span>
                        <span>Income: {formatCurrency(item.income)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
