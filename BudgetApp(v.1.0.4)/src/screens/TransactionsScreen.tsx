"use client"

import { useEffect, useState } from "react"
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from "react-native"
import { useTheme } from "../context/ThemeContext"
import type { AppStackNavigationProp } from "../types/navigation"
import { Plus, ArrowLeft } from "lucide-react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { createAnimationHooks, sharedStyles } from "../utils/animations"

const { width } = Dimensions.get("window")

type IconName = keyof typeof Ionicons.glyphMap

type Transaction = {
  id: string
  title: string
  amount: number
  type: "income" | "expense"
  category: string
  date: string
  icon: IconName
}

export default function TransactionsScreen() {
  const navigation = useNavigation<AppStackNavigationProp>()
  const { colors } = useTheme()
  const [activeFilter, setActiveFilter] = useState("all")
  const { glowAnim, pulseAnim, backgroundAnim, contentAnim, glowOpacity, fadeInScale, startAnimations } =
    createAnimationHooks()

  useEffect(() => {
    startAnimations()
  }, [])

  const transactions: Transaction[] = [
    {
      id: "1",
      title: "Shopping Mall",
      amount: 450.8,
      type: "expense",
      category: "Shopping",
      date: "Today, 14:30",
      icon: "cart-outline",
    },
    {
      id: "2",
      title: "Salary Deposit",
      amount: 5200.0,
      type: "income",
      category: "Salary",
      date: "Today, 09:15",
      icon: "cash-outline",
    },
    {
      id: "3",
      title: "Starbucks Coffee",
      amount: 8.5,
      type: "expense",
      category: "Food & Drinks",
      date: "Yesterday, 16:45",
      icon: "cafe-outline",
    },
    {
      id: "4",
      title: "Uber Ride",
      amount: 24.99,
      type: "expense",
      category: "Transportation",
      date: "Yesterday, 13:20",
      icon: "car-outline",
    },
    {
      id: "5",
      title: "Rent Payment",
      amount: 1800.0,
      type: "expense",
      category: "Housing",
      date: "24 Mar, 10:00",
      icon: "home-outline",
    },
    {
      id: "6",
      title: "Game Purchase",
      amount: 59.99,
      type: "expense",
      category: "Entertainment",
      date: "23 Mar, 15:30",
      icon: "game-controller-outline",
    },
  ]

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const renderTransaction = (transaction: Transaction) => (
    <TouchableOpacity
      key={transaction.id}
      style={[styles.transactionCard]}
      onPress={() => navigation.navigate("TransactionDetails", { id: transaction.id })}
    >
      <View style={styles.transaction}>
        <View
          style={[styles.transactionIcon, { backgroundColor: transaction.type === "income" ? "#1B5E20" : "#B71C1C" }]}
        >
          <Ionicons name={transaction.icon} size={24} color="#FFFFFF" />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionTitle}>{transaction.title}</Text>
          <Text style={styles.transactionCategory}>{transaction.category}</Text>
          <Text style={styles.transactionDate}>{transaction.date}</Text>
        </View>
        <Text style={[styles.transactionAmount, { color: transaction.type === "income" ? "#1B5E20" : "#B71C1C" }]}>
          {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={[sharedStyles.container, { backgroundColor: "#121212" }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Transactions</Text>
          <Text style={styles.headerSubtitle}>Your financial activity</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCards}>
          <View style={[styles.summaryCard, { backgroundColor: "#1B5E20" }]}>
            <View style={styles.summaryContent}>
              <Ionicons name="arrow-up-outline" size={24} color="#FFFFFF" />
              <Text style={[styles.summaryLabel, { color: "#FFFFFF" }]}>Income</Text>
              <Text style={[styles.summaryAmount, { color: "#FFFFFF" }]}>+${totalIncome.toFixed(2)}</Text>
            </View>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: "#B71C1C" }]}>
            <View style={styles.summaryContent}>
              <Ionicons name="arrow-down-outline" size={24} color="#FFFFFF" />
              <Text style={[styles.summaryLabel, { color: "#FFFFFF" }]}>Expenses</Text>
              <Text style={[styles.summaryAmount, { color: "#FFFFFF" }]}>-${totalExpenses.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.filterContainer}>
          {["all", "income", "expense"].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterButton, activeFilter === filter && styles.filterButtonActive]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.transactionsList}>
          {transactions.filter((t) => activeFilter === "all" || t.type === activeFilter).map(renderTransaction)}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddTransaction")}>
        <Plus size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#1E1E1E",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerContent: {
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#999",
  },
  content: {
    flex: 1,
  },
  summaryCards: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
  },
  summaryContent: {
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: "500",
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#333",
  },
  filterButtonActive: {
    backgroundColor: "#333",
    borderColor: "#666",
  },
  filterText: {
    color: "#999",
    fontWeight: "500",
    fontSize: 14,
  },
  filterTextActive: {
    color: "#FFF",
  },
  transactionsList: {
    paddingHorizontal: 16,
  },
  transactionCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  transaction: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 14,
    color: "#999",
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: "#666",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  addButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
})
