"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Modal, TextInput } from "react-native"
import { useTheme, globalStyles } from "../context/ThemeContext"
import type { MainTabNavigationProp } from "../types/navigation"
import { LinearGradient } from "expo-linear-gradient"
import { ArrowLeft, Plus, Calendar, TrendingUp, TrendingDown, CreditCard, PiggyBank, Home, ShoppingBag, Bus, Tv, Briefcase, Plane, Gift, PartyPopper, AlertTriangle, Trash2, Target } from "lucide-react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import ScreenLayout from "../components/ScreenLayout"
import { useFinance } from "../context/FinanceContext"
import { formatCurrency } from "../utils/financeService"

const { width } = Dimensions.get("window")

export default function AccountDetailsScreen() {
  const navigation = useNavigation<MainTabNavigationProp>()
  const route = useRoute()
  const { accountId } = route.params as { accountId: string }
  const { colors } = useTheme()
  const [activeFilter, setActiveFilter] = useState("all")
  const { accounts, transactions, deleteAccount, updateAccount } = useFinance()
  const [accountData, setAccountData] = useState(accounts.find(acc => acc.id === accountId))
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [goalAmount, setGoalAmount] = useState("")

  // Update account data when accounts change or when screen is focused
  useEffect(() => {
    const account = accounts.find(acc => acc.id === accountId)
    if (account) {
      setAccountData(account)
    }
  }, [accounts, accountId])

  // Get transactions for this account
  const accountTransactions = transactions
    .filter(t => t.accountId === accountId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

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
  const AccountIcon = accountData?.type === "savings" ? PiggyBank : CreditCard;

  const getStatusColor = (type: string) => {
    return type === "income" ? colors.success : colors.danger
  }

  const getStatusIcon = (type: string) => {
    return type === "income" ? TrendingUp : TrendingDown
  }

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount(accountId)
      navigation.goBack()
    } catch (error) {
      console.error("Error deleting account:", error)
    }
  }

  const handleSetGoal = async () => {
    try {
      if (!accountData) return
      const amount = parseFloat(goalAmount) || 0
      await updateAccount(accountId, {
        ...accountData,
        goalBalance: amount
      })
      setShowGoalModal(false)
      setGoalAmount("")
    } catch (error) {
      console.error("Error setting goal:", error)
    }
  }

  if (!accountData) {
    return (
      <ScreenLayout backgroundColor={colors.background}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>Account not found</Text>
        </View>
      </ScreenLayout>
    )
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
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={[styles.headerButton, { marginRight: 8 }]} 
              onPress={() => setShowDeleteModal(true)}
            >
              <Trash2 size={22} color={colors.surface} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton} 
              onPress={() => navigation.navigate("AddTransaction", { type: "expense", accountId })}
            >
              <Plus size={22} color={colors.surface} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.accountCard, { backgroundColor: "rgba(0,0,0,0.15)" }]}>
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
          <View style={styles.balanceContainer}>
            <View style={styles.balanceSection}>
              <Text style={[styles.balanceLabel, { color: "rgba(255, 255, 255, 0.7)" }]}>Current Balance</Text>
              <Text style={[styles.balanceAmount, { color: colors.surface }]}>
                {formatCurrency(accountData.balance)}
              </Text>
            </View>
            {accountData.type === "savings" && (
              <View style={styles.goalSection}>
                <View style={styles.goalHeader}>
                  <Text style={[styles.goalLabel, { color: "rgba(255, 255, 255, 0.7)" }]}>Goal Balance</Text>
                  {!accountData.goalBalance && (
                    <TouchableOpacity 
                      style={styles.setGoalButton}
                      onPress={() => setShowGoalModal(true)}
                    >
                      <Target size={16} color={colors.surface} />
                    </TouchableOpacity>
                  )}
                </View>
                {accountData.goalBalance ? (
                  <>
                    <Text style={[styles.goalAmount, { color: colors.surface }]}>
                      {formatCurrency(accountData.goalBalance)}
                    </Text>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { 
                            width: `${Math.min((accountData.balance / accountData.goalBalance) * 100, 100)}%`,
                            backgroundColor: accountData.balance >= accountData.goalBalance ? "#00C48C" : "#FFB23F"
                          }
                        ]} 
                      />
                    </View>
                    <Text style={[styles.progressText, { color: "rgba(255, 255, 255, 0.7)" }]}>
                      {Math.round((accountData.balance / accountData.goalBalance) * 100)}% of goal
                    </Text>
                  </>
                ) : (
                  <Text style={[styles.noGoalText, { color: "rgba(255, 255, 255, 0.7)" }]}>
                    No goal set yet
                  </Text>
                )}
              </View>
            )}
          </View>
          <View style={styles.balanceMetrics}>
            <View style={[styles.metric, { backgroundColor: "rgba(255, 255, 255, 0.1)" }]}>
              <TrendingUp size={20} color="#FFFFFF" />
              <Text style={[styles.metricLabel, { color: "#FFFFFF" }]}>Income</Text>
              <Text style={[styles.metricAmount, { color: "#FFFFFF" }]}>
                +{formatCurrency(totalIncome)}
              </Text>
            </View>
            <View style={[styles.metric, { backgroundColor: "rgba(255, 255, 255, 0.1)" }]}>
              <TrendingDown size={20} color="#FFFFFF" />
              <Text style={[styles.metricLabel, { color: "#FFFFFF" }]}>Expenses</Text>
              <Text style={[styles.metricAmount, { color: "#FFFFFF" }]}>
                -{formatCurrency(totalExpenses)}
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
              style={[
                styles.filterTab,
                { backgroundColor: activeFilter === filter ? colors.primary : "transparent" }
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: activeFilter === filter ? colors.surface : colors.textSecondary }
                ]}
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
                  onPress={() => navigation.navigate("TransactionDetails", { id: transaction.id })}
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
                        {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
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

      <Modal
        visible={showDeleteModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <AlertTriangle size={48} color={colors.danger} />
              <Text style={[styles.modalTitle, { color: colors.text }]}>Delete Account</Text>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={[styles.modalText, { color: colors.textSecondary }]}>
                Are you sure you want to delete this account? This action cannot be undone.
              </Text>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.glass.background }]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.danger }]}
                onPress={handleDeleteAccount}
              >
                <Text style={[styles.modalButtonText, { color: colors.surface }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showGoalModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGoalModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Target size={48} color={colors.primary} />
              <Text style={[styles.modalTitle, { color: colors.text }]}>Set Savings Goal</Text>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={[styles.modalText, { color: colors.textSecondary }]}>
                Enter your savings goal amount
              </Text>
              <TextInput
                style={[styles.goalInput, { 
                  backgroundColor: colors.glass.background,
                  color: colors.text,
                  borderColor: colors.glass.border
                }]}
                placeholder="Enter amount"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                value={goalAmount}
                onChangeText={setGoalAmount}
              />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.glass.background }]}
                onPress={() => setShowGoalModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleSetGoal}
              >
                <Text style={[styles.modalButtonText, { color: colors.surface }]}>Set Goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
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
  balanceContainer: {
    marginBottom: 24,
  },
  balanceSection: {
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "700",
  },
  goalSection: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  goalLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  goalAmount: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    textAlign: "right",
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    borderRadius: 20,
    padding: 24,
    elevation: 5,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
  },
  modalBody: {
    marginVertical: 16,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  setGoalButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  noGoalText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
  },
  goalInput: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginTop: 16,
    fontSize: 16,
    borderWidth: 1,
  },
}) 