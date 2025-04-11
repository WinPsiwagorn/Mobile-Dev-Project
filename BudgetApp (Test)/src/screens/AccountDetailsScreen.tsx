"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native"
import { useTheme, globalStyles } from "../context/ThemeContext"
import type { MainTabNavigationProp } from "../types/navigation"
import { LinearGradient } from "expo-linear-gradient"
import { ArrowLeft, Plus, Calendar, TrendingUp, TrendingDown, CreditCard, PiggyBank, Home, ShoppingBag, Bus, Tv, Briefcase, Plane, Gift, PartyPopper, AlertTriangle } from "lucide-react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import ScreenLayout from "../components/ScreenLayout"

const { width } = Dimensions.get("window")

// Mock data for transactions (will be used if no transactions are provided)
const MOCK_TRANSACTIONS = [
  {
    id: "1",
    type: "income",
    amount: 1200.00,
    date: "2024-03-15",
    category: "Salary",
    description: "Monthly salary payment",
    icon: "briefcase-outline",
  },
  {
    id: "2",
    type: "expense",
    amount: 85.50,
    date: "2024-03-14",
    category: "Shopping",
    description: "Grocery shopping",
    icon: "cart-outline",
  },
  {
    id: "3",
    type: "expense",
    amount: 45.00,
    date: "2024-03-13",
    category: "Transport",
    description: "Bus fare",
    icon: "bus-outline",
  },
  {
    id: "4",
    type: "income",
    amount: 250.00,
    date: "2024-03-12",
    category: "Freelance",
    description: "Web design project",
    icon: "laptop-outline",
  },
  {
    id: "5",
    type: "expense",
    amount: 120.00,
    date: "2024-03-11",
    category: "Entertainment",
    description: "Movie night",
    icon: "film-outline",
  },
  {
    id: "6",
    type: "expense",
    amount: 65.00,
    date: "2024-03-10",
    category: "Food",
    description: "Restaurant dinner",
    icon: "restaurant-outline",
  },
  {
    id: "7",
    type: "income",
    amount: 75.00,
    date: "2024-03-09",
    category: "Gifts",
    description: "Birthday gift",
    icon: "gift-outline",
  },
]

