"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native"
import { useTheme, globalStyles } from "../context/ThemeContext"
import type { MainTabNavigationProp } from "../types/navigation"
import { LinearGradient } from "expo-linear-gradient"
import { ArrowLeft, Plus, Calendar, TrendingUp, TrendingDown, CreditCard, PiggyBank, Home, ShoppingBag, Bus, Tv, Briefcase, Plane, Gift, PartyPopper, AlertTriangle, Trash2 } from "lucide-react-native"
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
  const { accounts, transactions, deleteAccount } = useFinance()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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

  const handleDeleteAccount = async () => {
    try {
      console.log("AccountDetailsScreen: Starting account deletion for:", accountId);
      setShowDeleteConfirm(false); // Hide the confirmation modal first
      
      // Delete the account and wait for it to complete
      const success = await deleteAccount(accountId);
      
      if (success) {
        console.log("AccountDetailsScreen: Account deleted successfully, navigating back");
        // Force navigation back to accounts screen
        navigation.goBack();
      } else {
        console.error("AccountDetailsScreen: Failed to delete account");
        alert("Failed to delete account. Please try again.");
      }
    } catch (error) {
      console.error("AccountDetailsScreen: Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
      setShowDeleteConfirm(false);
    }
  };

  // Get transactions for this account
  const accountTransactions = transactions
    .filter(t => t.accountId === accountData.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  console.log("AccountDetailsScreen: Filtered transactions:", {
    accountId: accountData.id,
    totalTransactions: transactions.length,
    filteredTransactions: accountTransactions.length
  });

  // Filter transactions based on type
  const filteredTransactions = accountTransactions.filter((transaction) => {
    if (activeFilter === "all") return true;
    return transaction.type === activeFilter;
  });

  console.log("AccountDetailsScreen: Active filter transactions:", {
    filter: activeFilter,
    count: filteredTransactions.length
  });

  // Calculate totals
  const totalIncome = accountTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = accountTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  console.log("AccountDetailsScreen: Account totals:", {
    accountId: accountData.id,
    balance: accountData.balance,
    totalIncome,
    totalExpenses,
    calculatedBalance: totalIncome - totalExpenses
  });

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
        colors={accountData.type === "savings" 
          ? [colors.accountTypes.savings.gradient[0], colors.accountTypes.savings.gradient[1]] 
          : [colors.accountTypes.general.gradient[0], colors.accountTypes.general.gradient[1]]}
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
              style={[styles.deleteButton, { backgroundColor: "rgba(255,255,255,0.15)" }]} 
              onPress={() => setShowDeleteConfirm(true)}
            >
              <Trash2 size={20} color={colors.danger} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.addButton, { 
                backgroundColor: "rgba(255,255,255,0.25)",
                borderColor: "rgba(255,255,255,0.35)" 
              }]}
              onPress={() => navigation.navigate("AddTransaction", { selectedAccountId: accountData.id })}
            >
              <Plus size={22} color={colors.surface} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.accountCard, { 
          backgroundColor: "rgba(255,255,255,0.15)",
          borderColor: "rgba(255,255,255,0.25)"
        }]}>
          <View style={styles.accountHeader}>
            <View style={[styles.iconContainer, { 
              backgroundColor: `${accountData.type === "savings" ? colors.accountTypes.savings.primary : colors.accountTypes.general.primary}25`
            }]}>
              <AccountIcon size={24} color={accountData.type === "savings" ? colors.accountTypes.savings.primary : colors.accountTypes.general.primary} />
            </View>
            <View style={styles.accountInfo}>
              <Text style={[styles.accountName, { color: colors.surface }]}>{accountData.name}</Text>
              <Text style={[styles.accountType, { color: colors.surface, opacity: 0.9 }]}>
                {accountData.type.charAt(0).toUpperCase() + accountData.type.slice(1)} Account
              </Text>
            </View>
          </View>
          <Text style={[styles.balanceAmount, { color: colors.surface }]}>
            ${accountData.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </Text>
          <View style={styles.balanceMetrics}>
            <View style={[styles.metric, { 
              backgroundColor: "rgba(255,255,255,0.2)",
              borderColor: "rgba(255,255,255,0.25)"
            }]}>
              <TrendingUp size={20} color={colors.surface} />
              <Text style={[styles.metricLabel, { color: colors.surface }]}>Income</Text>
              <Text style={[styles.metricAmount, { color: colors.surface }]}>
                +${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={[styles.metric, { 
              backgroundColor: "rgba(255,255,255,0.2)",
              borderColor: "rgba(255,255,255,0.25)"
            }]}>
              <TrendingDown size={20} color={colors.surface} />
              <Text style={[styles.metricLabel, { color: colors.surface }]}>Expenses</Text>
              <Text style={[styles.metricAmount, { color: colors.surface }]}>
                -${totalExpenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <View style={[styles.modalOverlay, { backgroundColor: "rgba(0,0,0,0.7)" }]}>
          <View style={[styles.modalContent, { 
            backgroundColor: colors.surface,
            borderColor: colors.glass.border
          }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Delete Account?</Text>
            <Text style={[styles.modalMessage, { color: colors.textSecondary }]}>
              Are you sure you want to delete "{accountData.name}"? This will also delete all related transactions and cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: colors.glass.background }]}
                onPress={() => setShowDeleteConfirm(false)}
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
      )}

      <View style={styles.content}>
        <View style={[styles.filterContainer, { 
          backgroundColor: colors.glass.background,
          borderColor: colors.glass.border
        }]}>
          {["all", "income", "expense"].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTab, 
                { 
                  backgroundColor: activeFilter === filter 
                    ? (accountData.type === "savings" ? colors.accountTypes.savings.primary : colors.accountTypes.general.primary)
                    : "transparent" 
                }
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText, 
                  { 
                    color: activeFilter === filter 
                      ? colors.surface 
                      : colors.textSecondary,
                    fontWeight: activeFilter === filter ? "600" : "400"
                  }
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    width: '80%',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}) 