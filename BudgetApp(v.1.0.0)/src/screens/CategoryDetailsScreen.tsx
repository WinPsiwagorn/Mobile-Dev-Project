"use client"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native"
import { useTheme } from "../context/ThemeContext"
import type { MainTabNavigationProp } from "../types/navigation"
import { LinearGradient } from "expo-linear-gradient"
import { ArrowLeft, ShoppingBag } from "lucide-react-native"
import { useNavigation, useRoute } from "@react-navigation/native"

const { width } = Dimensions.get("window")

// Mock data - replace with actual data from your backend
const CATEGORY_DATA = {
  id: "1",
  name: "Shopping",
  icon: ShoppingBag,
  color: "#FF6B6B",
  budget: 500,
  spent: 350,
  transactions: [
    {
      id: "1",
      date: "2024-03-30",
      amount: 150,
      description: "Grocery shopping",
      type: "expense",
    },
    {
      id: "2",
      date: "2024-03-28",
      amount: 200,
      description: "Clothing",
      type: "expense",
    },
  ],
  monthlyStats: [
    { month: "Jan", amount: 450 },
    { month: "Feb", amount: 380 },
    { month: "Mar", amount: 350 },
  ],
}

export default function CategoryDetailsScreen() {
  const navigation = useNavigation<MainTabNavigationProp>()
  const route = useRoute()
  const { colors } = useTheme()
  const { id } = route.params as { id: string }

  // In a real app, you would fetch category details using the id
  const category = CATEGORY_DATA
  const Icon = category.icon

  const calculateProgress = (spent: number, budget: number) => {
    return (spent / budget) * 100
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={[colors.gradient[0], colors.gradient[1]]} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={colors.surface} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={[styles.iconContainer, { backgroundColor: `${category.color}15` }]}>
            <Icon size={24} color={category.color} />
          </View>
          <Text style={[styles.headerTitle, { color: colors.surface }]}>{category.name}</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Budget Overview */}
        <View style={[styles.card, { backgroundColor: colors.glass.background }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Budget Overview</Text>
          <View style={styles.budgetContainer}>
            <View style={styles.budgetInfo}>
              <Text style={[styles.budgetLabel, { color: colors.textSecondary }]}>Budget</Text>
              <Text style={[styles.budgetAmount, { color: colors.text }]}>{formatCurrency(category.budget)}</Text>
            </View>
            <View style={styles.budgetInfo}>
              <Text style={[styles.budgetLabel, { color: colors.textSecondary }]}>Spent</Text>
              <Text style={[styles.budgetAmount, { color: colors.text }]}>{formatCurrency(category.spent)}</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${calculateProgress(category.spent, category.budget)}%`,
                  backgroundColor: category.color,
                },
              ]}
            />
          </View>
        </View>

        {/* Monthly Stats */}
        <View style={[styles.card, { backgroundColor: colors.glass.background }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Monthly Statistics</Text>
          <View style={styles.statsContainer}>
            {category.monthlyStats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Text style={[styles.statMonth, { color: colors.textSecondary }]}>{stat.month}</Text>
                <Text style={[styles.statAmount, { color: colors.text }]}>{formatCurrency(stat.amount)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={[styles.card, { backgroundColor: colors.glass.background }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Recent Transactions</Text>
          {category.transactions.map((transaction) => (
            <TouchableOpacity
              key={transaction.id}
              style={styles.transactionItem}
              onPress={() => {
                // TODO: Navigate to transaction details
                console.log("Transaction pressed:", transaction.id)
              }}
            >
              <View style={styles.transactionInfo}>
                <Text style={[styles.transactionDescription, { color: colors.text }]}>{transaction.description}</Text>
                <Text style={[styles.transactionDate, { color: colors.textSecondary }]}>
                  {new Date(transaction.date).toLocaleDateString()}
                </Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  { color: transaction.type === "expense" ? colors.error : colors.success },
                ]}
              >
                {transaction.type === "expense" ? "-" : "+"}
                {formatCurrency(transaction.amount)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  budgetContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  budgetInfo: {
    flex: 1,
  },
  budgetLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  budgetAmount: {
    fontSize: 24,
    fontWeight: "600",
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
  },
  statMonth: {
    fontSize: 14,
    marginBottom: 4,
  },
  statAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
})