export default function AccountDetailsScreen() {
  const navigation = useNavigation<MainTabNavigationProp>()
  const route = useRoute()
  const { account } = route.params as { account: any }
  const { colors } = useTheme()
  const [activeFilter, setActiveFilter] = useState("all")

  // Use the account from route params or fallback to mock data
  const accountData = account || {
    id: "1",
    name: "Main Account",
    type: "general",
    balance: 2450.75,
    currency: "USD",
    icon: "wallet-outline",
    color: "#FF8F3F",
    transactions: MOCK_TRANSACTIONS,
  }

  // Ensure transactions exist
  const transactions = accountData.transactions || MOCK_TRANSACTIONS

  const getStatusColor = (type: string) => {
    return type === "income" ? colors.success : colors.danger
  }

  const getStatusIcon = (type: string) => {
    return type === "income" ? TrendingUp : TrendingDown
  }

  const filteredTransactions = transactions.filter((transaction) => {
    if (activeFilter === "all") return true
    return transaction.type === activeFilter
  })

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  // Get the appropriate icon component based on account type
  const getAccountIcon = () => {
    switch (accountData.type) {
      case "general":
        return CreditCard
      case "savings":
        return PiggyBank
      case "food":
        return Utensils
      case "shopping":
        return ShoppingBag
      case "transport":
        return Bus
      case "housing":
        return Home
      case "entertainment":
        return Tv
      case "investment":
        return Briefcase
      case "travel":
        return Plane
      case "gifts":
        return Gift
      case "party":
        return PartyPopper
      case "emergency":
        return AlertTriangle
      default:
        return CreditCard
    }
  }

  const AccountIcon = getAccountIcon()

  return (
    <ScreenLayout backgroundColor={colors.background}>
      <LinearGradient
        colors={[colors.gradient[0], colors.gradient[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.navigate("Main")}
            >
              <ArrowLeft size={24} color={colors.surface} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.surface }]}>Account Details</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddTransaction")}>
            <Plus size={22} color={colors.surface} />
          </TouchableOpacity>
        </View>

        <View style={[styles.accountCard, globalStyles.glass]}>
          <View style={styles.accountHeader}>
            <View style={[styles.iconContainer, { backgroundColor: `${accountData.color}15` }]}>
              <AccountIcon size={24} color={accountData.color} />
            </View>
            <View style={styles.accountInfo}>
              <Text style={[styles.accountName, { color: colors.surface }]}>{accountData.name}</Text>
              <Text style={[styles.accountType, { color: colors.surface }]}>
                {accountData.type.charAt(0).toUpperCase() + accountData.type.slice(1)} Account
              </Text>
            </View>
          </View>
          <Text style={[styles.balanceAmount, { color: colors.surface }]}>
            ${accountData.balance.toFixed(2)}
          </Text>
          <View style={styles.balanceMetrics}>
            <View style={[styles.metric, { backgroundColor: "rgba(255, 255, 255, 0.1)" }]}>
              <TrendingUp size={20} color="#FFFFFF" />
              <Text style={[styles.metricLabel, { color: "#FFFFFF" }]}>Income</Text>
              <Text style={[styles.metricAmount, { color: "#FFFFFF" }]}>+${totalIncome.toFixed(2)}</Text>
            </View>
            <View style={[styles.metric, { backgroundColor: "rgba(255, 255, 255, 0.1)" }]}>
              <TrendingDown size={20} color="#FFFFFF" />
              <Text style={[styles.metricLabel, { color: "#FFFFFF" }]}>Expenses</Text>
              <Text style={[styles.metricAmount, { color: "#FFFFFF" }]}>-${totalExpenses.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={[styles.filterContainer, globalStyles.glass]}>
          {["all", "income", "expense"].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterTab, { backgroundColor: activeFilter === filter ? colors.primary : "transparent" }]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[styles.filterText, { color: activeFilter === filter ? colors.surface : colors.textSecondary }]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={styles.transactionsContainer}>
          {filteredTransactions.map((transaction) => {
            const StatusIcon = getStatusIcon(transaction.type)
            return (
              <TouchableOpacity
                key={transaction.id}
                style={[styles.transactionCard, globalStyles.glass]}
                onPress={() => navigation.navigate("TransactionDetails", { id: transaction.id })}
              >
                <View style={styles.transactionHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: `${getStatusColor(transaction.type)}15` }]}>
                    <StatusIcon size={24} color={getStatusColor(transaction.type)} />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={[styles.transactionTitle, { color: colors.text }]}>{transaction.description}</Text>
                    <Text style={[styles.transactionCategory, { color: colors.textSecondary }]}>
                      {transaction.category}
                    </Text>
                  </View>
                  <View style={styles.transactionAmount}>
                    <Text 
                      style={[
                        styles.amountText, 
                        { color: transaction.type === "income" ? colors.success : colors.danger }
                      ]}
                    >
                      {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                    </Text>
                  </View>
                </View>

                <View style={styles.transactionFooter}>
                  <View style={styles.dateContainer}>
                    <Calendar size={14} color={colors.textSecondary} />
                    <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                      {new Date(transaction.date).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
    </ScreenLayout>
  )
}

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  accountCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  accountHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  accountType: {
    fontSize: 14,
    opacity: 0.8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 16,
  },
  balanceMetrics: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  metric: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  metricLabel: {
    fontSize: 14,
    marginVertical: 4,
  },
  metricAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterContainer: {
    flexDirection: "row",
    borderRadius: 20,
    padding: 4,
    marginVertical: 20,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: "center",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
  },
  transactionsContainer: {
    gap: 12,
    paddingBottom: 20,
  },
  transactionCard: {
    padding: 16,
    borderRadius: 16,
  },
  transactionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 14,
  },
  transactionAmount: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "600",
  },
  transactionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    fontSize: 12,
  },
}) 