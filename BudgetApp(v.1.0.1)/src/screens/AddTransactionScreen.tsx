"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { MainTabNavigationProp } from "../types/navigation"
import { useTheme } from "../context/ThemeContext"
import { LinearGradient } from "expo-linear-gradient"
import {
  ArrowLeft,
  CreditCard,
  PiggyBank,
} from "lucide-react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useFinance } from "../context/FinanceContext"

const { width } = Dimensions.get("window")

// Add constants for bottom spacing
const TAB_BAR_HEIGHT = 88
const BOTTOM_SPACING = Platform.select({
  ios: 24,
  android: 16,
  default: 16,
})
const TOTAL_BOTTOM_HEIGHT = TAB_BAR_HEIGHT + BOTTOM_SPACING

type TransactionType = "income" | "expense"

export default function AddTransactionScreen() {
  const navigation = useNavigation<MainTabNavigationProp>()
  const route = useRoute()
  const { selectedAccountId: initialAccountId } = route.params as { selectedAccountId?: string } || {}
  const { colors } = useTheme()
  const { addTransaction, accounts } = useFinance()
  const [amount, setAmount] = useState("")
  const [transactionType, setTransactionType] = useState<TransactionType>("expense")
  const [note, setNote] = useState("")
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(initialAccountId || null)

  // Handle amount input changes
  const handleAmountChange = (text: string) => {
    // Remove any non-numeric characters except decimal point
    const cleanedText = text.replace(/[^0-9.]/g, '')
    
    // Ensure only one decimal point
    const parts = cleanedText.split('.')
    if (parts.length > 2) {
      return
    }
    
    // Ensure only 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return
    }
    
    // Don't allow multiple leading zeros
    if (parts[0].length > 1 && parts[0][0] === '0') {
      return
    }
    
    setAmount(cleanedText)
  }

  // Filter accounts by type
  const generalAccounts = accounts.filter(account => account.type === "general")
  const savingsAccounts = accounts.filter(account => account.type === "savings")

  const handleSave = async () => {
    if (!amount || !selectedAccountId) {
      console.log("Validation failed:", { amount, selectedAccountId });
      alert("Please enter an amount and select an account");
      return;
    }

    try {
      // Get the selected account
      const account = accounts.find(acc => acc.id === selectedAccountId);
      
      if (!account) {
        console.log("Account not found:", selectedAccountId);
        alert("Selected account not found");
        return;
      }

      const parsedAmount = parseFloat(amount);
      
      if (isNaN(parsedAmount)) {
        console.log("Invalid amount:", amount);
        alert("Please enter a valid amount");
        return;
      }

      // Check minimum amount requirement
      const MINIMUM_AMOUNT = 0.01;
      if (parsedAmount < MINIMUM_AMOUNT) {
        console.log("Amount too small:", parsedAmount);
        alert("Transaction amount must be at least $0.01");
        return;
      }

      // For expenses, check if account has sufficient balance
      if (transactionType === "expense" && parsedAmount > account.balance) {
        console.log("Insufficient funds:", { balance: account.balance, amount: parsedAmount });
        alert(`Insufficient funds in ${account.name}. Available balance: $${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`);
        return;
      }

      // Create transaction object
      const newTransaction = {
        type: transactionType,
        amount: parsedAmount,
        date: new Date().toISOString(),
        description: note || `${transactionType === "expense" ? "Expense" : "Income"} - ${account.name}`,
        accountId: account.id,
        icon: account.type === "savings" ? "piggy-bank" : "credit-card"
      };

      console.log("Saving transaction:", newTransaction);

      // Save transaction using finance context
      await addTransaction(newTransaction);
      
      // Clear form
      setAmount("");
      setNote("");
      setSelectedAccountId(null);
      
      // Navigate back
      navigation.goBack();
    } catch (error) {
      console.error("Error saving transaction:", error);
      alert("Failed to save transaction. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -150}
    >
      <LinearGradient colors={[colors.gradient[0], colors.gradient[1]]} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={colors.surface} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.surface }]}>Add Transaction</Text>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          {/* Transaction Type Selector */}
          <Text style={[styles.label, { color: colors.text }]}>Transaction Type</Text>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                {
                  backgroundColor: transactionType === "expense" ? colors.primary : colors.glass.background,
                  borderColor: transactionType === "expense" ? colors.primary : colors.glass.border,
                },
              ]}
              onPress={() => setTransactionType("expense")}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  {
                    color: transactionType === "expense" ? colors.surface : colors.text,
                  },
                ]}
              >
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                {
                  backgroundColor: transactionType === "income" ? colors.primary : colors.glass.background,
                  borderColor: transactionType === "income" ? colors.primary : colors.glass.border,
                },
              ]}
              onPress={() => setTransactionType("income")}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  {
                    color: transactionType === "income" ? colors.surface : colors.text,
                  },
                ]}
              >
                Income
              </Text>
            </TouchableOpacity>
          </View>

          {/* Amount Input */}
          <Text style={[styles.label, { color: colors.text }]}>Amount</Text>
          <View style={styles.amountInputContainer}>
            <Text style={[styles.currencySymbol, { color: colors.text }]}>$</Text>
            <TextInput
              style={[
                styles.amountInput,
                {
                  backgroundColor: colors.glass.background,
                  borderColor: colors.glass.border,
                  color: colors.text,
                },
              ]}
              placeholder="0.00"
              placeholderTextColor={colors.textSecondary}
              value={amount}
              onChangeText={handleAmountChange}
              keyboardType="decimal-pad"
            />
          </View>

          {/* Account Selection */}
          <Text style={[styles.label, { color: colors.text }]}>Select Account</Text>
          
          {/* General Accounts Section */}
          {generalAccounts.length > 0 && (
            <View style={styles.accountSection}>
              <View style={styles.accountSectionHeader}>
                <CreditCard size={18} color={colors.textSecondary} />
                <Text style={[styles.accountSectionTitle, { color: colors.textSecondary }]}>
                  General Accounts
                </Text>
              </View>
              <View style={styles.accountList}>
                {generalAccounts.map((account) => (
                  <TouchableOpacity
                    key={account.id}
                    style={[
                      styles.accountItem,
                      {
                        backgroundColor: selectedAccountId === account.id ? account.color + "20" : colors.glass.background,
                        borderColor: selectedAccountId === account.id ? account.color : colors.glass.border,
                      },
                    ]}
                    onPress={() => setSelectedAccountId(account.id)}
                  >
                    <View style={styles.accountItemContent}>
                      <View style={[styles.accountIcon, { backgroundColor: account.color + "20" }]}>
                        <CreditCard size={18} color={account.color} />
                      </View>
                      <View style={styles.accountDetails}>
                        <Text
                          style={[
                            styles.accountName,
                            { color: selectedAccountId === account.id ? account.color : colors.text },
                          ]}
                        >
                          {account.name}
                        </Text>
                        <Text
                          style={[
                            styles.accountBalance,
                            { color: selectedAccountId === account.id ? account.color : colors.textSecondary },
                          ]}
                        >
                          ${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </Text>
                      </View>
                    </View>
                    {selectedAccountId === account.id && (
                      <View style={[styles.selectedIndicator, { backgroundColor: account.color }]} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          
          {/* Savings Accounts Section */}
          {savingsAccounts.length > 0 && (
            <View style={styles.accountSection}>
              <View style={styles.accountSectionHeader}>
                <PiggyBank size={18} color={colors.textSecondary} />
                <Text style={[styles.accountSectionTitle, { color: colors.textSecondary }]}>
                  Savings Accounts
                </Text>
              </View>
              <View style={styles.accountList}>
                {savingsAccounts.map((account) => (
                  <TouchableOpacity
                    key={account.id}
                    style={[
                      styles.accountItem,
                      {
                        backgroundColor: selectedAccountId === account.id ? account.color + "20" : colors.glass.background,
                        borderColor: selectedAccountId === account.id ? account.color : colors.glass.border,
                      },
                    ]}
                    onPress={() => setSelectedAccountId(account.id)}
                  >
                    <View style={styles.accountItemContent}>
                      <View style={[styles.accountIcon, { backgroundColor: account.color + "20" }]}>
                        <PiggyBank size={18} color={account.color} />
                      </View>
                      <View style={styles.accountDetails}>
                        <Text
                          style={[
                            styles.accountName,
                            { color: selectedAccountId === account.id ? account.color : colors.text },
                          ]}
                        >
                          {account.name}
                        </Text>
                        <Text
                          style={[
                            styles.accountBalance,
                            { color: selectedAccountId === account.id ? account.color : colors.textSecondary },
                          ]}
                        >
                          ${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </Text>
                      </View>
                    </View>
                    {selectedAccountId === account.id && (
                      <View style={[styles.selectedIndicator, { backgroundColor: account.color }]} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Note Input */}
          <Text style={[styles.label, { color: colors.text }]}>Note (Optional)</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.glass.background,
                borderColor: colors.glass.border,
                color: colors.text,
              },
            ]}
            placeholder="Add a note"
            placeholderTextColor={colors.textSecondary}
            value={note}
            onChangeText={setNote}
            multiline
          />

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSave}
          >
            <Text style={[styles.saveButtonText, { color: colors.surface }]}>Save Transaction</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 16,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  typeSelector: {
    flexDirection: "row",
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  amountInputContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  currencySymbol: {
    position: 'absolute',
    left: 16,
    top: 16,
    fontSize: 24,
    fontWeight: '500',
    zIndex: 1,
  },
  amountInput: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingLeft: 36,
    fontSize: 24,
    textAlign: 'right',
  },
  accountSection: {
    marginBottom: 24,
  },
  accountSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  accountSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  accountList: {
    gap: 8,
  },
  accountItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  accountItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  accountIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  accountDetails: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: "500",
  },
  accountBalance: {
    fontSize: 14,
    marginTop: 2,
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  saveButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: TOTAL_BOTTOM_HEIGHT + (Platform.OS === "ios" ? 50 : 20),
  },
  input: {
    height: 80,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    textAlignVertical: 'top',
  },
})
