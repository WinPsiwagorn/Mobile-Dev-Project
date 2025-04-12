"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native"
import { useTheme, globalStyles } from "../context/ThemeContext"
import type { MainTabNavigationProp } from "../types/navigation"
import { LinearGradient } from "expo-linear-gradient"
import { ArrowLeft, Plus, Calendar, TrendingUp, TrendingDown, CreditCard, PiggyBank, Home, ShoppingBag, Bus, Tv, Briefcase, Plane, Gift, PartyPopper, AlertTriangle } from "lucide-react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import ScreenLayout from "../components/ScreenLayout"
import { useFinance } from "../context/FinanceContext"

const { width } = Dimensions.get("window")

export default function AccountDetailsScreen() {
  const navigation = useNavigation<MainTabNavigationProp>()
  const route = useRoute()
  const { accountId } = route.params as { accountId: string }
  const { colors } = useTheme()
  const [activeFilter, setActiveFilter] = useState("all")
  const { accounts, transactions } = useFinance()

  // Find the account from the accounts list
  const accountData = accounts.find(acc => acc.id === accountId)
  
  if (!accountData) {
    return (
      <ScreenLayout backgroundColor={colors.background}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>Account not found</Text>
        </View>
      </ScreenLayout>
    )
  }

  // Get transactions for this account
  const accountTransactions = transactions
    .filter(t => t.accountId === accountData.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filter transactions based on type
  const filteredTransactions = accountTransactions.filter((transaction) => {
    if (activeFilter === "all") return true;
    return transaction.type === activeFilter;
  });

  // Calculate totals
  const totalIncome = accountTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = accountTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Get the appropriate icon component based on account type
  const AccountIcon = accountData.type === "savings" ? PiggyBank : CreditCard;

  const getStatusColor = (type: string) => {
    return type === "income" ? colors.success : colors.danger
  }

  const getStatusIcon = (type: string) => {
    return type === "income" ? TrendingUp : TrendingDown
  }

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
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={24} color={colors.surface} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.surface }]}>Account Details</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => navigation.navigate("AddTransaction", { selectedAccountId: accountData.id })}
          >
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
            ${accountData.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </Text>
          <View style={styles.balanceMetrics}>
            <View style={[styles.metric, { backgroundColor: "rgba(255, 255, 255, 0.1)" }]}>
              <TrendingUp size={20} color="#FFFFFF" />
              <Text style={[styles.metricLabel, { color: "#FFFFFF" }]}>Income</Text>
              <Text style={[styles.metricAmount, { color: "#FFFFFF" }]}>
                +${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={[styles.metric, { backgroundColor: "rgba(255, 255, 255, 0.1)" }]}>
              <TrendingDown size={20} color="#FFFFFF" />
              <Text style={[styles.metricLabel, { color: "#FFFFFF" }]}>Expenses</Text>
              <Text style={[styles.metricAmount, { color: "#FFFFFF" }]}>
                -${totalExpenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </Text>
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
          {filteredTransactions.length === 0 ? (
            <View style={[styles.emptyState, globalStyles.glass]}>
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                No {activeFilter === "all" ? "transactions" : activeFilter} found
              </Text>
            </View>
          ) : (
            filteredTransactions.map((transaction) => {
              const StatusIcon = getStatusIcon(transaction.type);
              return (
                <TouchableOpacity
                  key={transaction.id}
                  style={[styles.transactionCard, globalStyles.glass]}
                  onPress={() => navigation.navigate("TransactionDetails", { transaction })}
                >
                  <View style={styles.transactionHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: `${getStatusColor(transaction.type)}15` }]}>
                      <StatusIcon size={24} color={getStatusColor(transaction.type)} />
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={[styles.transactionTitle, { color: colors.text }]}>
                        {transaction.description}
                      </Text>
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
                        {transaction.type === "income" ? "+" : "-"}${transaction.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
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
              );
            })
          )}
        </ScrollView>
      </View>
    </ScreenLayout>
  );
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
  emptyState: {
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
  },
}) 