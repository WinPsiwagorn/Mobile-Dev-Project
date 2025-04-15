"use client"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import type { MainTabNavigationProp } from "../types/navigation"
import { sharedStyles } from "../utils/animations"
import { useFinance } from "../context/FinanceContext"
import { useState, useEffect } from "react"
import { formatCurrency } from "../utils/financeService"
import { useTheme } from "../context/ThemeContext"
import { TrendingUp, TrendingDown } from "lucide-react-native"
import ScreenLayout from "../components/ScreenLayout"

type RouteParams = {
  id: string
}

export default function TransactionDetailsScreen() {
  const navigation = useNavigation<MainTabNavigationProp>()
  const route = useRoute()
  const { id } = route.params as RouteParams
  const { colors } = useTheme()
  const { transactions, accounts } = useFinance()
  const [isLoading, setIsLoading] = useState(false)

  // Find the transaction with the matching ID
  const transaction = transactions.find(t => t.id === id)
  
  useEffect(() => {
    if (!transaction) {
      console.error("Transaction not found:", id)
      navigation.goBack()
    }
  }, [transaction, id, navigation])

  // Get the account associated with this transaction
  const account = accounts.find(a => a.id === transaction?.accountId)

  const getStatusColor = (type: string) => {
    if (!colors) return "#000000"
    return type === "income" ? "#4CAF50" : "#FF3B30"
  }

  const getStatusIcon = (type: string) => {
    return type === "income" ? TrendingUp : TrendingDown
  }

  if (!transaction || !account || !colors) {
    return (
      <ScreenLayout backgroundColor="#FFFFFF">
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: "#666666" }]}>Loading...</Text>
        </View>
      </ScreenLayout>
    )
  }

  // Get the appropriate icon based on category
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "shopping":
        return "cart-outline"
      case "food":
        return "restaurant-outline"
      case "transport":
        return "car-outline"
      case "entertainment":
        return "game-controller-outline"
      case "bills":
        return "document-text-outline"
      case "salary":
        return "briefcase-outline"
      default:
        return "wallet-outline"
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#FFB23F", "#FF8F3F"]} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction Details</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={[styles.card, sharedStyles.card]}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={getCategoryIcon(transaction.category)}
              size={32}
              color={getStatusColor(transaction.type)}
            />
          </View>

          <View style={styles.amountContainer}>
            <Text style={[
              styles.amount,
              { color: getStatusColor(transaction.type) }
            ]}>
              {formatCurrency(transaction.amount)}
            </Text>
          </View>

          <Text style={styles.title}>{transaction.description}</Text>
          <Text style={styles.date}>{new Date(transaction.date).toLocaleDateString()}</Text>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>{transaction.category}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Account</Text>
            <Text style={styles.detailValue}>
              {account.name || "Unknown Account"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type</Text>
            <Text style={styles.detailValue}>
              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
            </Text>
          </View>

          {transaction.notes && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Notes</Text>
              <Text style={styles.detailValue}>{transaction.notes}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    padding: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 143, 63, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  amountContainer: {
    marginBottom: 8,
  },
  amount: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  detailValue: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "right",
    flex: 1,
    marginLeft: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666666",
  },
})
